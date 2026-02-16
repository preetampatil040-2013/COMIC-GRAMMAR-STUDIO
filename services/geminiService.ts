
import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getGrammarLesson = async (topic: string, subject: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a comic-book style grammar lesson about ${topic} specifically contextualized for the subject of ${subject}. 
    The output must be in JSON format.
    Include:
    - explanation: A fun, brief explanation (max 3 sentences). Ensure perfect spelling.
    - examples: 3 subject-specific examples showing correct usage.
    - tips: 2 helpful grammar/spelling tips.
    - comicDialogue: A short, funny three-way dialogue between "Captain Syntax" (hero), "The Typo" (villain), and "Professor Punctuation" (wise advisor).
    - professorTip: A specific extra tip about punctuation related to this topic from Professor Punctuation.
    - quiz: An array of 3-5 multiple choice questions called "The Hero's Challenge". Each question should have:
        - question: The quiz question.
        - options: Array of 4 possible answers.
        - correctAnswer: The correct answer string.
        - explanation: A short, encouraging explanation for why it is correct.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING },
          examples: { type: Type.ARRAY, items: { type: Type.STRING } },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } },
          comicDialogue: { type: Type.STRING },
          professorTip: { type: Type.STRING },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["question", "options", "correctAnswer", "explanation"],
            }
          }
        },
        required: ["explanation", "examples", "tips", "comicDialogue", "professorTip", "quiz"],
      },
    },
  });

  return JSON.parse(response.text);
};

export const checkSpelling = async (text: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a master spelling bee champion and Professor Punctuation. Analyze the following text: "${text}". 
    Identify any spelling or punctuation errors. 
    Return a JSON object with:
    - correctedText: The full text with corrections.
    - errorsFound: Boolean.
    - explanation: A very brief explanation of what was fixed, mentioning punctuation if relevant (max 1 sentence).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correctedText: { type: Type.STRING },
          errorsFound: { type: Type.BOOLEAN },
          explanation: { type: Type.STRING },
        },
        required: ["correctedText", "errorsFound", "explanation"],
      },
    },
  });
  return JSON.parse(response.text);
};

export const chatWithStudio = async (messages: Message[]) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are Captain Syntax, a friendly grammar superhero. Occasionally, your partner Professor Punctuation (who is obsessed with marks like semicolons and dashes) chimes in with wise advice. You provide perfectly spelled, clear, and helpful grammar advice. Use comic book interjections but never sacrifice clarity or spelling accuracy.',
    },
  });

  const lastMessage = messages[messages.length - 1];
  const response = await chat.sendMessage({ message: lastMessage.text });
  return response.text;
};

export const editHeroImage = async (base64Data: string, mimeType: string, prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: `You are a comic book image artist. Edit this image based on the following instruction: "${prompt}". Return the resulting image.`,
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned from Nano Banana model!");
};
