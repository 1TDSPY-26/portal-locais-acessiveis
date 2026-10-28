import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./global.css";
import { aplicarPreferencias, lerPreferencias } from "./services/preferencias.ts";

//aplica as preferencias salvas antes de renderizar a pag.
aplicarPreferencias(lerPreferencias()) 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
