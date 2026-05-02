import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import { getGaiaAnswer } from "../utils/gaiaResponses.js";

const suggestionItems = [
  "Weather impact today",
  "Water purity and TDS",
  "AQI and air advice",
];

const getStarterMessage = (city) => ({
  role: "gaia",
  text: `Hi, I am Gaia. Ask me about weather impact, water purity, AQI or eco-friendly routines for ${city}, Jaipur.`,
});

const visibleHistory = (messages) =>
  messages
    .filter((msg) => msg.role === "you" || msg.role === "gaia")
    .map((msg) => ({
      role: msg.role,
      text: msg.text,
    }))
    .slice(-10);

export default function AssistantScreen({ location, notify }) {
  const [messages, setMessages] = useState([getStarterMessage(location.city)]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const pageRef = useRef(null);

  useEffect(() => {
    setMessages([getStarterMessage(location.city)]);
  }, [location.city, location.id]);

  /* Scroll whole page instead of separate chat box */
  useEffect(() => {
    pageRef.current?.scrollTo({
      top: pageRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  const sendGaiaMessage = async (message, locationData, history) => {
    const response = await fetch("http://localhost:2000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        location: locationData,
        history,
      }),
    });

    if (!response.ok) throw new Error("Failed request");

    const data = await response.json();
    return data.reply;
  };

  const sendMessage = async (customText) => {
    const text = (customText ?? input).trim();

    if (!text || thinking) return;

    const userMsg = { role: "you", text };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    try {
      const answer = await sendGaiaMessage(
        text,
        location,
        visibleHistory([...messages, userMsg])
      );

      setMessages((prev) => [...prev, { role: "gaia", text: answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "gaia",
          text: `${getGaiaAnswer(text, location)}

(Offline fallback mode active)`,
        },
      ]);

      notify("Backend unavailable. Gaia used local fallback.");
    } finally {
      setThinking(false);
    }
  };

  return (
    <div
      className="assistant-page gaia-classic-page reveal-up full-page-scroll"
      ref={pageRef}
    >
      {/* Hero */}
      <section className="gaia-classic-hero">
        <h1>I am Gaia</h1>
        <p>Your EcoSense AI assistant for {location.city}, Jaipur.</p>
      </section>

      {/* New Chat */}
      <section className="gaia-top-actions">
        <button
          className="gaia-new-chat-pill"
          onClick={() => setMessages([getStarterMessage(location.city)])}
        >
          New Chat
        </button>
      </section>

      {/* Suggestions */}
      <section className="gaia-chat-suggestions">
        {suggestionItems.map((item) => (
          <button
            key={item}
            className="gaia-shortcut-pill"
            onClick={() => sendMessage(item)}
          >
            {item}
          </button>
        ))}
      </section>

      {/* Messages directly blended in page */}
      <section className="gaia-chat-feed">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`gaia-message-row ${message.role}`}
          >
            <div className={`gaia-message-bubble ${message.role}`}>
              {message.text}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="gaia-message-row gaia">
            <div className="gaia-message-bubble gaia gaia-typing-bubble">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </section>

      {/* Input fixed bottom or normal */}
      <form
        className="gaia-classic-input blended-input"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        
      >
        <button
          type="button"
          className="gaia-input-icon muted"
          onClick={() => notify("Voice input placeholder")}
        >
          <Icon name="mic" />
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            thinking
              ? "Gaia is thinking..."
              : "Ask Gaia about weather, AQI, water..."
          }
          disabled={thinking}
        />

        <button
          type="submit"
          className="gaia-input-icon send"
          disabled={thinking || !input.trim()}
        >
          <Icon name="send" filled />
        </button>
      </form>
    </div>
  );
}