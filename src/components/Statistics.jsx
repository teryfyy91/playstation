import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, DollarSign, Clock, Users, ArrowUpRight, ArrowDownRight, Loader2, Wallet } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Statistics({ freeRooms, activeRooms, setActivePage }) {
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('ps_detailed_history') || '[]'))
    const [spendings, setSpendings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const { data: hData, error: hError } = await supabase.from('history').select('*').order('created_at', { ascending: false })
            const { data: sData, error: sError } = await supabase.from('spendings').select('*')

            if (hError) throw hError
            if (sError) throw sError

            if (hData) {
                setHistory(prev => {
                    const merged = [...hData]
                    prev.forEach(local => {
                        const isDuplicate = hData.some(remote =>
                            remote.id === local.id ||
                            (remote.created_at === local.created_at && (remote.room_name || remote.name) === (local.room_name || local.name))
                        )
                        if (!isDuplicate) merged.push(local)
                    })
                    return merged
                })
            }
            if (sData) setSpendings(sData)
        } catch (err) {
            console.error("Stats fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    const totalIncome = history.reduce((acc, h) => acc + Number(h.totalPrice || h.total_price || 0), 0)
    const todayIncome = history.filter(h => h.date === today).reduce((acc, h) => acc + Number(h.totalPrice || h.total_price || 0), 0)
    const totalSpend = spendings.reduce((acc, s) => acc + Number(s.amount || 0), 0)

    const stats = [
        { label: 'Umumiy daromad', value: totalIncome.toLocaleString() + " so'm", trend: '+12%', isUp: true, icon: DollarSign, color: 'from-emerald-600 to-teal-600' },
        { label: 'Bugungi foyda', value: todayIncome.toLocaleString() + " so'm", trend: 'Bugun', isUp: true, icon: TrendingUp, color: 'from-blue-600 to-cyan-600' },
        { label: "Sof foyda", value: (totalIncome - totalSpend).toLocaleString() + " so'm", trend: '+8%', isUp: true, icon: BarChart3, color: 'from-violet-600 to-indigo-600' },
        { label: 'Umumiy xarajat', value: totalSpend.toLocaleString() + " so'm", trend: '+5%', isUp: false, icon: Wallet, color: 'from-rose-600 to-pink-600' },
    ]

    // Room performance from history (all-time)
    const roomPerformance = {}
    history.forEach(h => {
        const rName = h.name || h.room_name || "Noma'lum Xona"
        const income = Number(h.totalPrice || h.total_price || 0)
        roomPerformance[rName] = (roomPerformance[rName] || 0) + income
    })

    const roomStats = Object.keys(roomPerformance).map(name => ({
        name,
        incomeValue: roomPerformance[name],
        totalIncome: roomPerformance[name].toLocaleString() + " so'm",
        usage: Math.min(100, (roomPerformance[name] / (totalIncome || 1)) * 100)
    })).sort((a, b) => b.incomeValue - a.incomeValue).slice(0, 8)

    if (loading) {
        return (
            <div className="p-6 min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="text-violet-500 animate-spin mb-4" size={40} />
                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Statistika hisoblanmoqda...</p>
            </div>
        )
    }

    return (
        <div className="p-6 min-h-screen animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-white text-3xl font-black uppercase tracking-tighter">Statistika</h1>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-1">Klubingiz moliyaviy faoliyati tahlili</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                    <div key={i} className="rounded-[28px] bg-[#1a1630] border border-[#2d2556] p-6 shadow-xl hover:border-violet-500/30 transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/10 transition-all duration-700"></div>
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg shadow-black/20`}>
                                <s.icon size={24} className="text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter ${s.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {s.trend}
                                {s.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                        </div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-white text-xl font-black tracking-tighter">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Popular Rooms */}
                <div className="lg:col-span-2 rounded-[32px] bg-[#1a1630] border border-[#2d2556] p-8 shadow-2xl">
                    <h3 className="text-white font-black text-lg uppercase tracking-tighter mb-8 flex items-center gap-3">
                        <BarChart3 size={20} className="text-violet-400" />
                        Xonalar bo'yicha umumiy foyda
                    </h3>
                    <div className="space-y-8">
                        {roomStats.length === 0 ? (
                            <div className="py-20 text-center bg-[#0f0c1e]/30 rounded-3xl border border-dashed border-[#2d2556]">
                                <p className="text-slate-600 italic">Hali ma'lumotlar mavjud emas</p>
                            </div>
                        ) : (
                            roomStats.map((room, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between mb-3 items-end">
                                        <span className="text-white text-sm font-black uppercase tracking-tight group-hover:text-violet-400 transition">{room.name}</span>
                                        <span className="text-emerald-400 text-xs font-black font-mono">{room.totalIncome}</span>
                                    </div>
                                    <div className="w-full bg-[#0f0c1e] rounded-full h-3 overflow-hidden border border-[#2d2556] shadow-inner">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 shadow-lg bg-gradient-to-r from-violet-600 to-indigo-600`}
                                            style={{ width: `${room.usage > 5 ? room.usage : 5}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Spendings */}
                <div className="rounded-[32px] bg-[#1a1630] border border-[#2d2556] p-8 shadow-2xl flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-black text-lg uppercase tracking-tighter flex items-center gap-3">
                            <Wallet size={20} className="text-rose-400" />
                            So'nggi Xarajatlar
                        </h3>
                        <button onClick={() => setActivePage('spendings')} className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition cursor-pointer">Barchasi</button>
                    </div>
                    <div className="space-y-4 flex-1">
                        {spendings.length === 0 ? (
                            <div className="py-12 text-center bg-[#0f0c1e]/30 rounded-3xl border border-dashed border-[#2d2556]">
                                <p className="text-slate-600 italic text-sm">Xarajatlar mavjud emas</p>
                            </div>
                        ) : (
                            spendings.slice(0, 4).map((s, i) => (
                                <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-[#0f0c1e] border border-[#2d2556] hover:border-rose-500/30 transition-all">
                                    <div className="min-w-0 flex-1 mr-4">
                                        <p className="text-white font-bold text-sm truncate">{s.description}</p>
                                        <p className="text-slate-500 text-[10px] uppercase font-bold mt-0.5">{s.date}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-rose-400 font-black font-mono text-sm">-{Number(s.amount).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
