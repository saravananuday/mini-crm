// pages/api/opportunities/index.js
import { getDB } from '../_db'
import { verifyToken } from '../_auth'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req, res) {
  const db = await getDB()

  if (req.method === 'GET') {
    try {
      const decoded = verifyToken(req)
      if (decoded.role === 'manager' || decoded.role === 'admin') {
        return res.status(200).json(db.data.opportunities)
      } else {
        const mine = db.data.opportunities.filter(o => o.ownerId === decoded.id)
        return res.status(200).json(mine)
      }
    } catch (err) {
      return res.status(401).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    try {
      const decoded = verifyToken(req)
      const { title, value, stage, ownerId, leadId } = req.body
      const opp = {
        id: `o_${uuidv4()}`,
        title: title || 'Untitled',
        value: value || 0,
        stage: stage || 'Discovery',
        ownerId: decoded.role === 'rep' ? decoded.id : (ownerId || decoded.id),
        leadId: leadId || null,
        createdAt: new Date().toISOString()
      }
      db.data.opportunities.push(opp)
      await db.write()
      return res.status(201).json(opp)
    } catch (err) {
      return res.status(401).json({ error: err.message })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end()
}
