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
	const completion = await openai.chat.completions.create({
	  model: "gpt-3.5-turbo", // モデルを指定 (gpt-4も使用可能)
	  messages: [
		{ role: "system", content: "あなたは論破の達人です。" }, // システムメッセージ
		{ role: "user", content: message }, // ユーザーからの入力メッセージ
	  ],
	  max_tokens: 150, // 応答の最大トークン数
	  temperature: 0.7, // 応答のランダム性 (0に近いほど確定的)
	});

	// OpenAIの応答を返す
	res.status(200).json({ text: completion.data.choices[0].message.content });
  } catch (error) {
	console.error("OpenAI APIエラー:", error.message);
	res.status(500).json({ error: error.message });
  }
};

module.exports = async (req, res) => {
  console.log("リクエスト受信");
  try {
	const completion = await openai.chat.completions.create({
	  model: "gpt-3.5-turbo",
	  messages: [
		{ role: "system", content: "あなたは論破の達人です。" },
		{ role: "user", content: req.body.message },
	  ],
	});
	console.log("応答生成成功", completion.data);
	res.status(200).json({ text: completion.data.choices[0].message.content });
  } catch (error) {
	console.error("エラー:", error);
	res.status(500).json({ error: error.message });
  }
};