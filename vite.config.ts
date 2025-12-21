// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // پوشه‌هایی که نباید نظارت شوند
      ignored: [
        '**/intelligent-writer-backup-20251021/**',
        '**/secret-garden/**',
        // اضافه کردن پوشه‌های مشکل‌ساز دیگر
      ]
    }
  }
})
