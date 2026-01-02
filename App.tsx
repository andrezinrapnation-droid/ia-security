
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { ConceptExplainer } from './components/features/ConceptExplainer';
import { VulnerabilityScanner } from './components/features/VulnerabilityScanner';
import { AttackSimulator } from './components/features/AttackSimulator';
import { QuizGenerator } from './components/features/QuizGenerator';
import { Chat } from './components/features/Chat';
import { ApiKeyModal } from './components/ApiKeyModal';
import type { Tab } from './types';

export const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('chat');
    const [apiKey, setApiKey] = useState<string | null>(null);

    useEffect(() => {
        const storedApiKey = localStorage.getItem('gemini-api-key');
        if (storedApiKey) {
            setApiKey(storedApiKey);
        }
    }, []);

    const handleApiKeySave = (key: string) => {
        localStorage.setItem('gemini-api-key', key);
        setApiKey(key);
    };

    const renderContent = () => {
        if (!apiKey) return null; // Não renderize o conteúdo principal se não houver chave

        switch (activeTab) {
            case 'chat':
                return <Chat apiKey={apiKey} />;
            case 'explainer':
                return <ConceptExplainer apiKey={apiKey} />;
            case 'scanner':
                return <VulnerabilityScanner apiKey={apiKey} />;
            case 'simulator':
                return <AttackSimulator apiKey={apiKey} />;
            case 'quiz':
                return <QuizGenerator apiKey={apiKey} />;
            default:
                return <Chat apiKey={apiKey} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-slate-200 font-mono flex flex-col">
            {!apiKey && <ApiKeyModal onSave={handleApiKeySave} />}
            <div className={!apiKey ? 'blur-sm pointer-events-none' : ''}>
                <Header />
                <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
                    <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="mt-6 flex-grow flex flex-col">
                        {renderContent()}
                    </div>
                </main>
                <footer className="text-center p-4 text-slate-500 text-xs border-t border-slate-800">
                    Desenvolvido com Gemini. Apenas para fins educacionais.
                </footer>
            </div>
        </div>
    );
};
