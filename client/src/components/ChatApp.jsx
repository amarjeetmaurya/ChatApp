import React, { useState, useEffect, useRef } from "react";

export default function ChatApp() {
  const [currentView, setCurrentView] = useState("home"); // "home" or "chat"
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const socketRef = useRef(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  // Dummy rooms data (will be dynamic later)
  const dummyRooms = [
    { id: 1, name: "General Chat", members: 234, online: 45, description: "Main hangout spot for everyone", emoji: "💬", color: "#667eea" },
    { id: 2, name: "Gaming Hub", members: 189, online: 32, description: "Discuss your favorite games", emoji: "🎮", color: "#f093fb" },
    { id: 3, name: "Tech Talk", members: 156, online: 28, description: "All things technology", emoji: "💻", color: "#4facfe" },
    { id: 4, name: "Music Lovers", members: 201, online: 38, description: "Share and discover music", emoji: "🎵", color: "#43e97b" },
    { id: 5, name: "Movie Night", members: 143, online: 22, description: "Movies, shows, and reviews", emoji: "🎬", color: "#fa709a" },
    { id: 6, name: "Food & Recipes", members: 178, online: 31, description: "Cooking and food adventures", emoji: "🍕", color: "#fee140" },
  ];

  useEffect(() => {
    // Initialize user
    let id = localStorage.getItem("clientId");
    let username = localStorage.getItem("username");
    
    if (!id) {
      id = crypto.randomUUID().slice(0, 8);
      localStorage.setItem("clientId", id);
    }
    
    if (!username) {
      username = `User${id.slice(0, 4)}`;
      localStorage.setItem("username", username);
    }

    setCurrentUser({ id, username });

    // Connect WebSocket
    
    // const ws = new WebSocket(`ws://${import.meta.env.VITE_SERVER_URL}:8080`);
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);

    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({ type: "join", id, username }));
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        
        if (data.type === "userCount") {
          setOnlineCount(data.count || 0);
        } else if (data.type === "message") {
          addMessage(data);
        } else {
          addMessage({ type: "system", text: e.data, timestamp: Date.now() });
        }
      } catch {
        addMessage({ type: "system", text: e.data, timestamp: Date.now() });
      }
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

    return () => ws.close();
  }, []);

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 50);
  };

  const joinRoom = (room) => {
    setActiveRoom(room);
    setCurrentView("chat");
    setMessages([]);
    setIsSidebarOpen(false); // Close sidebar when joining room on mobile
  };

  const leaveRoom = () => {
    setCurrentView("home");
    setActiveRoom(null);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sendMessage = () => {
    if (!input.trim() || !isConnected) return;

    socketRef.current.send(
      JSON.stringify({
        type: "chat",
        message: input,
        username: currentUser.username,
        userId: currentUser.id,
        timestamp: Date.now(),
      })
    );
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  // HOME SCREEN - Room Discovery
  if (currentView === "home") {
    return (
      <div style={styles.homeContainer}>
        <div style={styles.homeHeader}>
          <div style={styles.homeLogo}>
            <div style={styles.logoCircle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"/>
              </svg>
            </div>
            <h1 style={styles.homeTitle}>ChatRooms</h1>
          </div>
          <div style={styles.homeUserInfo}>
            <div style={styles.homeAvatar}>
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            <span style={styles.homeUsername}>{currentUser?.username}</span>
          </div>
        </div>

        <div style={styles.homeContent}>
          <div style={styles.homeWelcome}>
            <h2 style={styles.welcomeTitle}>Discover Rooms</h2>
            <p style={styles.welcomeSubtitle}>Join a conversation and connect with others</p>
          </div>

          <div style={styles.roomsGrid}>
            {dummyRooms.map((room) => (
              <div 
                key={room.id} 
                style={{
                  ...styles.roomCard,
                  background: `linear-gradient(135deg, ${room.color}15 0%, ${room.color}05 100%)`,
                  borderColor: `${room.color}30`,
                }}
                onClick={() => joinRoom(room)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                }}
              >
                <div style={styles.roomCardTop}>
                  <div style={{
                    ...styles.roomEmoji,
                    background: `linear-gradient(135deg, ${room.color} 0%, ${room.color}dd 100%)`,
                  }}>
                    {room.emoji}
                  </div>
                  <div style={styles.roomOnlineBadge}>
                    <div style={styles.onlineDot}></div>
                    {room.online} online
                  </div>
                </div>
                
                <h3 style={styles.roomName}>{room.name}</h3>
                <p style={styles.roomDescription}>{room.description}</p>
                
                <div style={styles.roomFooter}>
                  <div style={styles.roomMembers}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}>
                      <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z"/>
                    </svg>
                    <span>{room.members} members</span>
                  </div>
                  <button style={{
                    ...styles.joinButton,
                    background: room.color,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                  }}
                  >
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // CHAT SCREEN WITH SIDEBAR
  return (
    <div style={styles.chatContainer}>
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          style={styles.sidebarOverlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={{
        ...styles.sidebar,
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
      }}>
        <div style={styles.sidebarHeader}>
          <div style={styles.sidebarLogo}>
            <div style={styles.logoCircle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"/>
              </svg>
            </div>
            <span style={styles.sidebarTitle}>My Rooms</span>
          </div>
          <button 
            style={styles.closeSidebarBtn}
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </div>

        <div style={styles.sidebarRooms}>
          {dummyRooms.map((room) => (
            <div
              key={room.id}
              style={{
                ...styles.sidebarRoom,
                background: activeRoom?.id === room.id ? `${room.color}15` : 'transparent',
                borderLeft: activeRoom?.id === room.id ? `3px solid ${room.color}` : '3px solid transparent',
              }}
              onClick={() => joinRoom(room)}
            >
              <div style={{
                ...styles.sidebarRoomIcon,
                background: `linear-gradient(135deg, ${room.color} 0%, ${room.color}dd 100%)`,
              }}>
                {room.emoji}
              </div>
              <div style={styles.sidebarRoomInfo}>
                <div style={styles.sidebarRoomName}>{room.name}</div>
                <div style={styles.sidebarRoomOnline}>
                  <div style={styles.onlineDot}></div>
                  {room.online} online
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.sidebarFooter}>
          <button style={styles.homeButton} onClick={leaveRoom}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={styles.mainChatArea}>
        {/* Chat Header */}
        <div style={styles.chatHeader}>
          <div style={styles.headerLeft}>
            <button 
              style={styles.hamburgerButton}
              onClick={toggleSidebar}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"/>
              </svg>
            </button>
            
            <div style={{
              ...styles.roomIcon,
              background: `linear-gradient(135deg, ${activeRoom?.color} 0%, ${activeRoom?.color}dd 100%)`,
            }}>
              {activeRoom?.emoji}
            </div>
            <div style={styles.headerInfo}>
              <h2 style={styles.chatRoomName}>{activeRoom?.name}</h2>
              <p style={styles.chatRoomStatus}>
                <span style={styles.onlineDot}></span>
                {isConnected ? `${onlineCount || activeRoom?.online || 0} online` : "Connecting..."}
              </p>
            </div>
          </div>
          
          <div style={styles.headerRight}>
            <button 
              style={styles.headerButton}
              onMouseEnter={(e) => e.currentTarget.style.background = "#e9ecef"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#f8f9fa"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"/>
              </svg>
            </button>
            <button 
              style={styles.headerButton}
              onMouseEnter={(e) => e.currentTarget.style.background = "#e9ecef"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#f8f9fa"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div ref={chatRef} style={styles.messagesArea}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{
                ...styles.emptyIcon,
                background: `linear-gradient(135deg, ${activeRoom?.color}20 0%, ${activeRoom?.color}10 100%)`,
              }}>
                <span style={{ fontSize: "48px" }}>{activeRoom?.emoji}</span>
              </div>
              <h3 style={styles.emptyTitle}>Welcome to {activeRoom?.name}</h3>
              <p style={styles.emptyText}>{activeRoom?.description}</p>
              <p style={styles.emptySubtext}>Be the first to send a message!</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              if (msg.type === "system") {
                return (
                  <div key={i} style={styles.systemMessage}>
                    <span>{msg.text}</span>
                  </div>
                );
              }

              const isOwnMessage = msg.userId === currentUser?.id;
              const showAvatar = i === 0 || messages[i - 1]?.userId !== msg.userId;
              const showName = showAvatar;

              return (
                <div 
                  key={i} 
                  style={{
                    ...styles.messageWrapper,
                    justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                  }}
                >
                  {!isOwnMessage && showAvatar && (
                    <div style={styles.messageAvatar}>
                      {msg.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  {!isOwnMessage && !showAvatar && (
                    <div style={{ width: "40px", flexShrink: 0 }}></div>
                  )}
                  
                  <div style={{
                    ...styles.messageBubble,
                    ...(isOwnMessage ? styles.messageBubbleOwn : styles.messageBubbleOther),
                    marginTop: showAvatar ? "12px" : "2px",
                  }}>
                    {!isOwnMessage && showName && (
                      <div style={styles.messageSender}>{msg.username}</div>
                    )}
                    <div style={styles.messageText}>{msg.message || msg.text}</div>
                    <div style={{
                      ...styles.messageTime,
                      color: isOwnMessage ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
                    }}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Area */}
        <div style={styles.inputContainer}>
          <div style={styles.inputWrapper}>
            <button 
              style={styles.inputButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e9ecef";
                e.currentTarget.style.color = "#212529";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#6c757d";
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
              </svg>
            </button>
            
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${activeRoom?.name}...`}
              style={styles.messageInput}
              disabled={!isConnected}
            />
            
            <button 
              style={styles.inputButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e9ecef";
                e.currentTarget.style.color = "#212529";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#6c757d";
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM15.5 11C16.33 11 17 10.33 17 9.5C17 8.67 16.33 8 15.5 8C14.67 8 14 8.67 14 9.5C14 10.33 14.67 11 15.5 11ZM8.5 11C9.33 11 10 10.33 10 9.5C10 8.67 9.33 8 8.5 8C7.67 8 7 8.67 7 9.5C7 10.33 7.67 11 8.5 11ZM12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z"/>
              </svg>
            </button>
            
            <button 
              style={{
                ...styles.sendButton,
                background: isConnected ? `linear-gradient(135deg, ${activeRoom?.color} 0%, ${activeRoom?.color}dd 100%)` : "#ccc",
                cursor: isConnected ? "pointer" : "not-allowed",
              }}
              onClick={sendMessage}
              disabled={!isConnected || !input.trim()}
              onMouseEnter={(e) => {
                if (isConnected) {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.25)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  // HOME SCREEN STYLES
  homeContainer: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  homeHeader: {
    background: "white",
    borderBottom: "1px solid #e9ecef",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  homeLogo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
  },
  homeTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 700,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  homeUserInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 16px",
    background: "#f8f9fa",
    borderRadius: "24px",
  },
  homeAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 600,
    fontSize: "14px",
  },
  homeUsername: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#212529",
  },
  homeContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  homeWelcome: {
    textAlign: "center",
    marginBottom: "48px",
  },
  welcomeTitle: {
    fontSize: "36px",
    fontWeight: 800,
    color: "#212529",
    margin: "0 0 12px 0",
  },
  welcomeSubtitle: {
    fontSize: "18px",
    color: "#6c757d",
    margin: 0,
  },
  roomsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
  },
  roomCard: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    border: "2px solid",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  roomCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  roomEmoji: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  roomOnlineBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    background: "#e7f5ef",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#0ca678",
  },
  onlineDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#0ca678",
  },
  roomName: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#212529",
    margin: "0 0 8px 0",
  },
  roomDescription: {
    fontSize: "14px",
    color: "#6c757d",
    margin: "0 0 20px 0",
    lineHeight: 1.5,
  },
  roomFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "16px",
    borderTop: "1px solid #e9ecef",
  },
  roomMembers: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    color: "#6c757d",
    fontWeight: 500,
  },
  joinButton: {
    padding: "10px 24px",
    borderRadius: "10px",
    border: "none",
    color: "white",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },

  // CHAT SCREEN WITH SIDEBAR
  chatContainer: {
    height: "100vh",
    display: "flex",
    background: "#f8f9fa",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  // Sidebar Overlay
  sidebarOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 998,
    display: "none",
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },

  // Sidebar
  sidebar: {
    width: "280px",
    background: "white",
    borderRight: "1px solid #e9ecef",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    transition: "transform 0.3s ease",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 999,
    '@media (min-width: 769px)': {
      position: 'relative',
      transform: 'translateX(0) !important',
    },
  },
  sidebarHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #e9ecef",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sidebarLogo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  sidebarTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#212529",
  },
  closeSidebarBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "none",
    background: "#f8f9fa",
    color: "#495057",
    cursor: "pointer",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    '@media (max-width: 768px)': {
      display: 'flex',
    },
  },
  sidebarRooms: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 0",
  },
  sidebarRoom: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 20px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  sidebarRoomIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  sidebarRoomInfo: {
    flex: 1,
    minWidth: 0,
  },
  sidebarRoomName: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#212529",
    marginBottom: "4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  sidebarRoomOnline: {
    fontSize: "13px",
    color: "#6c757d",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  sidebarFooter: {
    padding: "16px 20px",
    borderTop: "1px solid #e9ecef",
  },
  homeButton: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#f8f9fa",
    color: "#495057",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  },

  // Main Chat Area
  mainChatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  chatHeader: {
    background: "white",
    borderBottom: "1px solid #e9ecef",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
    minWidth: 0,
  },
  hamburgerButton: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    border: "none",
    background: "#f8f9fa",
    color: "#495057",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },
  roomIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    flexShrink: 0,
  },
  headerInfo: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    flex: 1,
  },
  chatRoomName: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#212529",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  chatRoomStatus: {
    margin: 0,
    fontSize: "13px",
    color: "#6c757d",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: 500,
  },
  headerRight: {
    display: "flex",
    gap: "8px",
    flexShrink: 0,
  },
  headerButton: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    border: "none",
    background: "#f8f9fa",
    color: "#495057",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "40px 20px",
  },
  emptyIcon: {
    width: "120px",
    height: "120px",
    borderRadius: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
  },
  emptyTitle: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#212529",
    margin: "0 0 8px 0",
  },
  emptyText: {
    fontSize: "16px",
    color: "#6c757d",
    margin: "0 0 8px 0",
  },
  emptySubtext: {
    fontSize: "14px",
    color: "#adb5bd",
    margin: 0,
  },
  messageWrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
  },
  messageAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 600,
    fontSize: "14px",
    flexShrink: 0,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: "10px 14px 6px",
    borderRadius: "18px",
    position: "relative",
  },
  messageBubbleOwn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderBottomRightRadius: "4px",
  },
  messageBubbleOther: {
    background: "white",
    color: "#212529",
    borderBottomLeftRadius: "4px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
  },
  messageSender: {
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "4px",
    color: "#667eea",
  },
  messageText: {
    fontSize: "15px",
    lineHeight: 1.4,
    wordBreak: "break-word",
    marginBottom: "4px",
  },
  messageTime: {
    fontSize: "11px",
    textAlign: "right",
    opacity: 0.8,
  },
  systemMessage: {
    textAlign: "center",
    padding: "8px 16px",
    margin: "8px 0",
    fontSize: "13px",
    color: "#6c757d",
    fontStyle: "italic",
  },
  inputContainer: {
    background: "white",
    borderTop: "1px solid #e9ecef",
    padding: "16px 20px",
    flexShrink: 0,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#f8f9fa",
    borderRadius: "24px",
    padding: "8px 8px 8px 16px",
  },
  inputButton: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    background: "transparent",
    color: "#6c757d",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },
  messageInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    fontSize: "15px",
    color: "#212529",
    outline: "none",
    padding: "8px 0",
    minWidth: 0,
  },
  sendButton: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    flexShrink: 0,
  },
};

// Add media query styles dynamically
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      .sidebar-overlay {
        display: block !important;
      }
      .close-sidebar-btn {
        display: flex !important;
      }
    }
    @media (min-width: 769px) {
      .sidebar {
        position: relative !important;
        transform: translateX(0) !important;
      }
    }
  `;
  document.head.appendChild(style);
}