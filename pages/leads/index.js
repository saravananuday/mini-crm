import { useEffect, useState } from "react";
import { useRouter } from "next/router"; 
import Layout from "../../components/Layout";
import Link from "next/link";

export default function Leads() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);
  
  useEffect(() => {
    async function fetchLeads() {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/leads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLeads(data);
    }
    fetchLeads();
  }, []);

  async function convertLead(id) {
    const token = localStorage.getItem("token");
    await fetch(`/api/leads/${id}/convert`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setLeads(leads.map(l => l.id === id ? { ...l, status: "Qualified" } : l));
  }

  async function deleteLead(id) {
    const token = localStorage.getItem("token");
    await fetch(`/api/leads/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setLeads(leads.filter(l => l.id !== id));
  }

  return (
    <Layout>
      <h1 className="page-title">Leads</h1>

      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Owner</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id}>
              <td data-label="Name"><Link href={`/leads/${l.id}`}>{l.name}</Link></td>
              <td data-label="Email">{l.email}</td>
              <td data-label="Phone">{l.phone}</td>
              <td data-label="Status">{l.status}</td>
              <td data-label="Owner">{l.ownerId}</td>
              <td data-label="Actions">
                <button onClick={() => convertLead(l.id)}>Convert</button>{" "}
                <button onClick={() => deleteLead(l.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr><td colSpan={6}>No leads</td></tr>
          )}
        </tbody>
      </table>
    </Layout>
  );
}
