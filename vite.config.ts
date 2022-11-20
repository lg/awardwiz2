/// <reference types="vitest" />

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import Icons from "unplugin-icons/vite"
import { visualizer } from "rollup-plugin-visualizer"
import watchAndRun from "vite-plugin-watch-and-run"
import path from "node:path"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },

  plugins: [
    react(),
    Icons({
      compiler: "jsx",
      jsx: "react",
      defaultStyle: "vertical-align: text-bottom;"
    }),
    visualizer({ open: process.env.SHOW_VIZ ? process.env.SHOW_VIZ === "true" : true }),
    watchAndRun([{
      name: "generate-ts-schemas",
      watch: path.resolve("src/**/*.schema.json"),
      run: "npm run schemas"
    }])
  ],

  test: {
    globals: true,
    maxConcurrency: 10,
    testTimeout: 3 * 60000, // incase we get in the test queue on browserless
    environment: "jsdom",
    onConsoleLog: (log, type) => {
      if (log.includes("Not implemented")) return false   // jsdom doesnt implement some methods that antd expects on dom elements
      if (log.replaceAll("render", "").trim() === "") return false
      return
    },
    coverage: {
      reporter: ["lcovonly"],
      enabled: true,
      clean: true
    },
    sequence: { shuffle: true },
    passWithNoTests: true
  }
})
