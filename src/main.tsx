import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Signal to prerenderer that the app is ready
// This fires after React has rendered the initial content
setTimeout(() => {
  document.dispatchEvent(new Event("prerender-ready"));
}, 500);
