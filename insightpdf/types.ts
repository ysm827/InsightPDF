export interface LocatorResult {
  answer: string; // The conversational response
  pageNumber?: number;
  // Bounding box: [ymin, xmin, ymax, xmax] normalized to 0-1000
  box2d?: [number, number, number, number]; 
  snippet?: string;
  reasoning?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  locationData?: LocatorResult; // AI messages might have location data
  timestamp: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING_FILE = 'PROCESSING_FILE',
  SEARCHING = 'SEARCHING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

/** Collision-safe id generator (crypto.randomUUID with a graceful fallback). */
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};
