// pages/leads/[id].js
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getAuth, authFetch } from '../../utils/auth-client'

export default function LeadDetail() {
  const router = useRouter()
  const { id } = router.query
  const [lead, setLead] = useState(null)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const { token } = getAuth()
    if (!token) { router.push('/login'); return }
    if (id) load()
  }, [id])

  async function load() {
    setLoading(true)
    const res = await authFetch(`/api/leads/${id}`)
    if (!res.ok) {
      const d = await res.json()
      alert(d.error || 'Error')
      router.push('/leads')
      return
    }
    const data = await res.json()
    setLead(data)
    setForm({ name: data.name, email: data.email, phone: data.phone, status: data.status, ownerId: data.ownerId })
    setLoading(false)
  }

  async function save(e) {
    e.preventDefault()
    const res = await authFetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const d = await res.json()
    if (res.ok) { alert('Saved'); setLead(d) } else alert(d.error || 'Error')
  }

  if (loading || !lead) return <Layout><p>Loading...</p></Layout>

  return (
    <Layout>
      <h1>Lead: {lead.name}</h1>
      <form onSubmit={save}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
        </select>
        <input placeholder="ownerId (manager only)" value={form.ownerId} onChange={e => setForm({ ...form, ownerId: e.target.value })} />
        <button type="submit">Save</button>
      </form>
    </Layout>
  )
}
