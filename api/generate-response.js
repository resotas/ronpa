const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});

const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
	return res.status(405).send({ message: "Method Not Allowed" });
  }

  const { message } = req.body;

  if (!message) {
	return res.status(400).send({ message: "Message is required" });
  }

  try {
	// OpenAIのAPIを呼び出す
	const response = await openai.createCompletion({
	  model: "text-davinci-003",
	  prompt: message,
	  max_tokens: 150,
	});

	const botMessage = response.data.choices[0].text.trim();
	return res.status(200).json({ text: botMessage });
  } catch (error) {
	console.error("Error during OpenAI API request:", error);
	return res.status(500).send({ message: "Internal Server Error" });
  }
};