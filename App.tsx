
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { ConceptExplainer } from './components/features/ConceptExplainer';
import { VulnerabilityScanner } from './components/features/VulnerabilityScanner';
import { AttackSimulator } from './components/features/AttackSimulator';
import { QuizGenerator } from './components/features/QuizGenerator';

export type Tab = 'explainer' | 'scanner' | 'simulator' | 'quiz';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('explainer');

    const renderContent = () => {
        switch (activeTab) {
            case 'explainer':
                return <ConceptExplainer />;
            case 'scanner':
                return <VulnerabilityScanner />;
            case 'simulator':
                return <AttackSimulator />;
            case 'quiz':
                return <QuizGenerator />;
            default:
                return <ConceptExplainer />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-slate-200 font-mono flex flex-col">
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
    );
};

export default App;
