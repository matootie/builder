import type { AppProps } from "next/app"

import "@styles/globals.css"

function Website({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default Website
