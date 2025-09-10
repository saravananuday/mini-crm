// pages/api/leads/[id].js
import { getDB } from '../_db'
import { verifyToken } from '../_auth'

export default async function handler(req, res) {
  const { id } = req.query
  const db = await getDB()
  const lead = db.data.leads.find(l => l.id === id)
  if (!lead) return res.status(404).json({ error: 'Lead not found' })

  try {
    const decoded = verifyToken(req)

    if (req.method === 'GET') {
      if (decoded.role !== 'manager' && decoded.id !== lead.ownerId) return res.status(403).json({ error: 'Forbidden' })
      return res.status(200).json(lead)
    }

    if (req.method === 'PUT') {
      if (decoded.role !== 'manager' && decoded.id !== lead.ownerId) return res.status(403).json({ error: 'Forbidden' })
      const { name, email, phone, status, ownerId } = req.body
      lead.name = name ?? lead.name
      lead.email = email ?? lead.email
      lead.phone = phone ?? lead.phone
      lead.status = status ?? lead.status
      if (decoded.role === 'manager' && ownerId) lead.ownerId = ownerId
      await db.write()
      return res.status(200).json(lead)
    }

    if (req.method === 'DELETE') {
      if (decoded.role !== 'manager' && decoded.id !== lead.ownerId) return res.status(403).json({ error: 'Forbidden' })
      db.data.leads = db.data.leads.filter(l => l.id !== id)
      await db.write()
      return res.status(200).json({ success: true })
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end()
  } catch (err) {
    return res.status(401).json({ error: err.message })
  }
}
