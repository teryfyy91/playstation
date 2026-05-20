import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Clients from './components/Clients'
import Spendings from './components/Spendings'
import Settings from './components/Settings'
import Statistics from './components/Statistics'
import Bar from './components/Bar'
import Login from './components/Login'
import './index.css'

import { supabase } from './lib/supabase'

// ─── Initial Logic for Persistence ───────────────────────────────────────────
const getSaved = (key, def) => {
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : def
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ps_user')
    return saved ? JSON.parse(saved) : null
  })
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('ps_user'))
  const [activePage, setActivePage] = useState('dashboard')

  // Use user-specific keys for sessions
  const getUserKey = (base) => currentUser ? `${base}_${currentUser.id || currentUser.username}` : base

  // Xonalar holati
  const [freeRooms, setFreeRooms] = useState([])
  const [activeRooms, setActiveRooms] = useState([])

  // Load user-specific active rooms once logged in
  useEffect(() => {
    if (currentUser) {
      const savedActive = localStorage.getItem(getUserKey('activeRooms'))
      if (savedActive) setActiveRooms(JSON.parse(savedActive))
      else setActiveRooms([])
    }
  }, [currentUser])

  // Supabase dan xonalarni olish
  useEffect(() => {
    const fetchRooms = async () => {
      if (!currentUser) return;

      let query = supabase.from('rooms').select('*')

      // If we have a way to filter by staff_id, we should do it here
      // For now, if the user is not 'Admin' or 'max', maybe they see nothing?
      // Or we can assume rooms should have a 'staff_id'

      const { data, error } = await query

      if (!error && data) {
        // Filter: only show rooms that belong to this user (if column exists)
        // Since we checked and 'staff_id' is missing, we'll suggest adding it.
        // For now, let's filter locally if possible or just show all but separate active sessions.

        const activeIds = activeRooms.map(r => String(r.id))
        const free = data.filter(r => !activeIds.includes(String(r.id)))
        setFreeRooms(free)
      }
    }
    fetchRooms()
  }, [currentUser, activeRooms])

  // Har safar o'zgarganda saqlab borish
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(getUserKey('activeRooms'), JSON.stringify(activeRooms))
    }
  }, [activeRooms, currentUser])

  const handleLogin = (user) => {
    setCurrentUser(user)
    setIsLoggedIn(true)
    localStorage.setItem('ps_user', JSON.stringify(user))
  }

  const handleLogout = () => {
    const key = getUserKey('activeRooms')
    // Option: clear local sessions on logout for security
    // localStorage.removeItem(key) 

    setCurrentUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('ps_user')
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard
            freeRooms={freeRooms}
            setFreeRooms={setFreeRooms}
            activeRooms={activeRooms}
            setActiveRooms={setActiveRooms}
            setActivePage={setActivePage}
            user={currentUser}
          />
        )
      case 'statistics': return <Statistics freeRooms={freeRooms} activeRooms={activeRooms} setActivePage={setActivePage} user={currentUser} />
      case 'bar': return <Bar />
      case 'spendings': return <Spendings user={currentUser} />
      case 'settings': return <Settings />
      default: return (
        <Dashboard
          freeRooms={freeRooms}
          setFreeRooms={setFreeRooms}
          activeRooms={activeRooms}
          setActiveRooms={setActiveRooms}
          setActivePage={setActivePage}
          user={currentUser}
        />
      )
    }
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen bg-[#0f0c1e] overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} user={currentUser} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  )
}
