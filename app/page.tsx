'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono">
      <div className="w-full max-w-md p-8 border border-red-500">
        <h1 className="text-red-500 text-2xl mb-8 text-center">ROOFSIG TERMINAL</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-red-500 text-red-500 p-3 focus:outline-none focus:border-red-300"
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-red-500 text-red-500 p-3 focus:outline-none focus:border-red-300"
            />
          </div>

          {error && <p className="text-red-300 text-sm">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-red-500 text-black p-3 hover:bg-red-600 font-bold"
          >
            ACCESS TERMINAL
          </button>
        </form>
      </div>
    </div>
  )
}