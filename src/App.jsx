import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Edit3,
  Paperclip,
  Send,
  Check,
  CheckCheck,
  Mic,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Camera,
  ChevronRight,
} from "lucide-react";

const AVATAR_COLORS = [
  "#FF6B6B",
  "#4FC3F7",
  "#9575CD",
  "#4DB6AC",
  "#FFB74D",
  "#F06292",
  "#7986CB",
  "#81C784",
];

function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const now = () => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const AUTO_REPLIES = [
  "Haha yeah, exactly!",
  "No way, really?",
  "I'll check and let you know 👍",
  "Sounds good to me.",
  "Give me a sec, I'm driving.",
  "lol true",
  "Can we talk about this later tonight?",
  "Sending you the file in a bit.",
  "😂😂😂",
  "Where are you right now?",
];

const INITIAL_CHATS = [
  {
    id: 1,
    name: "Mira Kaplan",
    online: true,
    unread: 2,
    pinned: true,
    time: "09:41",
    messages: [
      { id: 1, from: "them", text: "Hey! Are we still on for tomorrow?", time: "09:12", status: "read" },
      { id: 2, from: "me", text: "Yes! 10am works for me", time: "09:15", status: "read" },
      { id: 3, from: "them", text: "Perfect, see you then 🙌", time: "09:16", status: "read" },
      { id: 4, from: "them", text: "Also bring the charger if you can", time: "09:41", status: "delivered" },
    ],
  },
  {
    id: 2,
    name: "Design Team",
    isGroup: true,
    online: false,
    unread: 5,
    time: "08:57",
    messages: [
      { id: 1, from: "them", author: "Owen", text: "Pushed the new mockups to Figma", time: "08:20", status: "read" },
      { id: 2, from: "them", author: "Priya", text: "Looks great, love the new palette", time: "08:32", status: "read" },
      { id: 3, from: "me", text: "Nice work everyone!", time: "08:40", status: "read" },
      { id: 4, from: "them", author: "Owen", text: "Let's review at standup", time: "08:57", status: "delivered" },
    ],
  },
  {
    id: 3,
    name: "Daniel Cho",
    online: true,
    unread: 0,
    time: "Yesterday",
    messages: [
      { id: 1, from: "me", text: "Did you watch the game last night?", time: "22:03", status: "read" },
      { id: 2, from: "them", text: "Unreal finish, couldn't believe it", time: "22:10", status: "read" },
    ],
  },
  {
    id: 4,
    name: "Mom",
    online: false,
    unread: 0,
    time: "Yesterday",
    messages: [
      { id: 1, from: "them", text: "Call me when you're free ❤️", time: "19:45", status: "read" },
      { id: 2, from: "me", text: "Will do, in a meeting right now", time: "19:50", status: "read" },
    ],
  },
  {
    id: 5,
    name: "Sofia Reyes",
    online: false,
    unread: 0,
    time: "Tuesday",
    messages: [
      { id: 1, from: "them", text: "Thanks for the recommendation!", time: "14:02", status: "read" },
      { id: 2, from: "me", text: "Anytime, let me know how it goes", time: "14:05", status: "read" },
    ],
  },
  {
    id: 6,
    name: "Telegram Tips",
    isChannel: true,
    online: false,
    unread: 1,
    time: "Monday",
    messages: [
      { id: 1, from: "them", text: "Did you know you can schedule messages? Long-press the send button.", time: "11:00", status: "read" },
    ],
  },
];

function Avatar({ name, size = 48, online }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: colorFor(name),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 600,
          fontSize: size * 0.38,
          letterSpacing: 0.2,
        }}
      >
        {initials(name)}
      </div>
      {online && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: "50%",
            background: "#4CD964",
            border: "2px solid white",
          }}
        />
      )}
    </div>
  );
}

function StatusTicks({ status }) {
  if (status === "read") return <CheckCheck size={15} color="#4FAE4E" style={{ marginLeft: 2 }} />;
  if (status === "delivered") return <CheckCheck size={15} color="#9AA5B1" style={{ marginLeft: 2 }} />;
  return <Check size={15} color="#9AA5B1" style={{ marginLeft: 2 }} />;
}

