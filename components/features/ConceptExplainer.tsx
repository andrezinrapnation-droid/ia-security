
import React, { useState, useCallback } from 'react';
import { CyberInput } from '../CyberInput';
import { ExplanationDisplay } from '../ExplanationDisplay';
import { ExamplePrompts } from '../ExamplePrompts';
import { LoadingSpinner } from '../LoadingSpinner';
import { getCyberExplanation } from '../../services/geminiService';
import { ShieldIcon } from '../icons/ShieldIcon';

export const ConceptExplainer: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [explanation, setExplanation] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = useCallback(async (prompt: string) => {
        if (!prompt || isLoading) return;

        setIsLoading(true);
        setError(null);
        setExplanation('');

        try {
            const result = await getCyberExplanation(prompt);
            setExplanation(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);
    
    const handlePromptSelect = (prompt: string) => {
        setQuery(prompt);
        handleAnalyze(prompt);
    };

    return (
        <>
            <CyberInput
                query={query}
                setQuery={setQuery}
                onAnalyze={() => handleAnalyze(query)}
                isLoading={isLoading}
                placeholder="Descreva o tópico que você quer entender..."
                label='Digite um conceito de cibersegurança (ex: "Injeção de SQL", "Phishing", "Exploit de dia zero")'
                buttonText="Explicar"
            />

            <div className="mt-6 flex-grow">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <LoadingSpinner />
                        <p className="mt-4 text-indigo-400 animate-pulse">Consultando a base de conhecimento...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">
                        <h3 className="font-bold">Erro</h3>
                        <p>{error}</p>
                    </div>
                ) : explanation ? (
                    <ExplanationDisplay content={explanation} />
                ) : (
                    <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full">
                        <ShieldIcon className="w-24 h-24 mb-4 text-slate-700" />
                        <h2 className="text-2xl text-slate-400 mb-2">Explicador de Conceitos</h2>
                        <p className="max-w-xl mb-6">
                            Digite um tópico, ataque ou conceito de cibersegurança para obter uma explicação detalhada e estruturada.
                        </p>
                        <ExamplePrompts onSelect={handlePromptSelect} />
                    </div>
                )}
            </div>
        </>
    );
};
