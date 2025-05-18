// src/pages/_app.tsx
import { Web3Provider } from '../context/Web3Context'
import { Analytics } from "@vercel/analytics/next"
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <Analytics />
      <Component {...pageProps} />
    </Web3Provider>
  )
}
