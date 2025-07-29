import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, ".cert/key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, ".cert/cert.pem")),
    },
    port: 5173, // or your preferred port
  },
});
