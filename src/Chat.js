import React, { useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
	if (!input) return;

	const userMessage = { sender: "user", text: input };
	setMessages([...messages, userMessage]);

	try {
	  const response = await fetch("/api/generate-response", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message: input }),
	  });
	  const { text } = await response.json();
	  const botMessage = { sender: "bot", text };
	  setMessages((prev) => [...prev, botMessage]);
	} catch (error) {
	  console.error("APIリクエストエラー:", error);
	  setMessages((prev) => [...prev, { sender: "bot", text: "エラーが発生しました。" }]);
	}
	setInput("");
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
		  value={input}
		  onChange={(e) => setInput(e.target.value)}
		  placeholder="メッセージを入力"
		/>
		<button onClick={sendMessage}>送信</button>
	  </div>
	</div>
  );
}

export default Chat;