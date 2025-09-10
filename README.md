**Mini CRM for Sales Teams**

A lightweight CRM (Customer Relationship Management) app built with Next.js.  
It demonstrates authentication, role-based access, CRUD operations, and a responsive UI.  

This project was developed as part of the Full Stack Developer Internship Assessment.  

---

**Features**

- Authentication with JWT (login required to access app)  

- **Role-based access**
  - Manager → can view & manage all leads/opportunities  
  - Sales Rep → can only see their own leads/opportunities  

- **Leads Management**
  - Create, view, update, delete  
  - Convert leads → opportunities  

- **Opportunities Management**
  - Create, view, update, delete  
  - Update sales stage (Discovery → Proposal → Won/Lost)  

- **Dashboard**
  - Summary of leads and opportunities  
  - Recent leads & opportunities with “View All” links  

- **Responsive UI** (mobile-friendly tables, card view)  

---

**Test Accounts**

Manager:  
Email: mgr@demo.com
Password: Manager@123

Sales Rep:  
Email: rep@demo.com
Password: Rep@123


---

**Tech Stack**

- Frontend: Next.js (React, JavaScript)  
- Backend: Next.js API Routes  
- Auth: JWT (JSON Web Tokens)  
- Data Store: `db.json` (with json-server)  
- Styling: Custom CSS (responsive + modern layout)  

---

**Setup Instructions**

Clone the repo
   ```bash
   git clone https://github.com/<your-username>/mini-crm.git
   cd mini-crm

npm install
npm run seed
npm run dev

Open in browser → http://localhost:3000

Notes
-  If not logged in, users will be redirected to the login page.
- Leads can be converted into Opportunities.
- Opportunities support stage updates (Discovery → Proposal → Won/Lost).

Developed as part of NeoStats Analytics – Full Stack Developer Internship Assessment.
