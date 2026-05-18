import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Booking from './components/Booking'
import Clients from './components/Clients'
import Spendings from './components/Spendings'
import Settings from './components/Settings'
import Statistics from './components/Statistics'
import Employer from './components/Employer'
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
  const [currentUser, setCurrentUser] = useState(() => getSaved('ps_user', null))
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('ps_user'))
  const [activePage, setActivePage] = useState('dashboard')

  // Xonalar holati
  const [freeRooms, setFreeRooms] = useState([])
  const [activeRooms, setActiveRooms] = useState(() => getSaved('activeRooms', []))

  // Supabase dan xonalarni olish
  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')

      if (!error && data) {
        // Faqat bo'sh xonalarni (localStorage dagi active larda yo'qlarini) freeRooms ga yuklaymiz
        const activeIds = activeRooms.map(r => String(r.id))
        const free = data.filter(r => !activeIds.includes(String(r.id)))
        setFreeRooms(free)
      }
    }
    fetchRooms()
  }, [])

  // Har safar o'zgarganda saqlab borish (ActiveRooms hali localda qolishi mumkin yoki uni ham sync qilish kerak)
  useEffect(() => {
    localStorage.setItem('activeRooms', JSON.stringify(activeRooms))
  }, [activeRooms])

  const handleLogin = (user) => {
    setCurrentUser(user)
    setIsLoggedIn(true)
    localStorage.setItem('ps_user', JSON.stringify(user))
  }

  const handleLogout = () => {
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
          />
        )
      case 'booking': return <Booking />
      case 'statistics': return <Statistics freeRooms={freeRooms} activeRooms={activeRooms} setActivePage={setActivePage} />
      case 'bar': return <Bar />
      case 'employer': return <Employer />
      case 'spendings': return <Spendings />
      case 'settings': return <Settings />
      default: return (
        <Dashboard
          freeRooms={freeRooms}
          setFreeRooms={setFreeRooms}
          activeRooms={activeRooms}
          setActiveRooms={setActiveRooms}
          setActivePage={setActivePage}
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
