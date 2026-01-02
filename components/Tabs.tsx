
import React from 'react';
import type { Tab } from '../App';
import { ShieldIcon } from './icons/ShieldIcon';
import { SearchIcon } from './icons/SearchIcon';
import { CrosshairIcon } from './icons/CrosshairIcon';
import { BeakerIcon } from './icons/BeakerIcon';

interface TabsProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const tabConfig = [
    { id: 'explainer', label: 'Explicador de Conceitos', icon: ShieldIcon },
    { id: 'scanner', label: 'Analisador de Vulnerabilidades', icon: SearchIcon },
    { id: 'simulator', label: 'Simulador de Ataques', icon: CrosshairIcon },
    { id: 'quiz', label: 'Gerador de Quiz', icon: BeakerIcon },
];

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-2 flex items-center justify-center sm:justify-start gap-2 flex-wrap backdrop-blur-sm">
            {tabConfig.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-400 ${
                            isActive
                                ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-600/20'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};
