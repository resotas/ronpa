const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

const configuration = new Configuration({
  apiKey: openaiApiKey, // 環境変数から API キーを取得
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  try {
	if (req.method !== "POST") {
	  return res.status(405).json({ error: "Method not allowed" });
	}

	const { message } = req.body;

	if (!message) {
	  return res.status(400).json({ error: "Message is required" });
	}

	console.log("Received message:", message); // デバッグ用ログ

	const completion = await openai.createChatCompletion({
	  model: "gpt-3.5-turbo",
	  messages: [{ role: "user", content: message }],
	  max_tokens: 100,
	});

	console.log("Completion response:", completion.data); // デバッグ用ログ

	const responseText = completion.data.choices[0].message.content.trim();

	return res.status(200).json({ text: responseText });
  } catch (error) {
	console.error("Error in API function:", error);
	return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}