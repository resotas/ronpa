import React, { useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([]); // チャットのメッセージ履歴を管理
  const [input, setInput] = useState(""); // 入力内容を管理

  const sendMessage = async () => {
	if (!input) return; // 入力が空の場合は何もしない

	const userMessage = { sender: "user", text: input };
	setMessages((prev) => [...prev, userMessage]); // ユーザーのメッセージを追加

	try {
	  const response = await fetch("/api/generate-response", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message: input }),
	  });

	  if (!response.ok) {
		throw new Error(`APIリクエストエラー: ${response.status}`);
	  }

	  const { text } = await response.json(); // サーバーからのレスポンス
	  const botMessage = { sender: "bot", text };
	  setMessages((prev) => [...prev, botMessage]);
	} catch (error) {
	  console.error("APIリクエストエラー:", error);
	  setMessages((prev) => [
		...prev,
		{ sender: "bot", text: "サーバーエラーが発生しました。" },
	  ]);
	}

	setInput(""); // 入力フィールドをクリア
  };

  return (
	<div className="chat-container">
	  <div className="chat-window">
		{messages.map((msg, index) => (
		  <div key={index} className={msg.sender}>
			<div className="message">{msg.text}</div>
		  </div>
		))}
	  </div>
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