// pages/api/_auth.js
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'dev_secret'

export function getTokenFromReq(req) {
  const auth = req.headers.authorization || ''
  if (!auth) return null
  if (!auth.startsWith('Bearer ')) return null
  return auth.split(' ')[1]
}

export function verifyToken(req) {
  const token = getTokenFromReq(req)
  if (!token) throw new Error('No token provided')
  try {
    const decoded = jwt.verify(token, SECRET)
    return decoded
  } catch (err) {
    throw new Error('Invalid token')
  }
}

export function requireRole(decoded, allowed = []) {
  if (allowed.length && !allowed.includes(decoded.role)) {
    throw new Error('Forbidden')
  }
}
