import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat as GeminiChat } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TerminalIcon } from '../icons/TerminalIcon';
import { ShieldIcon } from '../icons/ShieldIcon';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface ChatProps {
    apiKey: string;
}

export const Chat: React.FC<ChatProps> = ({ apiKey }) => {
    const [chat, setChat] = useState<GeminiChat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = () => {
            if (!apiKey) return;
            try {
                const ai = new GoogleGenAI({ apiKey });
                const newChat = ai.chats.create({
                    model: 'gemini-3-pro-preview',
                    config: {
                        systemInstruction: 'Você é o Mentor de Cibersegurança AI, um chatbot amigável e prestativo. Seu papel é atuar como um tutor conversacional para estudantes de cibersegurança, respondendo suas perguntas de forma clara e concisa. Use formatação Markdown quando apropriado para melhorar a legibilidade.',
                    },
                });
                setChat(newChat);
                setMessages([
                    { role: 'model', text: 'Olá! Eu sou seu Mentor de Cibersegurança. Como posso ajudar você a aprender sobre segurança digital hoje?' }
                ]);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Falha ao inicializar o chat. Verifique se sua chave de API é válida.');
                console.error(e);
            }
        };
        initChat();
    }, [apiKey]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = useCallback(async () => {
        if (isLoading || !currentMessage.trim() || !chat) return;

        const userMessage: Message = { role: 'user', text: currentMessage };
        setMessages(prev => [...prev, userMessage]);
        setCurrentMessage('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await chat.sendMessage({ message: userMessage.text });
            const modelResponse: Message = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelResponse]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
            setError(errorMessage);
            setMessages(prev => [...prev, { role: 'model', text: `Desculpe, ocorreu um erro: ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    }, [chat, currentMessage, isLoading]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[70vh] bg-slate-900/50 border border-slate-700/50 rounded-lg shadow-lg backdrop-blur-sm">
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center">
                                    <ShieldIcon className="w-5 h-5 text-sky-400" />
                                </div>
                            )}
                            <div className={`max-w-lg px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                {msg.role === 'user' ? (
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                ) : (
                                    <div className="prose prose-sm prose-invert max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-3 justify-start">
                             <div className="w-8 h-8 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center">
                                <ShieldIcon className="w-5 h-5 text-sky-400" />
                            </div>
                            <div className="max-w-lg px-4 py-3 rounded-xl bg-slate-800 text-slate-300">
                                <div className="flex items-center justify-center space-x-1">
                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}
                     <div ref={messagesEndRef} />
                </div>
            </div>
            {error && <div className="p-2 text-center text-xs text-red-400 border-t border-slate-700/50">{error}</div>}
            <div className="p-4 border-t border-slate-700/50">
                <div className="relative">
                    <textarea
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Digite sua pergunta aqui..."
                        rows={1}
                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg p-3 pr-20 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none text-slate-200 placeholder-slate-500"
                        disabled={isLoading || !chat}
                    />
                     <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !currentMessage.trim() || !chat}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold p-2 rounded-full flex items-center justify-center w-10 h-10 hover:from-indigo-700 hover:to-blue-600 transition-all duration-200 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-400"
                        aria-label="Enviar mensagem"
                    >
                        <TerminalIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};