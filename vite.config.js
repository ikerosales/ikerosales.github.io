import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Keep the stylesheet name stable (no hash). Microsoft Clarity replays and
        // heatmaps re-download the CSS from the live site, so a hashed name that
        // changes on every deploy leaves old recordings without any styles.
        assetFileNames: (assetInfo) =>
          assetInfo.name && assetInfo.name.endsWith(".css")
            ? "assets/[name][extname]"
            : "assets/[name]-[hash][extname]",
      },
    },
  },
})
