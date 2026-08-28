import { GoogleGenAI, Type } from "@google/genai";
import type { LocatorResult } from '../types';
import { storage } from './storageService';

/** Single request timeout — Gemini can hang on very large documents. */
const REQUEST_TIMEOUT_MS = 120_000;

/** Rejects if the wrapped promise does not settle within `ms`. */
const withTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`${label} 超时（${Math.round(ms / 1000)}s），请重试或更换模型。`)),
      ms
    );
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); }
    );
  });

const getClient = () => {
  const customConfig = storage.getCustomConfig();
  let apiKey = (customConfig.enabled && customConfig.apiKey)
    ? customConfig.apiKey
    : import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please set GEMINI_API_KEY in .env.local or configure a custom key in settings.");
  }

  // Strong cleaning: Remove all spaces, newlines (\n), and carriage returns (\r).
  // Copy-pasting often introduces invisible characters causing "API key not valid" errors.
  apiKey = apiKey.replace(/[\n\r\s]/g, '');

  // NOTE: BaseURL handling lives in services/networkInterceptor.ts.
  // This prevents the SDK from generating malformed URLs (like /v1beta/v1beta)
  // and handles both /upload and standard endpoints uniformly via global fetch interception.

  return new GoogleGenAI({ apiKey });
};

export interface GenerativeFilePart {
  inlineData?: { data: string; mimeType: string };
  fileData?: { data?: string; mimeType: string; fileUri?: string };
}

export const fileToGenerativePart = async (file: File): Promise<GenerativeFilePart> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data ?? '',
          mimeType: file.type,
        },
      });
    };
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
};

export const uploadFileToGemini = async (file: File): Promise<string> => {
  const ai = getClient();

  const response = await withTimeout(
    ai.files.upload({
      file: file,
      config: {
        mimeType: file.type,
        displayName: file.name
      }
    }),
    REQUEST_TIMEOUT_MS,
    '文件上传'
  );

  if (!response.uri) {
    throw new Error('Upload succeeded but no file URI was returned.');
  }
  return response.uri;
};


interface RawLocatorResponse {
  answer?: string;
  foundLocation?: boolean;
  pageNumber?: number;
  box2d?: number[];
  snippet?: string;
  reasoning?: string;
}

export const chatWithPdf = async (
  filePart: GenerativeFilePart,
  query: string,
  modelName: string
): Promise<LocatorResult> => {
  const ai = getClient();

  // Schema handles both a conversational answer and optional location data
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      answer: {
        type: Type.STRING,
        description: "The natural language answer to the user's question.",
      },
      foundLocation: {
        type: Type.BOOLEAN,
        description: "Set to true if specific visual content or text passage was located in the document to answer the query.",
      },
      pageNumber: {
        type: Type.INTEGER,
        description: "The page number where the content is found (1-based index). Set to 0 if not found.",
      },
      box2d: {
        type: Type.ARRAY,
        items: { type: Type.INTEGER },
        description: "The bounding box of the specific text/visual element. Format: [ymin, xmin, ymax, xmax] where the scale is 0 to 1000. 0,0 is top-left.",
      },
      snippet: {
        type: Type.STRING,
        description: "The specific text or short description of the visual element found.",
      },
      reasoning: {
        type: Type.STRING,
        description: "Brief explanation of why this location was chosen.",
      }
    },
    required: ["answer", "foundLocation"],
  };

  const prompt = `
    You are an intelligent PDF assistant. You can answer questions based on the document AND locate specific content visually.
    
    User Query: "${query}"

    Instructions:
    1. First, analyze the document to answer the user's question. Put the answer in the 'answer' field. **IMPORTANT: ALWAYS Answer in Simplified Chinese (简体中文).**
    2. If the user is asking to find something, or if the answer refers to a specific diagram, table, or paragraph, provide the location details.
    3. If providing location:
       - Identify the most relevant page.
       - Identify the specific bounding box coordinates (0-1000 scale) [ymin, xmin, ymax, xmax].
       - Set 'foundLocation' to true.
    4. If the question is general (e.g., "Summarize the file") and no specific location is needed, set 'foundLocation' to false and leave location fields empty or zero.
  `;

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            filePart as never,
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        }
      }),
      REQUEST_TIMEOUT_MS,
      '生成回复'
    );

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    const result = JSON.parse(text) as RawLocatorResponse;
    if (!result.answer) {
      throw new Error("Malformed response from Gemini: missing 'answer'.");
    }
    const hasLocation = result.foundLocation === true;
    const box = hasLocation && Array.isArray(result.box2d) && result.box2d.length === 4
      ? (result.box2d as [number, number, number, number])
      : undefined;
    const pageNumber = hasLocation && result.pageNumber ? result.pageNumber : undefined;

    // Clean up result to match interface
    return {
      answer: result.answer,
      pageNumber,
      box2d: box,
      snippet: hasLocation ? result.snippet : undefined,
      reasoning: hasLocation ? result.reasoning : undefined,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    if (error instanceof SyntaxError) {
      throw new Error("模型返回了无法解析的内容，请重试。");
    }
    throw error;
  }
};