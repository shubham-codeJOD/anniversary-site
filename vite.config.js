import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Plain static build. Output goes to /dist (upload that folder anywhere).
export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 900 },
});