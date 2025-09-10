// pages/api/leads/index.js
import { getDB } from '../_db'
import { verifyToken } from '../_auth'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req, res) {
  const db = await getDB()

  if (req.method === 'GET') {
    try {
      const decoded = verifyToken(req)
      if (decoded.role === 'manager' || decoded.role === 'admin') {
        return res.status(200).json(db.data.leads)
      } else {
        const mine = db.data.leads.filter(l => l.ownerId === decoded.id)
        return res.status(200).json(mine)
      }
    } catch (err) {
      return res.status(401).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    try {
      const decoded = verifyToken(req)
      const { name, email, phone, status } = req.body
      const lead = {
        id: `l_${uuidv4()}`,
        name: name || 'Unnamed',
        email: email || '',
        phone: phone || '',
        status: status || 'New',
        ownerId: decoded.role === 'rep' ? decoded.id : (req.body.ownerId || decoded.id),
        createdAt: new Date().toISOString()
      }
      db.data.leads.push(lead)
      await db.write()
      return res.status(201).json(lead)
    } catch (err) {
      return res.status(401).json({ error: err.message })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end()
}
