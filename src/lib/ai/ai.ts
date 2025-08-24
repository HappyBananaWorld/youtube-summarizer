class Ai {
	private apiKey: string;
	private apiUrl: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
		this.apiUrl =
			'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
	}

	async generateContent(prompt: string): Promise<string> {
		const response = await fetch(this.apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-goog-api-key': this.apiKey
			},
			body: JSON.stringify({
				contents: [
					{
						parts: [{ text: prompt }]
					}
				]
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`API request failed: ${response.status} - ${errorText}`);
		}

		const data = await response.json();

		// فرض می‌کنیم متن اصلی اولین item در outputs و parts است
		return data?.outputs?.[0]?.content?.[0]?.text || '';
	}

	async sendToExternalApi(prompt: string): Promise<string> {
		try {
			const URL = 'https://sweet-forest-b223.sajadmirave.workers.dev/';

			const response = await fetch(URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-gemini-api-key': this.apiKey
				},
				// The key must be "prompt" to match the worker's expectation.
				body: JSON.stringify({
					prompt: prompt
				})
			});

			if (!response.ok) {
				const errorText = await response.text();
				return `Error from worker: ${errorText}`;
			}

			// The worker returns plain text, so use response.text()
			const rawText = await response.text();

			return rawText;
		} catch (err) {
			// Use an appropriate type guard for the error object
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			return `Client-side error: ${errorMessage}`;
		}
	}

	// متد کمکی برای پاکسازی متن
	private cleanText(text: string): string {
		return text.replace(/\s+/g, ' ').trim();
	}
}

export default Ai;
