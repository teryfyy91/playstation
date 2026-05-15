import { useState, useEffect } from 'react'
import { CalendarCheck, Clock, Plus, X, CalendarX } from 'lucide-react'

const statusColor = {
    'Kutilmoqda': 'bg-amber-900/40 text-amber-400 border-amber-700/40',
    'Tasdiqlangan': 'bg-emerald-900/40 text-emerald-400 border-emerald-700/40',
    'Tasdiqlanmagan': 'bg-red-900/40 text-red-400 border-red-700/40',
}

export default function Booking() {
    const [bookings, setBookings] = useState(() => {
        const saved = localStorage.getItem('ps_bookings')
        return saved ? JSON.parse(saved) : []
    })
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ room: '', client: '', date: '', time: '', hours: 1 })

    useEffect(() => {
        localStorage.setItem('ps_bookings', JSON.stringify(bookings))
    }, [bookings])

    const handleAdd = () => {
        if (!form.room || !form.client || !form.date || !form.time) return
        setBookings(prev => [...prev, { ...form, id: Date.now(), status: 'Kutilmoqda' }])
        setForm({ room: '', client: '', date: '', time: '', hours: 1 })
        setShowForm(false)
    }

    const inputCls = "w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition"

    return (
        <div className="p-6 min-h-screen">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-white text-2xl font-bold">Bron qilish</h1>
                    <p className="text-slate-400 text-sm mt-1">Xonalarni oldindan band qiling</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-900/40 cursor-pointer"
                >
                    <Plus size={16} /> Yangi bron
                </button>
            </div>

            {/* Empty state */}
            {bookings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#1a1630] border border-[#2d2556] flex items-center justify-center mb-4">
                        <CalendarX size={28} className="text-violet-400" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">Hali bron yo'q</p>
                    <p className="text-slate-500 text-sm mb-6">Xonani oldindan band qilish uchun "Yangi bron" tugmasini bosing</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-900/40 cursor-pointer"
                    >
                        <Plus size={16} /> Birinchi bronni qo'shish
                    </button>
                </div>
            )}

            {/* List */}
            <div className="space-y-3">
                {bookings.map(b => (
                    <div key={b.id} className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center flex-shrink-0">
                                <CalendarCheck size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">{b.room} · {b.client}</p>
                                <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                                    <Clock size={11} /> {b.date} soat {b.time} · {b.hours} soat
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${statusColor[b.status]}`}>
                                {b.status}
                            </span>
                            <button
                                onClick={() => setBookings(prev => prev.filter(x => x.id !== b.id))}
                                className="text-slate-500 hover:text-red-400 transition cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#1a1630] border border-[#2d2556] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-white font-bold text-lg mb-5">Yangi bron</h3>

                        <div className="mb-4">
                            <label className="block text-slate-400 text-xs mb-1">Xona nomi</label>
                            <input
                                value={form.room}
                                onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                                placeholder="Masalan: VIP 1, Zal 3..."
                                className={inputCls}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-400 text-xs mb-1">Mijoz ismi</label>
                            <input
                                value={form.client}
                                onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                                placeholder="Ism kiriting..."
                                className={inputCls}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-400 text-xs mb-1">Sana</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                className={inputCls}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-400 text-xs mb-1">Vaqt</label>
                            <input
                                type="time"
                                value={form.time}
                                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                                className={inputCls}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-slate-400 text-xs mb-1">Muddat (soat)</label>
                            <div className="flex gap-2">
                                {[1, 2, 3].map(h => (
                                    <button key={h} onClick={() => setForm(f => ({ ...f, hours: h }))}
                                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition cursor-pointer
                      ${form.hours === h
                                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                                                : 'bg-[#2d2556] text-slate-300 hover:bg-[#3d3470]'}`}>
                                        {h} soat
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowForm(false)}
                                className="flex-1 py-2.5 rounded-xl bg-[#2d2556] text-slate-300 text-sm hover:bg-[#3d3470] transition cursor-pointer"
                            >
                                Bekor
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={!form.room || !form.client || !form.date || !form.time}
                                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-900/40 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Saqlash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
