
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const getAIResponse = async (userMessage: string, weddingContext: any) => {
  if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is missing. Please set it in your environment variables.");
    return "Minha conexão espiritual está fraca... (Erro: Chave de API da IA não configurada)";
  }

  try {
    const ai = new GoogleGenerativeAI(API_KEY);

    // For @google/genai, the syntax is slightly different or we should use @google/generative-ai
    // Note: The package.json has "@google/genai", which is the newer Google Gen AI SDK.
    // However, the common pattern for web usually uses "@google/generative-ai".
    // Let's try to align with the standard usage for the installed package if possible,
    // or switch to the more common @google/generative-ai if this one is problematic.

    // Assuming @google/genai is the intended one, let's correct the call.
    // But actually, for Client-side React, @google/generative-ai is much more common.
    // If the user installed @google/genai (Node.js/Server-side focused), it might have issues in browser or different API.

    // Let's try to use the GenerativeModel approach which is standard for Gemini.
    // Use the getGenerativeModel method.

    const model = ai.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: `Você é a "Madrinha", a assistente pessoal e amiga da noiva na plataforma Noivaflix. 
        Seu lema é "RESPIRA". Seu objetivo é acalmar e ajudar, mas SEMPRE sendo **DIRETA e CONCISA**.

        **REGRAS DE OURO (Siga Estritamente):**
        1. **SEM TEXTÃO:** Nunca escreva parágrafos com mais de 3 linhas.
        2. **SEJA BREVE:** Dê a resposta mais curta possível que resolva o problema.
        3. **USE TÓPICOS:** Se tiver que explicar mais de uma coisa, use lista com bolinhas (•).
        4. **ESTRUTURA:**
           - Comece com uma frase acolhedora curta.
           - Dê a solução/dica direto ao ponto (em tópicos se necessário).
           - Termine com uma pergunta ou incentivo curto.
        5. **Use Markdown:** Negrito para destaque, mas sem exageros.

        **Personalidade:**
        - Carinhosa, mas prática.
        - Use "Respira." se ela estiver ansiosa.
        - Emojis: Use poucos (1 ou 2 por mensagem).

        Contexto: Noiva: ${weddingContext.name}, Data: ${weddingContext.date}.`
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Erro na IA:", error);
    return "Desculpe, tive um pequeno problema técnico. Mas respira, estou aqui com você! O que mais te preocupa hoje?";
  }
};
