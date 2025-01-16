import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error('Missing Hugging Face API Key');
}

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1].content;
    
    const prompt = `You are a helpful medical AI assistant. Provide detailed and clear health information for this question, while emphasizing the importance of consulting healthcare professionals: ${lastMessage}

Remember to:
1. Give detailed explanations
2. Use simple language
3. Include relevant recommendations
4. Mention when professional medical help is needed`;

    const response = await hf.textGeneration({
      model: "google/flan-t5-xl",
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
      }
    });

    if (!response.generated_text) {
      throw new Error('No response from model');
    }

    return NextResponse.json({ response: response.generated_text.trim() });

  } catch (error) {
    console.error('Error in health advisor API:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again.' },
      { status: 500 }
    );
  }
}
