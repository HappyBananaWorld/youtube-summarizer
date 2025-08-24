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
        You are an expert content summarizer. Your task is to provide a **concise, accurate, and complete summary** of the text below in Persian, **strictly in Markdown format**.

        ${transcript}

        Instructions:
        1. Do not add any extra text, explanations, or comments outside the summary.
        2. Ensure the summary is complete; nothing from the original content should be omitted or altered.
        3. The summary must be accurate, well-structured, and free of errors or missing information.
        `;

		console.log(transcript);

		const aiResult = await ai.sendToExternalApi(prompt);

		return {
			success: true,
			result: aiResult
		};
	}
};
