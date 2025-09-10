import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";   
import Layout from "../components/Layout";

export default function Dashboard() {
  const [stats, setStats] = useState({ leads: 0, opportunities: 0 });
  const [leads, setLeads] = useState([]);
  const [opps, setOpps] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const leadsRes = await fetch("/api/leads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const oppsRes = await fetch("/api/opportunities", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const leadsData = await leadsRes.json();
      const oppsData = await oppsRes.json();

      setLeads(leadsData);
      setOpps(oppsData);
      setStats({ leads: leadsData.length, opportunities: oppsData.length });
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Dashboard</h1>

      <div className="card-grid">
        <div className="card">
          <h2>Total Leads</h2>
          <p className="big-number">{stats.leads}</p>
        </div>
        <div className="card">
          <h2>Total Opportunities</h2>
          <p className="big-number">{stats.opportunities}</p>
        </div>
      </div>

      <div className="card">
        <h2>Recent Leads</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
            <tbody>
              {leads.slice(0, 5).map((l) => (
                <tr key={l.id}>
                <td data-label="Name">{l.name}</td>
                <td data-label="Status">{l.status}</td>
              </tr>
              ))}
            </tbody>

        </table>
      
      <div style={{ marginTop: "10px", textAlign: "right" }}>
        <Link href="/leads">View All Leads →</Link>
      </div>
      </div>

      <div className="card">
        <h2>Recent Opportunities</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Stage</th>
            </tr>
          </thead>
          <tbody>
            {opps.slice(0, 5).map((o) => (
              <tr key={o.id}>
                <td>{o.name}</td>
                <td>{o.stage}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: "10px", textAlign: "right" }}>
          <Link href="/opportunities">View All Opportunities →</Link>
        </div>
      </div>
    </Layout>  
  );
}
