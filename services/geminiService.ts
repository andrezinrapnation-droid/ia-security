
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getGeminiResponse = async (
    model: string,
    prompt: string,
    systemInstruction: string,
    isJson: boolean = false,
) => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                ...(isJson && { responseMimeType: "application/json" }),
            },
        });

        if (response.text) {
            return response.text;
        } else {
            throw new Error("No content received from the AI. The response may have been blocked.");
        }
    } catch (error) {
        console.error("Error fetching explanation from Gemini:", error);
        throw new Error("Failed to get explanation from AI service. Check the console for more details.");
    }
}

export const getCyberExplanation = async (query: string): Promise<string> => {
    const systemInstruction = `Você é o Mentor de Cibersegurança AI, um especialista em cibersegurança. Seu papel é explicar conceitos complexos de cibersegurança para estudantes. Suas explicações devem ser claras, estruturadas e fáceis de entender. Sempre formate sua resposta em Markdown. Não use citações em bloco do markdown (>).`;
    const prompt = `
Por favor, forneça uma explicação detalhada sobre o seguinte tópico de cibersegurança: "${query}"

Estruture sua resposta com as seguintes seções, usando títulos Markdown:

### 🛡️ O que é?
(Forneça uma definição clara e concisa.)
### ⚙️ Como funciona
(Dê uma explicação passo a passo. Use listas.)
### 🌍 Exemplo do Mundo Real
(Descreva um caso conhecido.)
### 👨‍💻 Exemplo de Código (se aplicável)
(Forneça um trecho de código simples e ilustrativo mostrando a vulnerabilidade. Se não for aplicável, declare isso.)
### 🚧 Prevenção e Mitigação
(Liste estratégias práticas.)
### ✅ Pontos Principais
(Resuma os pontos mais importantes.)
    `;
    return getGeminiResponse('gemini-3-pro-preview', prompt, systemInstruction);
};

export const getVulnerabilityAnalysis = async (systemDescription: string): Promise<string> => {
    const systemInstruction = `Você é um analista de segurança e pentester sênior. Analise a descrição do sistema fornecida e identifique potenciais vulnerabilidades. Para cada vulnerabilidade, forneça uma avaliação de risco (Baixo, Médio, Alto, Crítico), uma explicação detalhada do risco e etapas de mitigação práticas. Formate toda a resposta em Markdown.`;
    const prompt = `Analise o seguinte sistema em busca de vulnerabilidades de segurança:\n\n---\n\n${systemDescription}\n\n---\n\nForneça sua análise estruturada com títulos para cada vulnerabilidade encontrada.`;
    return getGeminiResponse('gemini-3-pro-preview', prompt, systemInstruction);
};

export const getAttackSimulation = async (attackType: string): Promise<string> => {
    const systemInstruction = `Você é um educador de cibersegurança simulando ciberataques para fins de aprendizado. Descreva o ataque selecionado em detalhes. A explicação deve ser clara, prática e voltada para estudantes. Formate a resposta em Markdown.`;
    const prompt = `
Simule e explique um ataque de "${attackType}".

Estruture sua resposta com as seguintes seções usando títulos Markdown:

### 🎯 Visão Geral do Ataque
(O que é este ataque e qual o seu objetivo?)
### 🚶‍♂️ Execução Passo a Passo
(Detalhe as fases do ataque da perspectiva do atacante.)
### 🔬 Vulnerabilidades Exploradas
(Quais fraquezas este ataque explora?)
### 🛡️ Contramedidas e Defesa
(Como este ataque poderia ter sido prevenido ou mitigado?)
### 💡 Cenário do Mundo Real
(Forneça uma história breve e ilustrativa de como este ataque pode ocorrer.)
    `;
    return getGeminiResponse('gemini-3-pro-preview', prompt, systemInstruction);
};

export interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
}

export interface Quiz {
    questions: QuizQuestion[];
}

export const getQuiz = async (topic: string): Promise<Quiz> => {
    const systemInstruction = `Você é um gerador de quizzes de IA especializado em cibersegurança. Crie um quiz de múltipla escolha sobre o tópico fornecido. O quiz deve ter exatamente 5 questões. Para cada questão, forneça 4 opções, onde apenas uma é correta. Além disso, forneça uma breve explicação para a resposta correta. Você deve responder APENAS com um objeto JSON válido.`;
    const prompt = `Gere um quiz de múltipla escolha com 5 questões sobre "${topic}".`;
    const responseText = await getGeminiResponse('gemini-3-pro-preview', prompt, systemInstruction, true);
    try {
        // The Gemini API might wrap the JSON in ```json ... ```, so we clean it.
        const cleanedJson = responseText.replace(/^```json\s*|```\s*$/g, '');
        return JSON.parse(cleanedJson) as Quiz;
    } catch (e) {
        console.error("Failed to parse quiz JSON:", e);
        throw new Error("The AI returned an invalid quiz format.");
    }
};
