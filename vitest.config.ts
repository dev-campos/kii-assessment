import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        exclude: ["node_modules"],
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
});
