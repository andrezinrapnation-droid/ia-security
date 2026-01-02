
import React from 'react';
import { ShieldIcon } from './icons/ShieldIcon';

export const Header: React.FC = () => {
    return (
        <header className="w-full bg-slate-900/60 backdrop-blur-sm border-b border-indigo-500/30 p-4 sticky top-0 z-10">
            <div className="container mx-auto flex items-center justify-center gap-3">
                <ShieldIcon className="w-8 h-8 text-sky-400" />
                <h1 className="text-2xl font-bold text-slate-100 tracking-wider">
                    Mentor de Cibersegurança AI
                </h1>
            </div>
        </header>
    );
};
