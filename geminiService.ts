
import { GoogleGenAI } from "@google/genai";

// Fixed initialization to use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const getAIResponse = async (userMessage: string, weddingContext: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
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

        Contexto: Noiva: ${weddingContext.name}, Data: ${weddingContext.date}.`,
        temperature: 0.7,
      },
    });

    // Accessing .text property directly as it is a getter, not a method
    return response.text;
  } catch (error) {
    console.error("Erro na IA:", error);
    return "Desculpe, tive um pequeno problema técnico. Mas respira, estou aqui com você! O que mais te preocupa hoje?";
  }
};
