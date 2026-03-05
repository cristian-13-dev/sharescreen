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

  if (!roomId)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="text-sm font-medium text-gray-500">Loading room...</div>
        </div>
      </div>
    );
  if (!messages)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="text-sm font-medium text-gray-500">Loading messages...</div>
        </div>
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-white text-gray-900">
      <header
        className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10"
        style={{ WebkitAppRegion: "drag" } as any}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
          <div className="font-bold text-lg tracking-tight ml-16 sm:ml-0">/chat</div>
        </div>
        <div className="flex items-center gap-4" style={{ WebkitAppRegion: "no-drag" } as any}>
          <button
            onClick={() => signOut()}
            className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8 space-y-6 max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
            <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m: any) => (
              <div key={m._id} className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {m.userSubject?.slice(-4) ?? "User"}
                  </span>
                  <span className="text-[10px] text-gray-300">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="mt-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none inline-block max-w-[85%] shadow-sm text-[15px] leading-relaxed">
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="p-6 border-t border-gray-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const t = text.trim();
            if (!t) return;
            sendMessage({ roomId, text: t });
            setText("");
          }}
          className="max-w-4xl mx-auto flex gap-3"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your message..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95"
          >
            <span>Send</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
}