import Ai from '$lib/ai/ai';
import NoteGpt from '$lib/notegpt/index';
import type { Actions, PageServerLoad } from './$types';
import dotenv from 'dotenv';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	getTranscript: async ({ request }) => {
		const formData = await request.formData();
		const youtubeLink = formData.get('link') as string;

		const notegpt = new NoteGpt();

		let transcript = await notegpt.getTranscript(youtubeLink);

		const apiKey: string = process.env.GEMINI_API_KEY!;
		const ai = new Ai(apiKey);

	const prompt = `
You are an expert content summarizer. Your task is to provide a **detailed, accurate, and complete summary** of the text below in Persian, **strictly in Markdown format**. The summary should fully cover all key points, arguments, examples, and steps mentioned in the content. 

${transcript}

Instructions:
1. Include all important details; do not omit or shorten any significant information.
2. Structure the summary in a logical and clear way, using headings, bullet points, or numbered lists if needed.
3. Write the summary in a **clear, readable, and natural style**; it should be easy to understand for any reader, and avoid poetic or overly stylized language.
4. The summary must be accurate, well-organized, and free of errors.
5. Avoid adding any personal opinions, commentary, or irrelevant content.
6. Aim to produce a summary that could serve as a comprehensive reference for someone who hasn’t seen the original content.
`;


		console.log(transcript);

		const aiResult = await ai.sendToExternalApi(prompt);

		return {
			success: true,
			result: aiResult
		};
	}
};
