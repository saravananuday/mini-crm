import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";


import Layout from "../../components/Layout";

export default function Opportunities() {
  const router = useRouter(); 
  const [opps, setOpps] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    async function fetchOpps() {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/opportunities", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOpps(data);
    }
    fetchOpps();
  }, []);

  async function updateStage(id) {
    const stage = prompt("Enter new stage (Discovery, Proposal, Won, Lost):");
    if (!stage) return;
    const token = localStorage.getItem("token");
    await fetch(`/api/opportunities/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stage }),
    });
    setOpps(opps.map(o => o.id === id ? { ...o, stage } : o));
  }

  return (
    <Layout>
      <h1 className="page-title">Opportunities</h1>

      <table>
        <thead>
          <tr>
            <th>Title</th><th>Value</th><th>Stage</th><th>Owner</th><th>Lead</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {opps.map((o) => (
            <tr key={o.id}>
              <td data-label="Title">{o.title}</td>
              <td data-label="Value">{o.value}</td>
              <td data-label="Stage">{o.stage}</td>
              <td data-label="Owner">{o.ownerId}</td>
              <td data-label="Lead">{o.leadId || "-"}</td>
              <td data-label="Actions">
                <button onClick={() => updateStage(o.id)}>Update Stage</button>
              </td>
            </tr>
          ))}
          {opps.length === 0 && (
            <tr><td colSpan={6}>No opportunities</td></tr>
          )}
        </tbody>
      </table>
    </Layout>
  );
}
