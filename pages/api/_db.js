// pages/api/_db.js
import { Low, JSONFile } from 'lowdb'
import path from 'path'

const file = path.join(process.cwd(), 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

export async function getDB() {
  await db.read()
  db.data ||= { users: [], leads: [], opportunities: [] }
  return db
}
