
import React, { useState, useCallback } from 'react';
import { ExplanationDisplay } from '../ExplanationDisplay';
import { LoadingSpinner } from '../LoadingSpinner';
import { getAttackSimulation } from '../../services/geminiService';
import { CrosshairIcon } from '../icons/CrosshairIcon';

const attackTypes = [
    'Phishing',
    'DDoS (Negação de Serviço)',
    'Injeção de SQL',
    'Man-in-the-Middle',
    'Malware (Ransomware)',
];

interface AttackSimulatorProps {
    apiKey: string;
}

export const AttackSimulator: React.FC<AttackSimulatorProps> = ({ apiKey }) => {
    const [simulation, setSimulation] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeAttack, setActiveAttack] = useState<string>('');

    const handleSimulate = useCallback(async (attackType: string) => {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);
        setSimulation('');
        setActiveAttack(attackType);

        try {
            const result = await getAttackSimulation(apiKey, attackType);
            setSimulation(result);
        } catch (err)
 {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, apiKey]);

    return (
        <div className="flex flex-col h-full">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 shadow-lg w-full backdrop-blur-sm">
                <p className="block text-sm font-medium text-slate-400 mb-3 text-center">
                    Selecione um ciberataque comum para simular sua execução e aprender a se defender contra ele.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    {attackTypes.map((attack) => (
                        <button
                            key={attack}
                            onClick={() => handleSimulate(attack)}
                            disabled={isLoading}
                            className="bg-red-900/60 text-red-200 font-bold py-2 px-4 rounded-md flex items-center gap-2 border border-red-700/50 hover:bg-red-800/60 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading && activeAttack === attack ? 'Simulando...' : attack}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex-grow">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <LoadingSpinner />
                        <p className="mt-4 text-indigo-400 animate-pulse">Iniciando simulação...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">
                        <h3 className="font-bold">Erro</h3>
                        <p>{error}</p>
                    </div>
                ) : simulation ? (
                    <ExplanationDisplay content={simulation} />
                ) : (
                    <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full">
                        <CrosshairIcon className="w-24 h-24 mb-4 text-slate-700" />
                        <h2 className="text-2xl text-slate-400 mb-2">Simulador de Ataques</h2>
                        <p className="max-w-xl">
                           Escolha um ataque nas opções acima para ver uma análise detalhada da ameaça.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
