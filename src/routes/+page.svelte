<script lang="ts">
	import { enhance } from '$app/forms';
	import MarkdownIt from 'markdown-it';
	export let form;

	const md = new MarkdownIt();

	// بررسی فارسی یا انگلیسی برای متن ترکیبی
	function fontClass(text: string) {
		const persianRegex = /[\u0600-\u06FF]/;
		return persianRegex.test(text) ? 'persian' : 'english';
	}

	// تبدیل Markdown به HTML
	function renderMarkdown(text: string) {
		return md.render(text);
	}
</script>

<form method="post" use:enhance action="?/getTranscript">
	<input type="text" name="link" placeholder="YouTube link" class="english" />
	<button type="submit" class="persian">ارسال</button>
</form>

{#if form?.result}
	<div class="markdown-container {fontClass(form.result)}">
		{@html renderMarkdown(form.result)}
	</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;700&display=swap');
	@import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css');

	.english {
		font-family: 'Fredoka', sans-serif;
	}
	.persian {
		font-family: 'Vazir', sans-serif;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 500px;
		margin: 2rem auto;
	}

	input,
	button {
		padding: 0.7rem 1rem;
		border-radius: 8px;
		border: 1px solid #ccc;
		font-size: 1rem;
	}

	button {
		cursor: pointer;
		background-color: #4f46e5;
		color: white;
		border: none;
		transition: background 0.3s;
		font-weight: 600;
	}

	button:hover {
		background-color: #4338ca;
	}

	.markdown-container {
		direction: rtl;
		max-width: 700px;
		margin: 2rem auto;
		padding: 1.5rem;
		background: #f9fafb;
		border-radius: 12px;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
		line-height: 1.7;
	}

	/* استایل برای تگ‌های Markdown */
	.markdown-container h1,
	.markdown-container h2,
	.markdown-container h3 {
		margin-top: 1.5rem;
		margin-bottom: 1rem;
		font-weight: 700;
		color: #4f46e5;
	}

	.markdown-container p {
		margin-bottom: 1rem;
	}

	.markdown-container ul {
		padding-left: 1.5rem;
		list-style-type: disc;
		margin-bottom: 1rem;
	}

	.markdown-container code {
		background: #f3f4f6;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-family: 'Fredoka', monospace;
	}
</style>
