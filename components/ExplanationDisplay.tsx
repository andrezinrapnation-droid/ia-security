import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ExplanationDisplayProps {
    content: string;
}

export const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({ content }) => {
    return (
        <article className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 w-full prose prose-invert max-w-none backdrop-blur-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </article>
    );
};