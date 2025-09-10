// scripts/seed.js
const fs = require('fs')
const bcrypt = require('bcryptjs')
const path = require('path')

const file = path.join(process.cwd(), 'db.json')

const managerHash = bcrypt.hashSync('Manager@123', 10)
const repHash = bcrypt.hashSync('Rep@123', 10)

const db = {
  users: [
    { id: 'u_mgr', name: 'Manager User', email: 'mgr@demo.com', passwordHash: managerHash, role: 'manager' },
    { id: 'u_rep', name: 'Rep User', email: 'rep@demo.com', passwordHash: repHash, role: 'rep' }
  ],
  leads: [
    // example lead (ownerId = u_rep)
    { id: 'l_1', name: 'Bob Buyer', email: 'bob@buyer.com', phone: '9999999999', status: 'New', ownerId: 'u_rep', createdAt: new Date().toISOString() }
  ],
  opportunities: []
}

fs.writeFileSync(file, JSON.stringify(db, null, 2))
console.log('Seeded db.json with manager and rep.')
console.log('Manager -> mgr@demo.com / Manager@123')
console.log('Rep -> rep@demo.com / Rep@123')
