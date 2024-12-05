import { Configuration, OpenAIApi } from "openai";

// OpenAI の設定を初期化
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数から API キーを取得
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  try {
	// POST メソッドのみを許可
	if (req.method !== "POST") {
	  return res.status(405).json({ error: "Method not allowed" });
	}

	const { message } = req.body;

	if (!message) {
	  return res.status(400).json({ error: "Message is required" });
	}

	// OpenAI API にリクエストを送信
	const completion = await openai.createCompletion({
	  model: "text-davinci-003", // 使用するモデル
	  prompt: message,
	  max_tokens: 100,
	});

	const responseText = completion.data.choices[0].text.trim();

	// クライアントにレスポンスを送信
	return res.status(200).json({ text: responseText });
  } catch (error) {
	console.error("Error in API function:", error);
	return res.status(500).json({ error: "Internal Server Error" });
  }
}