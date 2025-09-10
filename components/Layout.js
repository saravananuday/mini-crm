// components/Layout.js
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Layout({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null')
      setUser(u)
    } catch (err) { setUser(null) }
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/leads">Leads</Link>
        <Link href="/opportunities">Opportunities</Link>

        <div style={{ marginLeft: 'auto' }}>
          {user ? (
            <>
              <strong>{user.name}</strong> <small>({user.role})</small>
              <button onClick={handleLogout} style={{ marginLeft: 12 }}>Logout</button>
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </nav>

      <main>{children}</main>
    </div>
  )
}
