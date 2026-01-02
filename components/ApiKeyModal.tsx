
import React, { useState } from 'react';

interface ApiKeyModalProps {
    onSave: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
    const [key, setKey] = useState('');

    const handleSave = () => {
        if (key.trim()) {
            onSave(key.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-slate-800/80 border border-indigo-500/30 rounded-lg shadow-2xl p-8 max-w-lg w-full text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Configurar Chave de API do Gemini</h2>
                <p className="text-slate-400 mb-6">
                    Para usar este aplicativo, por favor, insira sua chave de API do Google AI Studio. Sua chave será salva localmente no seu navegador.
                </p>
                <div className="flex flex-col gap-4">
                    <input
                        type="password"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="Cole sua Chave de API aqui"
                        className="w-full bg-slate-700 border-2 border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-200 placeholder-slate-500"
                    />
                    <button
                        onClick={handleSave}
                        disabled={!key.trim()}
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 rounded-md hover:from-indigo-700 hover:to-blue-600 transition-all disabled:from-slate-600 disabled:to-slate-700 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        Salvar e Iniciar
                    </button>
                </div>
                 <p className="text-xs text-slate-500 mt-4">
                    Você pode obter sua chave no <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Google AI Studio</a>.
                </p>
            </div>
        </div>
    );
};
