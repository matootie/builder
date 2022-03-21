import { NextPage } from "next"

declare module "next" {
  export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
  }
}
