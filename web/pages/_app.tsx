import type { AppProps } from "next/app"

import { NextPage } from "next"
import { ReactElement, ReactNode } from "react"
import { UserProvider } from "@auth0/nextjs-auth0"

import "@styles/globals.css"

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  const page = getLayout(<Component {...pageProps} />)
  return <UserProvider>{page}</UserProvider>
}

export default MyApp
