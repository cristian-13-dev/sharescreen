import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";

export default function ChatPage() {
  const {signOut} = useAuthActions();

  const ensureGeneralRoom = useMutation(api.seed.ensureGeneralRoom);
  const sendMessage = useMutation(api.messages.sendMessage);

  const [roomId, setRoomId] = useState<any>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    ensureGeneralRoom({}).then(setRoomId);
  }, [ensureGeneralRoom]);

  const messages = useQuery(
    api.messages.listMessages,
    roomId ? {roomId} : "skip"
  );

  if (!roomId) return <div style={{padding: 20}}>Loading room...</div>;
  if (!messages) return <div style={{padding: 20}}>Loading messages...</div>;

  return (
    <div style={{height: "100vh", display: "flex", flexDirection: "column"}}>
      <header
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{fontWeight: 600}}>/chat</div>
        <button onClick={() => signOut()} style={{padding: "6px 10px"}}>
          Sign out
        </button>
      </header>

      <main style={{flex: 1, overflow: "auto", padding: 16}}>
        {messages.length === 0 ? (
          <div style={{opacity: 0.7}}>No messages yet.</div>
        ) : (
          messages.map((m) => (
            <div key={m._id} style={{padding: "6px 0"}}>
              {m.text}
            </div>
          ))
        )}
      </main>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const t = text.trim();
          if (!t) return;
          sendMessage({roomId, text: t});
          setText("");
        }}
        style={{
          padding: 16,
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{flex: 1, padding: "10px 12px"}}
        />
        <button type="submit" style={{padding: "10px 12px"}}>
          Send
        </button>
      </form>
    </div>
  );
}