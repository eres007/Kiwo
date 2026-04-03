import Head from 'next/head'
import Signup from '../components/Signup'

export default function SignupPage() {
  return (
    <>
      <Head>
        <title>Sign Up - Kiwo</title>
        <meta name="description" content="Create your Kiwo account and start your AI memory layer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Signup />
    </>
  )
}
