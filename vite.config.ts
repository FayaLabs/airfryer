import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

// Server-rendered on TanStack Start, deployed to Cloudflare Workers. Always
// built against the published @fayz-ai/* packages: this store has no sibling
// SDK checkout to alias, on purpose.
export default defineConfig({
  server: {
    port: 5320,
    strictPort: true,
    // Vite 7 host-checks every request; `--host` only changes the bind address.
    host: true,
    allowedHosts: true,
  },
  envPrefix: ['PUBLIC_'],
  resolve: {
    // One copy of anything stateful: two React or zustand instances make hooks
    // read a store they do not subscribe to.
    dedupe: ['react', 'react-dom', 'zustand', 'lucide-react', '@supabase/supabase-js'],
  },
  plugins: [
    // Order matters: cloudflare claims the `ssr` environment, tanstackStart
    // builds into it, and react's plugin comes last.
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart(),
    viteReact(),
  ],
  ssr: { noExternal: [/^@fayz-ai\//] },
})
