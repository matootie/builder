import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

const Home: NextPage = () => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Builder</title>
      </Head>
      <div className="w-screen h-screen flex justify-center items-center">
        <h1 className="text-7xl font-bold">Hello, Builder!</h1>
      </div>
    </>
  )
}

export default Home
