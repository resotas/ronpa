const { Configuration, OpenAIApi } = require("openai");

// OpenAI API設定
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  console.log("リクエスト受信"); // デバッグ用ログ

  if (req.method !== "POST") {
	res.status(405).json({ error: "POSTリクエストのみ受け付けます。" });
	return;
  }

  const { message } = req.body;

  if (!message) {
	res.status(400).json({ error: "メッセージが空です。" });
	return;
  }

  try {
	console.log("OpenAI APIリクエスト送信:", message);
	const completion = await openai.chat.completions.create({
	  model: "gpt-3.5-turbo",
	  messages: [
		{ role: "system", content: "あなたは論破の達人です。" },
		{ role: "user", content: message },
	  ],
	  max_tokens: 150,
	});

	console.log("OpenAI APIレスポンス:", completion.data);
	res.status(200).json({ text: completion.data.choices[0].message.content });
  } catch (error) {
	console.error("OpenAI APIエラー:", error.message);
	res.status(500).json({ error: error.message });
  }
};