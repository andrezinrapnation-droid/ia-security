
import React from 'react';

interface ExamplePromptsProps {
    onSelect: (prompt: string) => void;
}

const prompts = [
    'O que é Cross-Site Scripting (XSS)?',
    'Explique como funciona um ataque DDoS.',
    'Descreva o framework MITRE ATT&CK.',
    'Como um ransomware opera?',
];

export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onSelect }) => {
    return (
        <div>
            <p className="text-slate-400 mb-4">Ou tente um destes exemplos:</p>
            <div className="flex flex-wrap justify-center gap-3">
                {prompts.map((prompt) => (
                    <button
                        key={prompt}
                        onClick={() => onSelect(prompt)}
                        className="bg-slate-800/70 text-slate-300 px-4 py-2 rounded-full text-sm hover:bg-slate-700/90 hover:text-sky-300 border border-slate-700 transition-colors"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
    );
};
