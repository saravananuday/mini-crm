// pages/api/opportunities/[id].js
import { getDB } from '../_db'
import { verifyToken } from '../_auth'

export default async function handler(req, res) {
  const { id } = req.query
  const db = await getDB()
  const opp = db.data.opportunities.find(o => o.id === id)
  if (!opp) return res.status(404).json({ error: 'Opportunity not found' })

  try {
    const decoded = verifyToken(req)

    if (req.method === 'GET') {
      if (decoded.role !== 'manager' && decoded.id !== opp.ownerId) return res.status(403).json({ error: 'Forbidden' })
      return res.status(200).json(opp)
    }

    if (req.method === 'PUT') {
      if (decoded.role !== 'manager' && decoded.id !== opp.ownerId) return res.status(403).json({ error: 'Forbidden' })
      const { title, value, stage, ownerId } = req.body
      opp.title = title ?? opp.title
      opp.value = value ?? opp.value
      opp.stage = stage ?? opp.stage
      if (decoded.role === 'manager' && ownerId) opp.ownerId = ownerId
      await db.write()
      return res.status(200).json(opp)
    }

    if (req.method === 'DELETE') {
      if (decoded.role !== 'manager' && decoded.id !== opp.ownerId) return res.status(403).json({ error: 'Forbidden' })
      db.data.opportunities = db.data.opportunities.filter(o => o.id !== id)
      await db.write()
      return res.status(200).json({ success: true })
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end()
  } catch (err) {
    return res.status(401).json({ error: err.message })
  }
}
