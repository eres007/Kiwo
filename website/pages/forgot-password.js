import Head from 'next/head'
import ForgotPassword from '../components/ForgotPassword'

export default function ForgotPasswordPage() {
  return (
    <>
      <Head>
        <title>Forgot Password - Kiwo</title>
        <meta name="description" content="Reset your Kiwo account password" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ForgotPassword />
    </>
  )
}
