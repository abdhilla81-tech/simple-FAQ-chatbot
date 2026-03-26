export const FAQ_DATA = [
  {
    question: "What is this chatbot?",
    answer: "This is a simple FAQ chatbot powered by Google's Gemini AI. It can answer questions based on the information provided in its knowledge base."
  },
  {
    question: "How does it work?",
    answer: "It uses the Gemini 3 Flash model to process your questions and find the most relevant information from our FAQ list."
  },
  {
    question: "Is my data safe?",
    answer: "Yes, this is a demonstration app. Your chat history is kept locally in your browser session."
  },
  {
    question: "Can I ask anything?",
    answer: "You can ask anything, but the chatbot is specifically trained to prioritize information from the FAQ. If it doesn't know the answer, it will try its best using its general knowledge or tell you it doesn't know."
  },
  {
    question: "Who built this?",
    answer: "This app was built as a demonstration of a simple AI-powered FAQ system."
  }
];

export const SYSTEM_INSTRUCTION = `
You are a helpful FAQ assistant. 
Your primary goal is to answer user questions based on the following FAQ data:
${FAQ_DATA.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

If the user's question is not directly answered in the FAQ, use your general knowledge to provide a helpful response, but prioritize the FAQ information. 
Keep your answers concise and friendly.
`;
