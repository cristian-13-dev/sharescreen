import { Navigate, Route, Routes } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import Login from "./Login";
import ChatPage from "./ChatPage";

export default function App() {
  return (
    <>
      <Unauthenticated>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Unauthenticated>

      <Authenticated>
        <Routes>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </Authenticated>
    </>
  );
}