"use client";
import { FormEvent, useState, useEffect, useRef } from "react";
import { translations } from "../data/translation";
import "../style/chat.css";
type Language = "en" | "ar";
type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function ChatInterface() {
  const [language, setLanguage] = useState<Language>("en");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: translations.en.welcome,
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: trimmedInput,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://healtrip-ai-assistant.onrender.com/api/chatRoute/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedInput,
          history: messages,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.result.message || JSON.stringify(data.result.results),
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          language === "en"
            ? "Sorry, something went wrong. Please try again."
            : "عذرا، حدث خطأ. يرجى المحاولة مرة أخرى.",
      };

      setMessages((currentMessages) => [...currentMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = () => {
    const nextLanguage = language === "en" ? "ar" : "en";

    setLanguage(nextLanguage);

    setMessages((currentMessages) =>
      currentMessages.map((message) => {
        if (message.id === 1 && message.role === "assistant") {
          return {
            ...message,
            content: translations[nextLanguage].welcome,
          };
        }

        return message;
      }),
    );
  };

  return (
    <main dir={language === "ar" ? "rtl" : "ltr"} className="main-container">
      <div className={`chat-container arabic-font`}>
        {/* -------header container----------- */}
        <header className="header">
          <div className="chat-titles">
            <h1 className="chat-title">{translations[language].title}</h1>
            <span className="chat-subtitle">{translations[language].subtitle}</span>
          </div>
          <button
            type="button"
            onClick={handleLanguageChange}
            className="language-btn"
          >
            {translations[language].language}
          </button>
        </header>
        {/* -------chat container------ */}
        <div className="chat-div">
          <div className="messages-container">
            {messages.map((message) => {
              const isAssistant = message.role === "assistant";
              return (
                <div
                  key={message.id}
                  className={`message-row ${
                    isAssistant ? "assistant" : "user"
                  }`}
                >
                  <div
                    className={`message ${isAssistant ? "assistant" : "user"}`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
            {isLoading && (
              <div className="loading-row">
                <div className="loading-message">
                  {translations[language].thinking}
                </div>
              </div>
            )}
          </div>
         {/* ----input------- */}
          <form onSubmit={handleSubmit} className="chat-form">
            <div className="input-container">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder={translations[language].placeholder}
                rows={2}
                disabled={isLoading}
                className="message-input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="send-btn"
              >
                {isLoading
                  ? translations[language].thinking
                  : translations[language].send}
              </button>
            </div>
          </form>
          {/*---------attention-------- */}
          <span className="attention-span">{translations[language].attention}</span>
        </div>
      </div>
    </main>
  );
}
