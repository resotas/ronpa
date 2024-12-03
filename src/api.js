const { Configuration, OpenAIApi } = require("openai");

// 環境変数からAPIキーを取得
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateResponse(req, res) {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "メッセージが空です。" });
  }

  try {
    // OpenAI APIを使用して応答を生成
    const completion = await openai.createCompletion({
      model: "text-davinci-003", // モデルの指定
      prompt: `ユーザー: ${message}\nひろゆき:`,
      max_tokens: 150,
      temperature: 0.7, // 応答のランダム性
    });

    // 応答をクライアントに返す
    res.status(200).json({ text: completion.data.choices[0].text.trim() });
  } catch (error) {
    console.error("OpenAI APIエラー:", error.message);
    res.status(500).json({ error: "APIエラーが発生しました。" });
  }
}

module.exports = generateResponse;