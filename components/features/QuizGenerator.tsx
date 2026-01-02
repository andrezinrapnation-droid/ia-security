
import React, { useState, useCallback } from 'react';
import { getQuiz, Quiz, QuizQuestion } from '../../services/geminiService';
import { LoadingSpinner } from '../LoadingSpinner';
import { BeakerIcon } from '../icons/BeakerIcon';

interface QuizGeneratorProps {
    apiKey: string;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({ apiKey }) => {
    const [topic, setTopic] = useState<string>('Cibersegurança Geral');
    const [quizData, setQuizData] = useState<Quiz | null>(null);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateQuiz = useCallback(async () => {
        if (!topic || isLoading) return;
        
        setIsLoading(true);
        setError(null);
        setQuizData(null);
        setUserAnswers({});
        setIsSubmitted(false);

        try {
            const result = await getQuiz(apiKey, topic);
            setQuizData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
        } finally {
            setIsLoading(false);
        }
    }, [topic, isLoading, apiKey]);

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const score = quizData ? Object.entries(userAnswers).reduce((acc, [index, answer]) => {
        return quizData.questions[parseInt(index)].answer === answer ? acc + 1 : acc;
    }, 0) : 0;

    const renderQuiz = () => {
        if (!quizData) return null;
        return (
            <div className="space-y-8">
                {quizData.questions.map((q, index) => (
                    <div key={index} className={`bg-slate-900/50 border backdrop-blur-sm p-6 rounded-lg transition-colors ${
                        isSubmitted
                            ? userAnswers[index] === q.answer
                                ? 'border-sky-500/50'
                                : 'border-red-500/50'
                            : 'border-slate-700/50'
                    }`}>
                        <p className="font-bold text-lg text-slate-200 mb-4">{index + 1}. {q.question}</p>
                        <div className="space-y-3">
                            {q.options.map(option => {
                                const isChecked = userAnswers[index] === option;
                                const isCorrect = q.answer === option;
                                let optionClass = "bg-slate-800/60 hover:bg-slate-700/80 border-slate-700";
                                if (isSubmitted) {
                                    if (isCorrect) optionClass = "bg-sky-800/40 border-sky-600 text-white";
                                    else if (isChecked && !isCorrect) optionClass = "bg-red-800/40 border-red-600 text-white";
                                }

                                return (
                                    <label key={option} className={`block w-full text-left p-3 rounded-md cursor-pointer transition-colors border ${optionClass}`}>
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={option}
                                            checked={isChecked}
                                            onChange={() => handleAnswerChange(index, option)}
                                            disabled={isSubmitted}
                                            className="mr-3 accent-indigo-500"
                                        />
                                        {option}
                                    </label>
                                );
                            })}
                        </div>
                        {isSubmitted && (
                            <div className="mt-4 p-3 bg-slate-900/70 rounded-md text-sm border border-slate-700">
                                <p><strong className="text-sky-400">Explicação:</strong> {q.explanation}</p>
                            </div>
                        )}
                    </div>
                ))}
                {!isSubmitted ? (
                    <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 rounded-md hover:from-indigo-700 hover:to-blue-600 transition-all">
                        Enviar Respostas
                    </button>
                ) : (
                    <div className="text-center p-6 bg-slate-900/50 border border-slate-700/50 rounded-lg">
                        <h3 className="text-2xl font-bold text-white">Quiz Concluído!</h3>
                        <p className="text-lg text-sky-400 mt-2">Você acertou {score} de {quizData.questions.length}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 shadow-lg w-full flex items-center gap-4 backdrop-blur-sm">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Digite o tópico do quiz..."
                    className="flex-grow bg-slate-800/60 border-2 border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-200"
                    disabled={isLoading}
                />
                <button onClick={handleGenerateQuiz} disabled={isLoading || !topic.trim()} className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 px-6 rounded-md hover:from-indigo-700 hover:to-blue-600 transition-all disabled:from-slate-600 disabled:to-slate-700 disabled:opacity-70">
                    {isLoading ? "Gerando..." : "Gerar Quiz"}
                </button>
            </div>
            <div className="mt-6 flex-grow">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <LoadingSpinner />
                        <p className="mt-4 text-indigo-400 animate-pulse">Criando seu quiz...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">
                        <h3 className="font-bold">Erro</h3>
                        <p>{error}</p>
                    </div>
                ) : quizData ? (
                    renderQuiz()
                ) : (
                    <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full">
                        <BeakerIcon className="w-24 h-24 mb-4 text-slate-700" />
                        <h2 className="text-2xl text-slate-400 mb-2">Gerador de Quiz</h2>
                        <p className="max-w-xl">
                           Digite um tópico para gerar um quiz interativo e testar seus conhecimentos em cibersegurança.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
