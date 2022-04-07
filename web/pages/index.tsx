/**
 * Home page.
 */

// Type imports.
import type { NextPage } from "next"

// External imports.
import Head from "next/head"

/**
 * Home page functional React component.
 */
const Home: NextPage = () => {
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

// Export the component.
export default Home
