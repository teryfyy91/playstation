import { useState, useEffect } from 'react'
import { CalendarCheck, Clock, Plus, X, CalendarX, Loader2, MapPin, User, Timer } from 'lucide-react'
import { supabase } from '../lib/supabase'

const statusColor = {
    'Kutilmoqda': 'bg-amber-900/20 text-amber-500 border-amber-800/30',
    'Tasdiqlangan': 'bg-emerald-900/20 text-emerald-500 border-emerald-800/30',
    'Tasdiqlanmagan': 'bg-red-900/20 text-red-500 border-red-800/30',
}

export default function Booking() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ room: '', client: '', date: '', time: '', hours: 1 })

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('date', { ascending: true })
            if (error) throw error
            if (data) setBookings(data)
        } catch (err) {
            console.error("Booking fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async () => {
        if (!form.room || !form.client || !form.date || !form.time) return

        try {
            const { error } = await supabase
                .from('bookings')
                .insert([{ ...form, status: 'Kutilmoqda' }])

            if (error) throw error

            fetchBookings()
            setForm({ room: '', client: '', date: '', time: '', hours: 1 })
            setShowForm(false)
        } catch (err) {
            alert("Bron qilishda xatolik: " + err.message)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Ushbu bronni o'chirmoqchimisiz?")) return

        try {
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', id)

            if (error) throw error
            setBookings(prev => prev.filter(x => x.id !== id))
        } catch (err) {
            alert("O'chirishda xatolik: " + err.message)
        }
    }

    const inputCls = "w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-2xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition shadow-inner placeholder:text-slate-700"

    return (
        <div className="p-6 min-h-screen animate-fadeIn">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-white text-3xl font-black uppercase tracking-tighter">Bron qilish</h1>
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-1">Xonalarni oldindan band qilish tizimi</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition shadow-lg shadow-violet-900/40 cursor-pointer"
                >
                    <Plus size={18} /> Yangi bron
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="text-violet-500 animate-spin mb-4" size={40} />
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Yuklanmoqda...</p>
                </div>
            ) : bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center bg-[#1a1630]/30 border-2 border-dashed border-[#2d2556] rounded-[48px]">
                    <div className="w-20 h-20 rounded-3xl bg-[#1a1630] border border-[#2d2556] flex items-center justify-center mb-6 shadow-2xl">
                        <CalendarX size={32} className="text-slate-700" />
                    </div>
                    <h3 className="text-white font-black text-xl mb-2">Hali band qilingan joylar yo'q</h3>
                    <p className="text-slate-600 text-sm mb-8 font-medium">Barcha buyurtmalar shu yerda ko'rinadi</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all shadow-xl cursor-pointer"
                    >
                        <Plus size={18} /> Birinchi bronni qo'shish
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookings.map(b => (
                        <div key={b.id} className="rounded-[32px] bg-[#1a1630] border border-[#2d2556] p-6 hover:border-violet-500/30 transition-all group relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-violet-600/10 transition-all"></div>

                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#0f0c1e] border border-[#2d2556] flex items-center justify-center text-violet-400">
                                        <CalendarCheck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-base tracking-tight">{b.room}</h4>
                                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Xona nomi</p>
                                    </div>
                                </div>
                                <span className={`text-[9px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border ${statusColor[b.status]}`}>
                                    {b.status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <User size={14} className="text-slate-500" />
                                    <span className="text-xs font-bold">{b.client}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Clock size={14} className="text-slate-500" />
                                    <span className="text-xs font-bold font-mono">{b.date} / {b.time}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Timer size={14} className="text-slate-500" />
                                    <span className="text-xs font-bold">{b.hours} soat band qilingan</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(b.id)}
                                className="w-full py-3 rounded-xl bg-red-600/5 border border-red-600/10 text-red-500/50 hover:bg-red-600 hover:text-white hover:border-red-500 transition-all text-[10px] font-black uppercase tracking-widest cursor-pointer"
                            >
                                <X size={14} className="inline mr-2" /> O'chirish
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-[#1a1630] border border-[#2d2556] rounded-[40px] p-8 w-full max-w-sm shadow-2xl animate-scaleUp">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-white font-black text-xl uppercase tracking-tighter">Yangi Bron</h3>
                            <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-[#0f0c1e] flex items-center justify-center text-slate-500 hover:text-white transition cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5 mb-8">
                            <div>
                                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Xona nomi</label>
                                <input value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                                    placeholder="Masalan: VIP 1, Zal 3..." className={inputCls} />
                            </div>

                            <div>
                                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Mijoz ismi</label>
                                <input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                                    placeholder="Mijoz ismini yozing..." className={inputCls} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Sana</label>
                                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Vaqt</label>
                                    <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className={inputCls} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Muddat (soat)</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 5].map(h => (
                                        <button key={h} onClick={() => setForm(f => ({ ...f, hours: h }))}
                                            className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition shadow-lg cursor-pointer
                                                ${form.hours === h
                                                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-900/40 scale-105'
                                                    : 'bg-[#0f0c1e] border border-[#2d2556] text-slate-500 hover:text-slate-300'}`}>
                                            {h}s
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowForm(false)} className="flex-1 py-4 rounded-2xl bg-[#0f0c1e] text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition cursor-pointer">Bekor</button>
                            <button onClick={handleAdd} disabled={!form.room || !form.client || !form.date || !form.time}
                                className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-violet-900/40 hover:scale-105 active:scale-95 transition cursor-pointer disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed">Saqlash</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
