import Head from 'next/head'
import ResetPassword from '../components/ResetPassword'

export default function ResetPasswordPage() {
  return (
    <>
      <Head>
        <title>Reset Password - Kiwo</title>
        <meta name="description" content="Set a new password for your Kiwo account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ResetPassword />
    </>
  )
}
