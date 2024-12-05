const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
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
	const completion = await openai.createChatCompletion({
	  model: "gpt-3.5-turbo",
	  messages: [{ role: "user", content: message }],
	  max_tokens: 100,
	});

	const reply = completion.data.choices[0].message.content.trim();

	res.status(200).json({ text: reply });
  } catch (error) {
	console.error("エラー:", error.message);
	res.status(500).json({ error: "サーバーエラーが発生しました。" });
  }
};