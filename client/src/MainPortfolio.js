import { useState, useRef, useEffect } from "react";
import "./App.css";

function MainPortfolio() {
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState( window.innerWidth > 768);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const savedChats =
      JSON.parse(localStorage.getItem("janviChats")) || [];

    setChats(savedChats);

    if (savedChats.length > 0) {
      setCurrentChatId(savedChats[0].id);
      setMessages(savedChats[0].messages);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "janviChats",
      JSON.stringify(chats)
    );
  }, [chats]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: []
    };

    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages([]);

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }

    return newChat.id;
  };

  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, []);


  const sendMessage = async (question = input) => {
    if (!question.trim()) return;

    const userMessage = {
      sender: "user",
      text: question
    };

    const updatedMessages = [
      ...messages,
      userMessage
    ];

    setMessages(updatedMessages);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
            ...chat,
            title:
              chat.messages.length === 0
                ? question.substring(0, 30)
                : chat.title,
            messages: updatedMessages
          }
          : chat
      )
    );

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://janvi-ai-assistant-portfolio.onrender.com/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      const data = await res.json();

      const botMessage = {
        sender: "bot",
        text: data.answer
      };

      const finalMessages = [
        ...updatedMessages,
        botMessage
      ];

      setMessages(finalMessages);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
              ...chat,
              messages: finalMessages
            }
            : chat
        )
      );

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Unable to connect to AI service."
        }
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  return (

    <div className="app-layout">
      <div
        className={`sidebar ${sidebarOpen ? "open" : "closed"
          }`}
      >
        <div className="sidebar-header">
          <button
            className="menu-btn"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >
            ☰
          </button>

          {/* {sidebarOpen && <h3>History</h3>} */}
        </div>
        {sidebarOpen && (
          <>
            <button
              className="new-chat-btn"
              onClick={createNewChat}
            >
              + New Chat
            </button>
            <div className="history-list">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="history-item"
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    setMessages(chat.messages);

                    if (window.innerWidth <= 768) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  {chat.title}
                </div>
              ))}
            </div>
            <button
              className="clear-history-btn"
              onClick={() => {
                setChats([]);
                setMessages([]);
                setCurrentChatId(null);

                localStorage.removeItem("janviChats");
              }}
            >
              Clear History
            </button>
          </>
        )}
      </div>

      <div className="chat-container">
        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <div className="hero">
          <h2>Janvi's AI</h2>
          <p>
            Interactive Portfolio Assistant
          </p>
        </div>

        {messages.length === 0 && (
          <div className="suggestion-grid">

            <div
              className="suggestion-card"
              onClick={() =>
                sendMessage("Tell me about your projects")
              }
            >
              <div className="icon">🚀</div>
              <h3>Projects</h3>
              <p>View my development work</p>
            </div>

            <div
              className="suggestion-card"
              onClick={() =>
                sendMessage("Tell me about your skills")
              }
            >
              <div className="icon">💻</div>
              <h3>Skills</h3>
              <p>Technologies I use</p>
            </div>

            <div
              className="suggestion-card"
              onClick={() =>
                sendMessage("Tell me about your experience")
              }
            >
              <div className="icon">📚</div>
              <h3>Experience</h3>
              <p>Internship & learning journey</p>
            </div>

            <div
              className="suggestion-card"
              onClick={() =>
                sendMessage("Why should we hire you?")
              }
            >
              <div className="icon">🎯</div>
              <h3>Hire Me</h3>
              <p>Why I'm a good candidate</p>
            </div>

          </div>
        )}

        <div className="chat-box">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "user"
                  ? "user-msg"
                  : "bot-msg"
              }
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="bot-msg">
              Typing...
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        <div className="input-box">
          <input
            type="text"
            placeholder="Ask anything about Janvi..."
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
          />

          <button onClick={() => sendMessage()}>
            ➜
          </button>
        </div>
      </div>

    </div>
  );
}

export default MainPortfolio;




// import { useState, useRef, useEffect } from "react";
// import "./App.css";

// function MainPortfolio() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const chatEndRef = useRef(null);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);

//     // Send to backend
//     const res = await fetch("http://localhost:5000/ask", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ question: input })
//     });

//     const data = await res.json();

//     const botMessage = { sender: "bot", text: data.answer };
//     setMessages((prev) => [...prev, botMessage]);

//     setInput("");
//   };

//   // Auto scroll
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="chat-container">
//       <h2 className="title">Janvi AI Portfolio</h2>

//       <div className="chat-box">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={msg.sender === "user" ? "user-msg" : "bot-msg"}
//           >
//             {msg.text}
//           </div>
//         ))}
//         <div ref={chatEndRef}></div>
//       </div>

//       <div className="input-box">
//         <input
//           type="text"
//           placeholder="Ask about me..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default MainPortfolio;