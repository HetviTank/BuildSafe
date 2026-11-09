import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

/**
 * Dev only: serve the Vercel function in api/lead.js at /api/lead during `npm run dev`,
 * so the enquiry form can be tested locally. On Vercel the platform runs it instead.
 * Reads CALLMEBOT_* from .env.local.
 */
function devApi() {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, server.config.root, 'CALLMEBOT_'))
      server.middlewares.use('/api/lead', async (req, res) => {
        try {
          const chunks = []
          for await (const c of req) chunks.push(c)
          const { POST } = await server.ssrLoadModule('/api/lead.js')
          if (req.method !== 'POST') {
            res.statusCode = 405
            return res.end()
          }
          const response = await POST(
            new Request(`http://localhost${req.url}`, {
              method: 'POST',
              headers: { 'content-type': 'application/json', 'x-forwarded-for': req.socket.remoteAddress ?? '' },
              body: Buffer.concat(chunks),
            }),
          )
          res.statusCode = response.status
          res.setHeader('content-type', 'application/json')
          res.end(await response.text())
        } catch (err) {
          server.config.logger.error(String(err))
          res.statusCode = 500
          res.end(JSON.stringify({ ok: false, error: 'Dev API error' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devApi()],
})
