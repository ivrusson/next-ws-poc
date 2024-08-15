"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { nanoid } from "nanoid";
import {
  WebSocketMessage,
  useWebSocketClient,
} from "~/hooks/useWebScoketClient";

export default function Page() {
  const [currentRoomName, setCurrentRoomName] = useState<string | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const { clientId, roomId, sendMessage, isConnected, authenticate } =
    useWebSocketClient({
      onMessage: (message) => {
        console.log("Received message:", message);
        if (message.type === "roomJoined") {
          setCurrentRoomName(message.payload.roomId!);
        }
        if (message.type === "message") {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      },
      onOpen: () => {
        console.log("WebSocket connection opened");
        authenticate("valid_token");
      },
      onClose: () => {
        console.log("WebSocket connection closed");
      },
      onError: (error) => {
        console.error("WebSocket error:", error);
      },
    });

  const authorRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);
  const roomIdRef = useRef<HTMLInputElement>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    (ev) => {
      ev.preventDefault();
      const author = authorRef.current?.value;
      const text = textRef.current?.value;
      if (!author || !text) return;

      const content = { id: nanoid(), author, text };

      sendMessage({
        type: "message",
        payload: { roomId: currentRoomName!, content },
      });
      setMessages((prevMessages: WebSocketMessage[]) => [
        ...prevMessages,
        {
          type: "message",
          payload: {
            roomId: currentRoomName!,
            content: {
              ...content,
              author: "You",
            },
            clientId: clientId!,
          },
        },
      ]);
      if (textRef.current) {
        textRef.current.value = "";
      }
    },
    [sendMessage, currentRoomName, clientId]
  );

  const handleJoinRoom = useCallback(() => {
    const roomId = roomIdRef.current?.value;
    sendMessage({ type: "createOrJoinRoom", payload: { roomId } });
  }, [sendMessage]);

  const filteredMessages = useMemo(
    () =>
      messages
        .filter((m) => m.type === "message")
        .filter((m) => m.payload.clientId !== clientId),
    [messages, clientId]
  );

  return (
    <div style={{ maxWidth: "50vh" }}>
      <p>CURRENT ROOM ID: {roomId ?? ""}</p>
      <p>USER ID: {clientId ?? ""}</p>
      <input ref={roomIdRef} type="text" placeholder="Enter room ID" />
      <button onClick={handleJoinRoom} disabled={!isConnected}>
        Join Room
      </button>
      <div style={{ minHeight: "40vh", position: "relative" }}>
        {filteredMessages.map(({ payload: { content } }) => (
          <div key={content?.id}>
            <strong>{content?.author}</strong>: {content?.text}
          </div>
        ))}

        {messages.length === 0 && (
          <div
            style={{
              position: "absolute",
              left: "0",
              top: "0",
              right: "0",
              bottom: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ color: "white" }}>Waiting for messages...</p>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex" }}>
        <input
          name="author"
          ref={authorRef}
          style={{ width: "70px" }}
          type="text"
          placeholder="Your name"
        />
        <input
          name="content"
          ref={textRef}
          style={{ width: "280px" }}
          type="text"
          placeholder="Your message"
        />
        <button type="submit" disabled={!isConnected || !currentRoomName}>
          Send
        </button>
      </form>
    </div>
  );
}
