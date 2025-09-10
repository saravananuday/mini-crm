// pages/index.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) router.replace('/dashboard')
    else router.replace('/login')
  }, [])

  return <p>Redirecting...</p>
}
