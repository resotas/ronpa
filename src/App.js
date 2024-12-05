import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    // ユーザーのメッセージを追加
    setMessages([...messages, { id: messages.length + 1, sender: 'user', text: userMessage }]);
    setUserMessage('');

    try {
      // API呼び出し
      const response = await fetch('https://kugyuuu.vercel.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('サーバーエラーが発生しました');
      }

      const data = await response.json();

      // AIのメッセージを追加
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: 'ai', text: data.reply },
      ]);
    } catch (error) {
      console.error('APIエラー:', error.message);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">論破王ひろゆきチャット</div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="メッセージを入力..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button onClick={sendMessage}>送信</button>
      </div>
    </div>
  );
}

export default App;