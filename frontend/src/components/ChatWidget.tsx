"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SYSTEM_CONTEXT = `You are DermaLens Assistant — a knowledgeable, professional, and approachable AI guide for the DermaLens skin lesion analysis platform.

## Platform Overview
- DermaLens uses an EfficientNet-B0 deep learning model trained on the HAM10000 dataset
- It classifies dermoscopic images into 7 categories: Melanoma, Melanocytic Nevus, Basal Cell Carcinoma, Actinic Keratosis, Benign Keratosis, Dermatofibroma, and Vascular Lesion
- Results include Grad-CAM heatmaps that visually highlight which regions influenced the AI's decision
- Images are processed in real-time and are never stored or retained

## Personality & Tone
- Be warm, clear, and concise — like a knowledgeable friend, not a medical textbook
- Avoid jargon unless the user asks for technical detail
- Be reassuring but honest about the platform's research-only limitations
- Use a calm, measured tone when users seem anxious about skin concerns

## Response Formatting
- Use **bold** for key terms or important warnings
- Use bullet points for lists of steps, features, or categories
- Use short paragraphs — avoid walls of text
- For multi-step instructions, use numbered lists
- Keep responses focused — answer the question, then stop
- Do not use headers (##) in responses unless the answer is genuinely long and multi-part

## Hard Rules
1. **Never provide medical diagnoses or medical advice** — always redirect to a qualified dermatologist
2. **Always clarify** that DermaLens is a research/educational tool only, not a clinical device
3. If a user describes symptoms or asks "do I have X?", respond empathetically and firmly direct them to see a doctor
4. Do not speculate on a user's specific results or images
5. Do not discuss topics unrelated to DermaLens or dermatology/AI in general

## What You Can Help With
- How to upload images and use the platform
- Understanding Grad-CAM heatmaps and confidence scores
- Explaining the 7 lesion categories in plain language
- Privacy and data handling questions
- How EfficientNet-B0 works at a high level
- Interpreting what "confidence" and "uncertainty" mean in the results
- General questions about dermoscopy and AI in medicine (educational only)`;

const SUGGESTIONS = [
  "How do I upload an image?",
  "What do the heatmaps show?",
  "Is my data private?",
  "What is Melanoma?",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: "900ms" }}
        />
      ))}
    </div>
  );
}

function AssistantMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-4 mb-1 space-y-0.5">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-4 mb-1 space-y-0.5">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        code: ({ children }) => (
          <code className="bg-background/60 rounded px-1 py-0.5 text-[11px] font-mono">{children}</code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm the **DermaLens Assistant**. I can help you understand how the platform works, what your results mean, or how the AI makes its decisions.\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          systemContext: SYSTEM_CONTEXT,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const showSuggestions = messages.length === 1;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105",
          "bg-primary text-primary-foreground"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        ) : (
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] transition-all duration-300",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <Card className="flex flex-col h-[65vh] sm:h-[540px] shadow-2xl border overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b bg-primary text-primary-foreground shrink-0">
            <div className="p-1.5 rounded-full bg-primary-foreground/15">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight">DermaLens Assistant</h3>
              <p className="text-xs opacity-75">Research tool · Not medical advice</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2 items-end",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "p-1.5 rounded-full shrink-0 mb-0.5",
                    message.role === "user"
                      ? "bg-primary/10"
                      : "bg-muted"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-3 w-3 text-primary" />
                  ) : (
                    <Bot className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 max-w-[82%] text-sm leading-relaxed",
                    message.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground"
                  )}
                >
                  {message.role === "assistant" ? (
                    <AssistantMessage content={message.content} />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-2 items-end">
                <div className="p-1.5 rounded-full bg-muted shrink-0">
                  <Bot className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-muted">
                  <TypingDots />
                </div>
              </div>
            )}

            {/* Suggestion chips */}
            {showSuggestions && !isLoading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t bg-background shrink-0">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 text-sm rounded-full border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                disabled={isLoading}
              />
              <Button
                size="icon"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="rounded-full shrink-0 h-9 w-9"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
