"use client";
import { useState, useEffect } from "react";
import { useLoan } from "@/hooks/useLoan";
import { User, Loan } from "@/types";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

interface PipelineData {
  pipeline: Record<string, number>;
  totalBorrowers: number;
  totalLeads: number;
  conversionRate: number;
  recentApplications: Loan[];
}

export default function SalesPage() {
  const { getLeads, getPipeline } = useLoan();
  const [leads, setLeads] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pipelineData, setPipelineData] = useState<PipelineData | null>(null);
  const [activeTab, setActiveTab] = useState<"leads" | "pipeline">("pipeline");

  useEffect(() => {
    fetchPipeline();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [search]);

  const fetchPipeline = async () => {
    try {
      const data = await getPipeline();
      setPipelineData(data);
    } catch {}
  };

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

  const totalLoans = pipelineData
    ? Object.values(pipelineData.pipeline).reduce((a: number, b: number) => a + b, 0)
    : 0;

  return (
    <div>
      <PageHeader
        title="Sales Dashboard"
        description="Lead tracking and loan pipeline analytics"
      />

      {/* Pipeline Stats */}
      {pipelineData && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard title="Total Borrowers" value={pipelineData.totalBorrowers} color="indigo"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          <StatCard title="Open Leads" value={pipelineData.totalLeads} color="amber"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          />
          <StatCard title="Conversion" value={`${pipelineData.conversionRate}%`} color="emerald"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
          />
          <StatCard title="Applied" value={pipelineData.pipeline["APPLIED"] || 0} color="indigo"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard title="Sanctioned" value={pipelineData.pipeline["SANCTIONED"] || 0} color="violet"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard title="Disbursed" value={pipelineData.pipeline["DISBURSED"] || 0} color="amber"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />
        </div>
      )}

      {/* Tab Toggle */}
      <div className="flex gap-2 mb-6">
        {(["pipeline", "leads"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
              activeTab === tab
                ? "bg-primary/20 text-white border border-primary/30"
                : "bg-dark-100 text-gray-400 border border-white/5 hover:border-white/10"
            }`}
          >
            {tab === "pipeline" ? "📊 Recent Applications" : `👤 Open Leads (${pipelineData?.totalLeads || 0})`}
          </button>
        ))}
      </div>

      {/* Pipeline Tab — Recent Applications */}
      {activeTab === "pipeline" && pipelineData && (
        <div className="glass-card overflow-hidden">
          {pipelineData.recentApplications.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400">No applications yet</p>
              <p className="text-gray-600 text-sm mt-1">Loan applications will appear here</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase">Applicant</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase">PAN</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase">Amount</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase">Employment</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase">Applied</th>
                </tr>
              </thead>
              <tbody>
                {pipelineData.recentApplications.map((loan, i) => (
                  <motion.tr
                    key={loan._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="table-row"
                  >
                    <td className="px-5 py-4 text-sm text-white font-medium">{loan.fullName}</td>
                    <td className="px-5 py-4 text-sm text-gray-300 font-mono">{loan.pan}</td>
                    <td className="px-5 py-4 text-sm text-white font-mono">{formatCurrency(loan.principal)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium ${
                        loan.employmentMode === "Salaried" ? "text-emerald-400" :
                        loan.employmentMode === "Self-Employed" ? "text-amber-400" : "text-red-400"
                      }`}>
                        {loan.employmentMode}
                      </span>
                    </td>
                    <td className="px-5 py-4"><Badge status={loan.status} /></td>
                    <td className="px-5 py-4 text-sm text-gray-400">{formatDate(loan.appliedAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Leads Tab */}
      {activeTab === "leads" && (
        <>
          <div className="mb-4 w-72">
            <Input
              id="search-leads"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
        </>
      )}
    </div>
  );
}
