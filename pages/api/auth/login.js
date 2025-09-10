// pages/api/auth/login.js
import { getDB } from '../_db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'dev_secret'
const EXP = process.env.JWT_EXPIRES_IN || '7d'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const db = await getDB()
  const user = db.data.users.find(u => u.email === email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  let ok = false
  if (user.passwordHash) {
    ok = await bcrypt.compare(password, user.passwordHash)
  } else if (user.password) {
    // fallback if seed used plain (not recommended)
    ok = password === user.password
  }

  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, SECRET, { expiresIn: EXP })
  const userSafe = { id: user.id, name: user.name, email: user.email, role: user.role }
  res.status(200).json({ token, user: userSafe })
}
