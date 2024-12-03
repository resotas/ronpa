import React, { useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([]); // チャットメッセージを管理
  const [input, setInput] = useState(""); // 入力内容を管理

  const sendMessage = async () => {
	if (!input) return; // 入力が空の場合は何もしない

	// ユーザーのメッセージを追加
	const userMessage = { sender: "user", text: input };
	setMessages((prev) => [...prev, userMessage]);

	try {
	  // サーバーレス関数にリクエストを送信
	  const response = await fetch("/api/generate-response", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message: input }),
	  });

	  if (!response.ok) {
		throw new Error(`APIリクエスト失敗: ${response.status}`);
	  }

	  const { text } = await response.json();

	  // サーバーからのレスポンスメッセージを追加
	  const botMessage = { sender: "bot", text };
	  setMessages((prev) => [...prev, botMessage]);
	} catch (error) {
	  console.error("APIリクエストエラー:", error);
	  // エラーメッセージを表示
	  setMessages((prev) => [
		...prev,
		{ sender: "bot", text: "エラーが発生しました。サーバーを確認してください。" },
	  ]);
	}

	setInput(""); // 入力フィールドをクリア
  };

  return (
	<div className="chat-container">
	  {/* チャットのメッセージウィンドウ */}
	  <div className="chat-window">
		{messages.map((msg, index) => (
		  <div key={index} className={msg.sender}>
			<div className="message">{msg.text}</div>
		  </div>
		))}
	  </div>

	  {/* チャット入力エリア */}
	  <div className="chat-input">
		<input
		  type="text"
		  value={input}
		  onChange={(e) => setInput(e.target.value)}
		  placeholder="メッセージを入力してください..."
		/>
		<button onClick={sendMessage}>送信</button>
	  </div>
	</div>
  );
}

export default Chat;