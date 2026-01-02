
import React from 'react';
import { TerminalIcon } from './icons/TerminalIcon';

interface CyberInputProps {
    query: string;
    setQuery: (query: string) => void;
    onAnalyze: () => void;
    isLoading: boolean;
    label: string;
    placeholder: string;
    buttonText: string;
    rows?: number;
}

export const CyberInput: React.FC<CyberInputProps> = ({ query, setQuery, onAnalyze, isLoading, label, placeholder, buttonText, rows = 3 }) => {
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onAnalyze();
        }
    };

    return (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 shadow-lg w-full backdrop-blur-sm">
            <label htmlFor="cyber-query" className="block text-sm font-medium text-slate-400 mb-2">
                {label}
            </label>
            <div className="relative">
                <textarea
                    id="cyber-query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={rows}
                    className="w-full bg-slate-800/60 border-2 border-slate-700 rounded-md p-3 pr-40 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none text-slate-200 placeholder-slate-500"
                    disabled={isLoading}
                />
                <button
                    onClick={onAnalyze}
                    disabled={isLoading || !query.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 hover:from-indigo-700 hover:to-blue-600 transition-all duration-200 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-400"
                >
                    <TerminalIcon className="w-5 h-5" />
                    {isLoading ? 'Processando...' : buttonText}
                </button>
            </div>
        </div>
    );
};
