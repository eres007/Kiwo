import Head from 'next/head'
import Login from '../components/Login'

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login - Kiwo</title>
        <meta name="description" content="Sign in to your Kiwo account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Login />
    </>
  )
}
