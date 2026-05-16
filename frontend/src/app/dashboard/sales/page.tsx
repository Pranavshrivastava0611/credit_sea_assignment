"use client";
import { useState, useEffect } from "react";
import { useLoan } from "@/hooks/useLoan";
import { User } from "@/types";
import PageHeader from "@/components/layout/PageHeader";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function SalesPage() {
  const { getLeads } = useLoan();
  const [leads, setLeads] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLeads();
  }, [search]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await getLeads(1, 50, search);
      setLeads(data.leads);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Sales Leads"
        description="Registered borrowers who haven't applied for a loan yet"
      >
        <div className="w-64">
          <Input
            id="search-leads"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </PageHeader>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="animate-pulse space-y-0">
            <div className="h-12 bg-white/5" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-white/[0.02] border-t border-white/5" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400">No leads found</p>
            <p className="text-gray-600 text-sm mt-1">All borrowers have submitted applications</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-white/5">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase">Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase">Email</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase">Registered On</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <motion.tr
                  key={lead._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="table-row"
                >
                  <td className="px-5 py-4 text-sm text-white font-medium">{lead.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-300">{lead.email}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{formatDate(lead.createdAt || "")}</td>
                  <td className="px-5 py-4">
                    <span className="status-badge bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      No Application Yet
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
