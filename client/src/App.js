import "./normal.css";
import "./App.css";
import { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import ChatBox from "./ChatBox";

function App() {
  const [chatInput, setChatInput] = useState("");
  const [temperature, setTemperature] = useState(0.5);
  const [currentModel, setCurrentModel] = useState("text-davinci-003");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "How can I help you today?",
    },
  ]);

  // clear chats
  function clearChat() {
    setChatLog([]);
  }

async function handleSubmit(e) {
  e.preventDefault();
  let chatLogNew = [...chatLog, { user: "me", message: `${chatInput}` }];
  setChatInput("");
  setChatLog(chatLogNew);
  
  // Add "typing" indicator
  setChatLog([...chatLogNew, { user: "gpt", message: "..." }]);
  
  
  // fetch response to the api combining the chat log array of messages and seinding it as a message to localhost:3000 as a post
  const messages = chatLogNew.map((message) => message.message).join("\n");
  const response = await fetch("https://ebgpt.vercel.app/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: messages,
      currentModel,
    }),
  });

  // Typing effect
  const data = await response.json();
  const aiResponse = data.message;
  const typingInterval = 50; // milliseconds
  let i = 0;
  const typingIntervalId = setInterval(() => {
    const typedResponse = aiResponse.slice(0, i + 1);
    setChatLog([...chatLogNew, { user: "gpt", message: typedResponse }]);
    i++;
    if (i === aiResponse.length) {
      clearInterval(typingIntervalId);
      var scrollToTheBottomChatLog = document.getElementsByClassName("chat-log")[0];
      scrollToTheBottomChatLog.scrollTop = scrollToTheBottomChatLog.scrollHeight;
    }
  }, typingInterval);
}

  function handleTemp(temp) {
    if (temp > 1) {
      setTemperature(1);
    } else if (temp < 0) {
      setTemperature(0);
    } else {
      setTemperature(temp);
    }
  }

  return (
    <div className="App">
      <SideMenu
        setTemperature={handleTemp}
        temperature={temperature}
        clearChat={clearChat}
      />
      <ChatBox
        chatInput={chatInput}
        chatLog={chatLog}
        setChatInput={setChatInput}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
