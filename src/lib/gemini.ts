import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

interface CaptionResult {
  success: boolean;
  caption?: string;
  error?: string;
}

export async function generateCaption(
  imageBase64: string,
  customPrompt?: string
): Promise<CaptionResult> {
  try {
    // Remove the data URL prefix to get just the base64 data
    const base64Data = imageBase64.split(",")[1];

    // Create model instance with the new model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are an Instagram caption generator called InstaCaption. You only analyse the files and the text given to you and based on the feeling in the image and text, you create a caption, just one, no additional comments or descriptions. Generate the caption in the given user prompt language",
      generationConfig: {
        temperature: 0.5,
      }
    });

    // Prepare the image data
    const imageData = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    };

    // Prepare the prompt
    const prompt = customPrompt ? `user prompt: ${customPrompt}.` + ` Structure you should follow: Create an engaging Instagram caption that:
- Is concise (max 50 words)
- Has a casual, conversational tone
- Starts with an attention-grabbing hook or emoji
- Includes a relatable message or story
- Encourages engagement (but don't explicitly ask for likes/comments)
- Ends with 3-5 relevant hashtags
- Avoids clichés and generic descriptions
- Matches the mood and emotion of the image
- Do not include your thoughts or comments in the caption
Make it sound natural, as if a real person wrote it for their Instagram post.` : `Create an engaging Instagram caption that:
- Is concise (max 50 words)
- Has a casual, conversational tone
- Starts with an attention-grabbing hook or emoji
- Includes a relatable message or story
- Encourages engagement (but don't explicitly ask for likes/comments)
- Ends with 3-5 relevant hashtags
- Avoids clichés and generic descriptions
- Matches the mood and emotion of the image
- Do not include your thoughts or comments in the caption
Make it sound natural, as if a real person wrote it for their Instagram post.`;

    // Generate content
    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      caption: text,
    };
  } catch (error) {
    console.error("Error generating caption:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate caption",
    };
  }
}
