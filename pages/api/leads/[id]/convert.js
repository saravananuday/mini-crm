// pages/api/leads/[id]/convert.js
import { getDB } from '../../_db'
import { verifyToken } from '../../_auth'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req, res) {
  const { id } = req.query
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const decoded = verifyToken(req)
    const db = await getDB()
    const lead = db.data.leads.find(l => l.id === id)
    if (!lead) return res.status(404).json({ error: 'Lead not found' })
    if (decoded.role !== 'manager' && decoded.id !== lead.ownerId) return res.status(403).json({ error: 'Forbidden' })

    const { value, stage } = req.body || {}
    const opp = {
      id: `o_${uuidv4()}`,
      title: `${lead.name} - Opportunity`,
      value: typeof value === 'number' ? value : 0,
      stage: stage || 'Discovery',
      ownerId: lead.ownerId,
      leadId: lead.id,
      createdAt: new Date().toISOString()
    }

    db.data.opportunities.push(opp)
    // update lead status
    lead.status = 'Qualified'
    await db.write()
    return res.status(201).json(opp)
  } catch (err) {
    return res.status(401).json({ error: err.message })
  }
}
