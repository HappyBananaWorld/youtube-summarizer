import fs from 'fs';
import { chromium } from 'playwright';

class NoteGpt {
	public getCurrentCookie(): string {
		const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));

		const cookieString = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
		fs.writeFileSync('cookies.txt', cookieString);

		return cookieString;
	}

	public async updateCookie(): Promise<void> {
		const browser = await chromium.launch({
			headless: false
		});

		const context = await browser.newContext();
		const page = await context.newPage();

		await page.goto('https://notegpt.io/youtube-video-summarizer', {
			waitUntil: 'networkidle',
			timeout: 120000
		});

		await page.waitForTimeout(5000);

		const cookies = await context.cookies();
		fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));

		console.log('تمام کوکی‌ها ذخیره شدند!');
		await browser.close();
	}

	public async getTranscript(videoId: string) {
		const response = await fetch(
			`https://notegpt.io/api/v2/video-transcript?platform=youtube&video_id=${videoId}&lang=en`,
			{
				headers: {
					cookie: this.getCurrentCookie()
				}
			}
		);

		const json = await response.json();
		

		// if cookie expired, updated
		if (json?.message === 'login expired') {
			await this.updateCookie();
		}

		// Return only the 'transcripts' field
		const transcriptObj = json?.data?.transcripts?.default_language?.default || json?.data?.transcripts?.en_auto?.default ;
		let transcript = '';

		transcriptObj?.map((item: any) => {
			transcript += item?.text + '\n';
		});

		return transcript;
	}
}

export default NoteGpt;
