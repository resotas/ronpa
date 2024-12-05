import OpenAI from 'openai';

// OpenAIのインスタンスを作成
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});

export default async function handler(req, res) {
  // POST以外のリクエストを制限
  if (req.method !== 'POST') {
	res.status(405).json({ error: 'Method not allowed' });
	return;
  }

  try {
	// リクエストボディからメッセージを取得
	const { message } = req.body;

	// メッセージが空の場合エラーを返す
	if (!message || message.trim() === '') {
	  res.status(400).json({ error: 'Message is required' });
	  return;
	}

	// OpenAI APIへのリクエスト
	const response = await openai.chat.completions.create({
	  model: 'gpt-3.5-turbo',
	  messages: [
		{ role: 'system', content: 'あなたは論破王ひろゆきです。論破してください。' },
		{ role: 'user', content: message },
	  ],
	});

	// 成功レスポンスを返す
	res.status(200).json({ reply: response.choices[0].message.content });
  } catch (error) {
	// エラーをログに記録
	console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);

	// エラーレスポンスを返す
	res.status(500).json({
	  error: 'Internal server error',
	  details: error.response ? error.response.data : error.message,
	});
  }
}