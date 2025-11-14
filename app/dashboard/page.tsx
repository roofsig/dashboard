'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchLeads()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/')
  }

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('first_seen_at', { ascending: false })
      .limit(20)
    
    if (data) setLeads(data)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500 font-mono text-xl animate-pulse">LOADING...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-red-500 font-mono p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-red-500 pb-4">
          <h1 className="text-3xl">ROOFSIG TERMINAL</h1>
          <button 
            onClick={handleLogout}
            className="border border-red-500 px-4 py-2 hover:bg-red-500 hover:text-black"
          >
            LOGOUT
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border border-red-500 p-4">
            <p className="text-sm opacity-70">TOTAL LEADS</p>
            <p className="text-4xl mt-2">{leads.length}</p>
          </div>
          <div className="border border-red-500 p-4">
            <p className="text-sm opacity-70">TODAY</p>
            <p className="text-4xl mt-2">
              {leads.filter(l => new Date(l.first_seen_at).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
          <div className="border border-red-500 p-4">
            <p className="text-sm opacity-70">ACTIVE</p>
            <p className="text-4xl mt-2">
              {leads.filter(l => l.stage !== 'converted').length}
            </p>
          </div>
        </div>

        {/* Leads Table */}
        <div className="border border-red-500">
          <div className="bg-red-500 text-black p-3 font-bold">
            RECENT LEADS
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-red-500">
                <tr>
                  <th className="text-left p-3">PHONE</th>
                  <th className="text-left p-3">STAGE</th>
                  <th className="text-left p-3">SOURCE</th>
                  <th className="text-left p-3">FIRST SEEN</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-red-900">
                    <td className="p-3">{lead.phone}</td>
                    <td className="p-3 uppercase">{lead.stage}</td>
                    <td className="p-3">{lead.source || 'N/A'}</td>
                    <td className="p-3">
                      {new Date(lead.first_seen_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}