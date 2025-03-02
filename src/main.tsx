import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
      <Route path="/" element={<App />} />
      <Route path="/:shareTaskId" element={<App />} />
      </Routes>
      <Toaster />
    </StrictMode>
  </BrowserRouter>
);
