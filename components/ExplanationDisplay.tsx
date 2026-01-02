
import React from 'react';
// We'll use a library to safely render markdown.
// For this environment, we'll parse and render manually to avoid external dependencies.
// A more robust solution would use react-markdown.

interface ExplanationDisplayProps {
    content: string;
}

// Simple component to render text with markdown-like formatting using Tailwind prose
export const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({ content }) => {
    // This is a basic simulation of how to inject HTML from markdown.
    // In a real app, use a library like `react-markdown` with `remark-gfm` for security and features.
    // The Gemini prompt asks for markdown, and Tailwind's typography plugin will style it.
    // We will simulate this by replacing markdown with HTML and letting prose style it.

    const renderContent = () => {
        let htmlContent = content
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            // Code blocks
            .replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
                 return `<pre><code class="language-${lang}">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
            })
            // Inline code
            .replace(/`(.*?)`/g, '<code>$1</code>')
             // Headings
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Lists
            .replace(/^\s*\n\*/gm, '<ul>\n*')
            .replace(/^(\*.+)\s*\n([^*])/gm, '$1\n</ul>\n\n$2')
            .replace(/^\s*\*/gm, '<li>')
            .replace(/^\s*(\d+\.)/gm, '<ol>\n1.')
            .replace(/^(\d+\..+)\s*\n([^\d])/gm, '$1\n</ol>\n\n$2')
            .replace(/^\s*\d+\./gm, '<li>')
            // New lines
            .replace(/\n/g, '<br />')
            // Fix list line breaks
            .replace(/<br \/><li>/g, '<li>')
            .replace(/<\/li><br \/>/g, '</li>')
            .replace(/<\/ul><br \/>/g, '</ul>')
            .replace(/<\/ol><br \/>/g, '</ul>')
            .replace(/<br \/><\/ul>/g, '</ul>')
            .replace(/<br \/><\/ol>/g, '</ol>')
             // Fix heading line breaks
            .replace(/<\/h3><br \/>/g, '</h3>')
            .replace(/<\/h2><br \/>/g, '</h2>')
            .replace(/<\/h1><br \/>/g, '</h1>');


        // Close any open list tags
        const openUl = (htmlContent.match(/<ul>/g) || []).length;
        const closedUl = (htmlContent.match(/<\/ul>/g) || []).length;
        if (openUl > closedUl) htmlContent += '</ul>';

        const openOl = (htmlContent.match(/<ol>/g) || []).length;
        const closedOl = (htmlContent.match(/<\/ol>/g) || []).length;
        if (openOl > closedOl) htmlContent += '</ol>';

        return { __html: htmlContent };
    };

    return (
        <article className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 w-full prose prose-invert max-w-none backdrop-blur-sm">
            <div dangerouslySetInnerHTML={renderContent()} />
        </article>
    );
};