function ChatListScreen({ chats, onOpenChat, search, setSearch }) {
  const filtered = chats.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FFFFFF" }}>
      <div
        style={{
          padding: "14px 16px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#000" }}>Chats</h1>
        <div style={{ display: "flex", gap: 18, color: "#229ED9" }}>
          <Edit3 size={22} strokeWidth={2} />
        </div>
      </div>

      <div style={{ padding: "0 12px 10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#F0F1F3",
            borderRadius: 10,
            padding: "8px 10px",
            gap: 8,
          }}
        >
          <Search size={17} color="#8E8E93" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 16,
              width: "100%",
              color: "#000",
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {sorted.map((chat) => {
          const last = chat.messages[chat.messages.length - 1];
          const preview = last
            ? `${last.author ? last.author + ": " : ""}${last.from === "me" ? "You: " : ""}${last.text}`
            : "";
          return (
            <div
              key={chat.id}
              onClick={() => onOpenChat(chat.id)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "9px 16px",
                gap: 12,
                cursor: "pointer",
                borderBottom: "1px solid #F0F0F0",
              }}
            >
              <Avatar name={chat.name} online={chat.online} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 16.5,
                      color: "#000",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chat.name}
                  </span>
                  <span style={{ fontSize: 13, color: chat.unread ? "#229ED9" : "#8E8E93", flexShrink: 0, marginLeft: 6 }}>
                    {chat.time}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                  <span
                    style={{
                      fontSize: 14.5,
                      color: "#8E8E93",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 220,
                    }}
                  >
                    {preview}
                  </span>
                  {chat.unread > 0 && (
                    <span
                      style={{
                        background: "#229ED9",
                        color: "white",
                        fontSize: 12.5,
                        fontWeight: 600,
                        borderRadius: 10,
                        minWidth: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 6px",
                        flexShrink: 0,
                        marginLeft: 6,
                      }}
                    >
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div style={{ textAlign: "center", color: "#8E8E93", marginTop: 40, fontSize: 15 }}>No chats found</div>
        )}
      </div>
    </div>
  );
}

function ChatScreen({ chat, onBack, onSend, typing }) {
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat.messages.length, typing]);

  const submit = () => {
    if (!text.trim()) return;
    onSend(chat.id, text.trim());
    setText("");
  };

  const subtitle = chat.isGroup
    ? "4 members"
    : chat.isChannel
    ? "channel"
    : chat.online
    ? "online"
    : "last seen recently";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#DCE8F1" }}>
      <div
        style={{
          background: "#FFFFFF",
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "1px solid #E5E5E5",
        }}
      >
        <ArrowLeft size={22} color="#229ED9" style={{ cursor: "pointer" }} onClick={onBack} />
        <Avatar name={chat.name} size={36} online={chat.online} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 16, color: "#000", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {chat.name}
          </div>
          <div style={{ fontSize: 12.5, color: typing ? "#229ED9" : "#8E8E93" }}>{typing ? "typing..." : subtitle}</div>
        </div>
        <div style={{ display: "flex", gap: 16, color: "#229ED9" }}>
          <Phone size={20} />
          <MoreVertical size={20} />
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "10px 10px 6px" }}>
        {chat.messages.map((m, i) => {
          const mine = m.from === "me";
          const prevSame = i > 0 && chat.messages[i - 1].from === m.from && chat.messages[i - 1].author === m.author;
          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent: mine ? "flex-end" : "flex-start",
                marginTop: prevSame ? 2 : 8,
              }}
            >
              <div
                style={{
                  maxWidth: "76%",
                  padding: "6px 9px 7px 10px",
                  borderRadius: 14,
                  borderBottomRightRadius: mine ? 4 : 14,
                  borderBottomLeftRadius: mine ? 14 : 4,
                  background: mine ? "linear-gradient(180deg,#6DC8F8,#3F97E3)" : "#FFFFFF",
                  color: mine ? "#FFFFFF" : "#000000",
                  boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
                  position: "relative",
                }}
              >
                {!mine && m.author && (
                  <div style={{ fontSize: 13, fontWeight: 700, color: colorFor(m.author), marginBottom: 1 }}>
                    {m.author}
                  </div>
                )}
                <span style={{ fontSize: 15.5, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.text}</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    float: "right",
                    marginLeft: 8,
                    marginTop: 4,
                    fontSize: 11.5,
                    color: mine ? "rgba(255,255,255,0.85)" : "#8E8E93",
                  }}
                >
                  {m.time}
                  {mine && <StatusTicks status={m.status} />}
                </span>
              </div>
            </div>
          );
        })}
        {typing && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 8 }}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 14,
                borderBottomLeftRadius: 4,
                padding: "10px 14px",
                boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
                display: "flex",
                gap: 4,
              }}
            >
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#B3BAC1",
                    animation: "tgBlink 1.2s infinite",
                    animationDelay: `${d * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          background: "#FFFFFF",
          padding: "8px 10px",
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          borderTop: "1px solid #E5E5E5",
        }}
      >
        <Paperclip size={22} color="#8E8E93" style={{ marginBottom: 6, cursor: "pointer" }} />
        <div
          style={{
            flex: 1,
            background: "#F0F1F3",
            borderRadius: 18,
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Message"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 16 }}
          />
          <Smile size={20} color="#8E8E93" style={{ cursor: "pointer" }} />
        </div>
        {text.trim() ? (
          <div
            onClick={submit}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#229ED9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Send size={16} color="white" style={{ marginLeft: -1 }} />
          </div>
        ) : (
          <Mic size={22} color="#8E8E93" style={{ marginBottom: 6, cursor: "pointer" }} />
        )}
      </div>
    </div>
  );
}

export default function TelegramClone() {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [typingFor, setTypingFor] = useState(null);
  const timeoutRef = useRef(null);

  const openChat = (id) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    setActiveId(id);
  };

  const sendMessage = (chatId, text) => {
    const msgId = Date.now();
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              time: now(),
              messages: [...c.messages, { id: msgId, from: "me", text, time: now(), status: "sent" }],
            }
          : c
      )
    );

    setTimeout(() => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, messages: c.messages.map((m) => (m.id === msgId ? { ...m, status: "delivered" } : m)) }
            : c
        )
      );
    }, 500);

    clearTimeout(timeoutRef.current);
    setTypingFor(chatId);
    timeoutRef.current = setTimeout(() => {
      setTypingFor(null);
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== chatId) return c;
          const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
          return {
            ...c,
            time: now(),
            messages: [
              ...c.messages.map((m) => (m.id === msgId ? { ...m, status: "read" } : m)),
              { id: Date.now() + 1, from: "them", text: reply, time: now(), status: "read" },
            ],
          };
        })
      );
    }, 1600 + Math.random() * 1200);
  };

  const activeChat = chats.find((c) => c.id === activeId);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#0F0F0F",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <style>{`
        @keyframes tgBlink { 0%, 80%, 100% { opacity: 0.25; } 40% { opacity: 1; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0px; }
      `}</style>

      <div
        style={{
          width: 390,
          height: 780,
          background: "#000",
          borderRadius: 46,
          padding: 12,
          boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#fff",
            borderRadius: 34,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              height: 44,
              flexShrink: 0,
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              fontSize: 14,
              fontWeight: 600,
              color: "#000",
            }}
          >
            <span>9:41</span>
            <span style={{ position: "absolute", left: "50%", top: 8, transform: "translateX(-50%)", width: 90, height: 24, background: "#000", borderRadius: 16 }} />
            <span>100%</span>
          </div>

          <div style={{ flex: 1, minHeight: 0 }}>
            {activeChat ? (
              <ChatScreen
                chat={activeChat}
                onBack={() => setActiveId(null)}
                onSend={sendMessage}
                typing={typingFor === activeChat.id}
              />
            ) : (
              <ChatListScreen chats={chats} onOpenChat={openChat} search={search} setSearch={setSearch} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
