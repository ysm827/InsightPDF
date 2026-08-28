import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const markdownComponents = {
  a: (props: React.ComponentProps<'a'>) => (
    <a {...props} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline break-words" />
  ),
  p: (props: React.ComponentProps<'p'>) => (
    <p {...props} className="mb-2 last:mb-0 leading-relaxed" />
  ),
  ul: (props: React.ComponentProps<'ul'>) => (
    <ul {...props} className="list-disc pl-5 mb-2 space-y-1" />
  ),
  ol: (props: React.ComponentProps<'ol'>) => (
    <ol {...props} className="list-decimal pl-5 mb-2 space-y-1" />
  ),
  li: (props: React.ComponentProps<'li'>) => <li {...props} className="pl-1" />,
  strong: (props: React.ComponentProps<'strong'>) => (
    <strong {...props} className="font-semibold" />
  ),
  pre: (props: React.ComponentProps<'pre'>) => (
    <pre
      {...props}
      className="bg-gray-800 dark:bg-gray-900/50 text-gray-100 p-3 rounded-lg overflow-x-auto my-2 text-xs font-mono border border-gray-700"
    />
  ),
  code: ({ className, ...props }: React.ComponentProps<'code'>) => {
    const isBlock = /language-(\w+)/.exec(className || '');
    if (isBlock) {
      return <code {...props} className={`font-mono text-xs ${className}`} />;
    }
    return (
      <code
        {...props}
        className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono text-pink-600 dark:text-pink-400 break-all"
      />
    );
  },
};

interface MarkdownRendererProps {
  content: string;
}

/** Memoized so long chat histories don't re-parse unchanged messages. */
const MarkdownRenderer = React.memo<MarkdownRendererProps>(({ content }) => (
  <ReactMarkdown
    className="space-y-2"
    remarkPlugins={[remarkMath]}
    rehypePlugins={[rehypeKatex]}
    components={markdownComponents}
  >
    {content}
  </ReactMarkdown>
));

MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;
