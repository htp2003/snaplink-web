import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcssPlugin from '@tailwindcss/postcss'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcssPlugin({
          content: ["./index.html", "./src/**/*.{js,jsx}"],
          theme: {
            extend: {
              colors: {
                primary: {
                  500: '#0ea5e9',
                  600: '#0284c7',
                  700: '#0369a1',
                },
              },
            },
          },
        }),
      ],
    },
  },
})