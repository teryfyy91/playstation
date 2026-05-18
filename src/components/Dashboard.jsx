import { useState, useEffect } from 'react'
import {
    Clock, AlertTriangle, Play, DoorOpen, Tv, Users,
    Activity, Plus, X, Settings2, Search, Package, DollarSign
} from 'lucide-react'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(seconds) {
    const abs = Math.abs(seconds)
    const h = Math.floor(abs / 3600)
    const m = Math.floor((abs % 3600) / 60)
    const s = abs % 60
    if (h > 0) {
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatMoney(num) {
    return Number(num).toLocaleString('uz-UZ') + " so'm"
}

// ─── Countdown ─────────────────────────────────────────────────────────────
function useCountdown(initialSeconds) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds)
    useEffect(() => {
        const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
        return () => clearInterval(interval)
    }, [])
    return timeLeft
}

// ─── Live Session Stats ──────────────────────────────────────────────────────
function LiveSessionStats({ room }) {
    const elapsedSeconds = useStopwatch(room.startTimeActual)
    const productTotal = (room.orders || []).reduce((sum, p) => sum + (Number(p.price) || 0), 0)
    const hoursElapsed = elapsedSeconds / 3600
    const earnedMoney = (Number(room.price) * hoursElapsed) + productTotal

    return (
        <div className="flex flex-col">
            <p className="text-emerald-400 text-lg font-mono font-black tracking-tighter">
                {formatTime(elapsedSeconds)} · {formatMoney(Math.round(earnedMoney))}
            </p>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                Tarif: {formatMoney(room.price)}/s
            </p>
        </div>
    )
}

// ─── Room Details Modal (Room Control Center) ───────────────────────────────
function RoomDetailsModal({ room, history, onClose, onAddOrder, isActive, onStop, barProducts }) {
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    const roomHistory = history.filter(h => {
        const hId = String(h.roomId || h.room_id || '').trim()
        const rId = String(room.id || '').trim()

        const hName = String(h.room_name || h.name || '').toLowerCase().trim()
        const rName = String(room.name || '').toLowerCase().trim()

        const idMatch = rId && hId === rId
        const nameMatch = rName && hName === rName
        const dateMatch = h.date === today

        return (idMatch || nameMatch) && dateMatch
    })

    const totalEarnings = roomHistory.reduce((sum, h) => sum + (Number(h.totalPrice || h.total_price || 0)), 0)
    const totalHours = roomHistory.reduce((sum, h) => sum + (Number(h.hours || 0)), 0)

    // Sklad mahsulotlari (Passed as prop)
    const [showSklad, setShowSklad] = useState(false)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl">
            <div className="bg-[#1a1630] border-none w-full h-full shadow-2xl overflow-hidden animate-scaleUp flex flex-col md:flex-row">

                {/* LEFT SIDE: STATISTICS & HISTORY */}
                <div className="flex-1 p-8 border-r border-[#2d2556] overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg">
                            <Tv size={28} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-2xl uppercase tracking-tighter">{room.name}</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Bugungi hisobot · {today}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-10">
                        <div className="bg-[#0f0c1e] p-5 rounded-3xl border border-[#2d2556]">
                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2">Mijozlar</p>
                            <p className="text-white text-3xl font-black">{roomHistory.length}</p>
                        </div>
                        <div className="bg-[#0f0c1e] p-5 rounded-3xl border border-[#2d2556]">
                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2">Vaqt (soat)</p>
                            <p className="text-white text-3xl font-black">{totalHours.toFixed(1)}</p>
                        </div>
                        <div className="bg-[#0f0c1e] p-5 rounded-3xl border border-[#2d2556]">
                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2">Foyda</p>
                            <p className="text-emerald-400 text-xl font-black">{formatMoney(totalEarnings)}</p>
                        </div>
                    </div>

                    <h4 className="text-white font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Activity size={16} className="text-violet-400" /> Bugungi seanslar ro'yxati
                    </h4>
                    <div className="space-y-3">
                        {roomHistory.length === 0 ? (
                            <div className="py-20 text-center bg-[#0f0c1e]/30 rounded-3xl border border-dashed border-[#2d2556]">
                                <p className="text-slate-600 italic">Bugun hali seanslar bo'lmadi</p>
                            </div>
                        ) : (
                            roomHistory.map((h, i) => (
                                <div key={i} className="bg-[#0f0c1e]/50 border border-[#2d2556] rounded-[24px] p-5 flex items-center justify-between hover:border-violet-500/30 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-violet-900/20 flex items-center justify-center text-violet-400">
                                            <Users size={18} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{h.client}</p>
                                            <p className="text-slate-500 text-xs">{h.formattedTime || h.timeRange} ({h.hours} soat)</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-emerald-400 font-black">{formatMoney(h.total_price || h.totalPrice)}</p>
                                        {h.products?.length > 0 && (
                                            <p className="text-slate-600 text-[10px] uppercase font-bold">
                                                {h.products.length} ta mahsulot: {h.products.map(p => p.name).join(', ')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: CURRENT SESSION & PRODUCT ADDING */}
                <div className="w-full md:w-[400px] bg-[#0f0c1e]/50 p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h4 className="text-white font-black text-lg uppercase tracking-tighter">Joriy Seans</h4>
                            {isActive ? (
                                <LiveSessionStats room={room} />
                            ) : (
                                <p className="text-slate-500 text-xs font-bold">Hech qanday seans yo'q</p>
                            )}
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#1a1630] border border-[#2d2556] text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer">
                            <X size={20} />
                        </button>
                    </div>

                    {!isActive ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#1a1630]/20 rounded-[32px] border border-dashed border-violet-500/30">
                            <div className="w-20 h-20 rounded-full bg-[#1a1630] flex items-center justify-center mb-6 text-violet-500/50">
                                <DoorOpen size={40} />
                            </div>
                            <h3 className="text-white font-bold mb-2">Xona hozirda bo'sh</h3>
                            <p className="text-slate-500 text-xs px-10">Mahsulot qo'shish uchun avval xonaga "Start" berishingiz kerak</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                                <div className="space-y-2">
                                    {(room.orders || []).length === 0 ? (
                                        <div className="py-12 text-center bg-[#1a1630]/30 rounded-3xl border border-dashed border-[#2d2556]">
                                            <p className="text-slate-700 text-sm italic">Hali hech narsa olinmadi</p>
                                        </div>
                                    ) : (
                                        room.orders.map((o, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-[#1a1630] p-4 rounded-2xl border border-[#2d2556] animate-slideInRight">
                                                <span className="text-slate-300 text-sm font-bold">{o.name}</span>
                                                <span className="text-emerald-400 text-xs font-mono font-bold">{formatMoney(o.price)}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="relative">
                                {!showSklad ? (
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setShowSklad(true)}
                                            className="w-full py-5 rounded-[24px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-violet-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
                                        >
                                            <Plus size={18} /> Mahsulot qo'shish
                                        </button>

                                        <button
                                            onClick={() => { onStop(room.id); onClose(); }}
                                            className="w-full py-5 rounded-[24px] bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 cursor-pointer"
                                        >
                                            <Activity size={18} /> Seansni Tugatish
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-[#1a1630] rounded-[32px] p-6 border border-violet-500/50 shadow-2xl animate-slideUp">
                                        <div className="flex justify-between items-center mb-4">
                                            <h5 className="text-violet-400 font-black text-xs uppercase tracking-widest">SKLADDAGI NARSALAR</h5>
                                            <button onClick={() => setShowSklad(false)} className="text-slate-500 hover:text-white"><X size={16} /></button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                            {barProducts.map(p => {
                                                const outOfStock = Number(p.stock) <= 0;
                                                return (
                                                    <button
                                                        key={p.id}
                                                        disabled={outOfStock}
                                                        onClick={() => {
                                                            if (!outOfStock) onAddOrder(room, p);
                                                        }}
                                                        className={`p-3 rounded-2xl border transition-all text-xs text-left group relative ${outOfStock ? 'bg-red-900/10 border-red-500/30 text-red-500/50 cursor-not-allowed opacity-80' : 'bg-[#0f0c1e] border-[#2d2556] text-slate-400 cursor-pointer hover:text-white hover:border-violet-500'}`}
                                                    >
                                                        <div className="font-bold truncate">{p.name}</div>
                                                        <div className={`mt-1 font-mono ${outOfStock ? 'text-red-500/70' : 'text-emerald-500 text-[10px]'}`}>
                                                            {outOfStock ? 'QOLMADI' : formatMoney(p.price)}
                                                        </div>
                                                        {!outOfStock && <Plus size={12} className="absolute top-2 right-2 text-violet-500 opacity-0 group-hover:opacity-100 transition" />}
                                                    </button>
                                                )
                                            })}
                                            {barProducts.length === 0 && <p className="col-span-2 text-slate-700 text-[10px] text-center italic">Sklad bo'sh</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Quick Product Add Modal ─────────────────────────────────────────────────
function QuickProductAddModal({ room, onClose, onAddProduct, products }) {
    const [search, setSearch] = useState('')

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fadeIn">
            <div className="bg-[#1a1630] w-full h-full shadow-2xl overflow-hidden animate-scaleUp flex flex-col">
                <div className="p-8 border-b border-[#2d2556] flex justify-between items-center bg-[#1a1630]">
                    <div>
                        <h3 className="text-white font-black text-3xl uppercase tracking-tighter">Mahsulot Qo'shish</h3>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Xona: {room.name}</p>
                    </div>
                    <button onClick={onClose} className="w-14 h-14 rounded-full bg-[#0f0c1e] border border-[#2d2556] text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer">
                        <X size={28} />
                    </button>
                </div>

                <div className="p-8 md:p-12 bg-[#0f0c1e]/30 flex-1 overflow-hidden flex flex-col">
                    <div className="max-w-5xl mx-auto w-full mb-10">
                        <div className="relative">
                            <Search size={28} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                autoFocus
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Mahsulot nomini yozing..."
                                className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-full pl-22 pr-10 py-7 text-2xl font-black outline-none focus:border-violet-500 transition shadow-2xl placeholder:text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 overflow-y-auto pr-4 pb-12 custom-scrollbar">
                        {filtered.map(p => {
                            const outOfStock = Number(p.stock) <= 0;
                            return (
                                <button
                                    key={p.id}
                                    disabled={outOfStock}
                                    onClick={() => { if (!outOfStock) { onAddProduct(room, p); onClose(); } }}
                                    className={`group p-5 rounded-[28px] border transition-all text-left flex flex-col min-h-[170px] relative overflow-hidden shadow-lg ${outOfStock ? 'bg-[#1a1318] border-red-900/40 cursor-not-allowed opacity-70' : 'bg-[#1a1630] border-[#2d2556] hover:border-violet-500 hover:bg-violet-600/5 cursor-pointer hover:shadow-violet-900/40'}`}
                                >
                                    {!outOfStock && <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-violet-600/5 blur-3xl rounded-full group-hover:bg-violet-600/10 transition" />}

                                    <div className="relative z-10 flex-1">
                                        <div className={`w-11 h-11 rounded-xl bg-[#0f0c1e] border border-[#2d2556] flex items-center justify-center mb-3 shadow-inner transition ${outOfStock ? 'text-red-500/50' : 'text-slate-500 group-hover:text-violet-400'}`}>
                                            <Package size={22} />
                                        </div>
                                        <div className={`font-black text-lg truncate pr-2 transition leading-tight ${outOfStock ? 'text-slate-500' : 'text-white group-hover:text-violet-400'}`}>{p.name}</div>
                                        <div className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${outOfStock ? 'text-red-500' : 'text-slate-500'}`}>{outOfStock ? 'QOLMADI' : `${p.stock} ta qoldi`}</div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 mt-2 relative z-10">
                                        <div className={`font-black font-mono text-base ${outOfStock ? 'text-red-500/50' : 'text-emerald-400'}`}>{formatMoney(p.price)}</div>
                                        {!outOfStock && (
                                            <div className="bg-violet-600/20 text-violet-400 p-2 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition shadow-lg">
                                                <Plus size={20} />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                        {filtered.length === 0 && (
                            <div className="col-span-full py-32 text-center">
                                <Package size={64} className="mx-auto text-slate-800 mb-6" />
                                <h4 className="text-slate-600 text-xl font-bold">Mahsulot topilmadi</h4>
                                <p className="text-slate-700 mt-2">Boshqa nom bilan qidirib ko'ring yoki skladni tekshiring</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Stopwatch Hook ───────────────────────────────────────────────────────────
function useStopwatch(startTime) {
    const [seconds, setSeconds] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime()
            const start = new Date(startTime).getTime()
            setSeconds(Math.floor((now - start) / 1000))
        }, 1000)
        return () => clearInterval(interval)
    }, [startTime])
    return seconds
}

// ─── Active Room Card ─────────────────────────────────────────────────────────
function ActiveRoomCard({ room, onStop, onAddOrder, onOpenDetails }) {
    const isStopwatch = room.isStopwatch
    const timeLeft = useCountdown(room.secondsLeft)
    const elapsedSeconds = useStopwatch(room.startTimeActual)

    const displayTime = isStopwatch ? formatTime(elapsedSeconds) : (timeLeft <= 0 ? '-' : '') + formatTime(timeLeft)
    const isOverdue = !isStopwatch && timeLeft <= 0
    const isWarning = !isStopwatch && timeLeft > 0 && timeLeft <= 300

    const currentElapsed = isStopwatch ? elapsedSeconds : (room.totalSeconds - timeLeft)
    const hoursElapsed = currentElapsed / 3600
    const productTotal = (room.orders || []).reduce((sum, p) => sum + (Number(p.price) || 0), 0)
    const earnedMoney = (Number(room.price) * hoursElapsed) + productTotal

    return (
        <div
            onClick={(e) => {
                if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) onOpenDetails(room)
            }}
            className={`relative rounded-[24px] p-4 border transition-all duration-300 group cursor-pointer shadow-xl
                ${isOverdue ? 'bg-red-950/40 border-red-500' : isWarning ? 'bg-amber-950/30 border-amber-500/60' : 'bg-[#1a1630] border-[#2d2556] hover:border-violet-500/40'}`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-violet-900/30 flex items-center justify-center text-violet-400">
                            <Tv size={14} />
                        </div>
                        <span className="text-white font-black text-sm truncate tracking-tighter">{room.name}</span>
                    </div>
                    <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{room.client} · {formatMoney(room.price)}/s</p>
                </div>
                <div className="text-right">
                    <p className={`text-lg font-mono font-black tracking-tighter ${isOverdue ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                        {displayTime}
                    </p>
                    <p className="text-xs font-black text-white/90 font-mono">
                        {formatMoney(Math.round(earnedMoney))}
                    </p>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); onAddOrder(room) }}
                    className="p-2.5 rounded-xl bg-[#0f0c1e] border border-[#2d2556] text-slate-400 hover:text-white hover:border-violet-500 transition cursor-pointer"
                >
                    <Plus size={16} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onStop(room.id) }}
                    className="flex-1 py-2.5 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition duration-300 shadow-lg shadow-red-900/20 cursor-pointer"
                >
                    Tugatish
                </button>
            </div>
        </div>
    )
}

// ─── Free Room Card ───────────────────────────────────────────────────────────
function FreeRoomCard({ room, onStart, onDelete, onOpenDetails }) {
    return (
        <div
            onClick={() => onOpenDetails(room)}
            className="rounded-[24px] p-4 bg-[#1a1630] border border-[#2d2556] hover:border-emerald-500/50 transition-all duration-300 group cursor-pointer shadow-lg"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0f0c1e] border border-[#2d2556] flex items-center justify-center text-slate-500 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                        <DoorOpen size={16} />
                    </div>
                    <div>
                        <h4 className="text-white font-black text-base tracking-tighter">{room.name}</h4>
                        <p className="text-emerald-500/70 text-[9px] font-bold uppercase tracking-widest">Bo'sh</p>
                    </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDelete(room.id) }} className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:text-red-400 transition cursor-pointer">
                    <X size={14} />
                </button>
            </div>

            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                    <Users size={12} /> {room.capacity}
                </div>
                <div className="text-white font-black text-xs">{formatMoney(room.price)}</div>
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); onStart(room) }}
                className="w-full py-2.5 rounded-xl bg-[#0f0c1e] border border-[#2d2556] hover:bg-emerald-600 hover:text-white hover:border-emerald-500 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/40"
            >
                <Play size={12} /> Start
            </button>
        </div>
    )
}

// ─── Add Room Modal ───────────────────────────────────────────────────────────
function AddRoomModal({ onAdd, onClose }) {
    const [form, setForm] = useState({ name: '', type: 'Oddiy', price: '', capacity: '2' })
    const inputCls = "w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-[#1a1630] border border-[#2d2556] rounded-[32px] p-8 w-full max-w-sm shadow-2xl animate-scaleUp my-auto">
                <h3 className="text-white font-black text-xl mb-1 uppercase tracking-wider text-center">Yangi Xona</h3>
                <p className="text-slate-500 text-xs mb-8 text-center uppercase tracking-widest">Klub uchun yangi joy qo'shish</p>

                <div className="space-y-6 mb-8">
                    <div>
                        <label className="block text-slate-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] ml-1">Xona Nomi</label>
                        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VIP 1" className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] ml-1">Tur</label>
                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={`${inputCls} cursor-pointer`}>
                                <option value="Oddiy">Oddiy</option>
                                <option value="VIP">VIP</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] ml-1">Sig'im</label>
                            <input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} placeholder="2" className={inputCls} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] ml-1">Tarif (soatiga)</label>
                        <div className="relative">
                            <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="35000" className={inputCls} />
                            <span className="absolute right-4 top-2.5 text-[10px] text-slate-600 font-bold">SO'M</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-[#0f0c1e] border border-[#2d2556] text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition cursor-pointer">Bekor</button>
                    <button
                        onClick={() => onAdd(form)}
                        className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-violet-900/40 hover:scale-[1.02] active:scale-95 transition cursor-pointer"
                    >
                        Qo'shish
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Receipt Modal ──────────────────────────────────────────────────────────
function ReceiptModal({ receipt, onClose }) {
    if (!receipt) return null

    const roomOnlyTotal = Math.round(receipt.hours * receipt.roomPrice)

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn overflow-y-auto">
            <div className="bg-white text-[#0f0c1e] w-full max-w-[350px] rounded-[32px] p-8 shadow-2xl animate-scaleUp relative border border-white/20 my-auto text-left">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#0f0c1e] flex items-center justify-center mx-auto mb-4 text-white">
                        <Activity size={28} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">GaimPoint</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">To'lov Cheki</p>
                </div>

                <div className="border-y border-dashed border-slate-200 py-4 mb-4 space-y-1.5">
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-bold uppercase tracking-widest">Xona</span>
                        <span className="font-black text-[#0f0c1e]">{receipt.name}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-bold uppercase tracking-widest">Sana</span>
                        <span className="font-black text-[#0f0c1e]">{receipt.date}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-bold uppercase tracking-widest">Vaqt</span>
                        <span className="font-black text-[#0f0c1e]">{receipt.hours} soat</span>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-sm items-center">
                        <span className="font-bold text-slate-600">Xona xizmati:</span>
                        <span className="font-black text-[#0f0c1e] font-mono">{formatMoney(roomOnlyTotal)}</span>
                    </div>
                    {receipt.products?.length > 0 && (
                        <div className="pt-3 border-t border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mahsulotlar:</p>
                            {receipt.products.map((p, i) => (
                                <div key={i} className="flex justify-between text-sm py-0.5">
                                    <span className="text-slate-600 font-medium">{p.name}</span>
                                    <span className="font-bold text-[#0f0c1e] font-mono">{formatMoney(p.price)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 -mx-8 px-8 py-5 mb-8 border-y border-slate-100">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Jami To'lov</span>
                        <span className="text-2xl font-black text-[#0f0c1e]">{formatMoney(receipt.totalPrice)}</span>
                    </div>
                </div>

                <div className="text-center italic text-[10px] text-slate-400 mb-8 px-4">
                    Tashrifingiz uchun rahmat! <br /> Bizni tanlaganingizdan xursandmiz.
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-4 rounded-2xl bg-[#0f0c1e] text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-xl shadow-black/10 cursor-pointer"
                >
                    Chekni Yopish
                </button>
            </div>
        </div>
    )
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
function DeleteConfirmModal({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-[#1a1630] border border-[#2d2556] rounded-[32px] p-8 w-full max-w-sm shadow-2xl animate-scaleUp text-center my-auto">
                <div className="w-16 h-16 rounded-2xl bg-red-600/10 flex items-center justify-center mx-auto mb-6 text-red-500">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="text-white font-black text-xl mb-2 uppercase tracking-tight">O'chirishni Tasdiqlash</h3>
                <p className="text-slate-400 text-sm mb-8">Haqiqatan ham ushbu xonani o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi.</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-4 rounded-2xl bg-[#0f0c1e] border border-[#2d2556] text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition cursor-pointer">Bekor Qilish</button>
                    <button onClick={onConfirm} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-900/40 hover:bg-red-500 transition cursor-pointer">Ha, O'chirish</button>
                </div>
            </div>
        </div>
    )
}

// ─── Payment Modal ────────────────────────────────────────────────────────────
function PaymentModal({ entry, onConfirm, onCancel }) {
    const [cash, setCash] = useState(entry.totalPrice)
    const [card, setCard] = useState(0)

    const handleCashChange = (val) => {
        const n = Number(val) || 0
        setCash(n)
        setCard(Math.max(0, entry.totalPrice - n))
    }

    const handleCardChange = (val) => {
        const n = Number(val) || 0
        setCard(n)
        setCash(Math.max(0, entry.totalPrice - n))
    }

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fadeIn overflow-y-auto">
            <div className="bg-[#1a1630] border border-[#2d2556] rounded-[48px] p-6 md:p-10 w-full max-w-md shadow-2xl animate-scaleUp overflow-hidden relative my-auto">
                <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/10 blur-3xl rounded-full -mr-20 -mt-20"></div>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-900/40">
                        <Wallet size={32} className="text-white" />
                    </div>
                    <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-1">To'lovni Qabul Qilish</h3>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{entry.name} · {entry.client}</p>
                </div>

                <div className="bg-[#0f0c1e] rounded-[32px] border border-[#2d2556] p-5 mb-6">
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#2d2556]">
                        <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Sarflangan Vaqt</span>
                        <span className="text-white font-black text-sm">{entry.formattedTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Umumiy Summa</span>
                        <span className="text-emerald-400 text-xl font-black">{formatMoney(entry.totalPrice)}</span>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Naqd To'lov (So'm)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={cash}
                                onChange={e => handleCashChange(e.target.value)}
                                className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-2xl px-5 py-3.5 text-lg font-black outline-none focus:border-emerald-500 transition shadow-inner"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-500/30">
                                <DollarSign size={18} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Karta Orqali (So'm)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={card}
                                onChange={e => handleCardChange(e.target.value)}
                                className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-2xl px-5 py-3.5 text-lg font-black outline-none focus:border-blue-500 transition shadow-inner"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-500/30">
                                <CreditCard size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-5 rounded-[24px] bg-[#0f0c1e] border border-[#2d2556] text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition cursor-pointer"
                    >
                        Bekor Qilish
                    </button>
                    <button
                        onClick={() => onConfirm(cash, card)}
                        className="flex-[2] py-5 rounded-[24px] bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition cursor-pointer"
                    >
                        To'lovni Yakunlash
                    </button>
                </div>
            </div>
        </div>
    )
}



import { supabase } from '../lib/supabase'
import { Wallet, CreditCard } from 'lucide-react'

// ─── Dashboard ───────────────────────────────────────────────────────────────
export default function Dashboard({ freeRooms, setFreeRooms, activeRooms, setActiveRooms }) {
    const [detailsRoom, setDetailsRoom] = useState(null)
    const [showAddRoom, setShowAddRoom] = useState(false)
    const [showReceipt, setShowReceipt] = useState(null)
    const [deleteRoomId, setDeleteRoomId] = useState(null)
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('ps_detailed_history') || '[]'))
    const [activeTab, setActiveTab] = useState('free')
    const [quickProductRoom, setQuickProductRoom] = useState(null)
    const [barProducts, setBarProducts] = useState([])
    const [paymentEntry, setPaymentEntry] = useState(null)

    useEffect(() => {
        localStorage.setItem('ps_detailed_history', JSON.stringify(history))
    }, [history])

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        const { data, error } = await supabase.from('products').select('*').order('name')
        if (!error && data) setBarProducts(data)
    }

    const handleAddRoom = async (room) => {
        if (!room.name || !room.price) return

        try {
            const { data, error } = await supabase
                .from('rooms')
                .insert([{
                    name: room.name,
                    type: room.type,
                    price: Number(room.price),
                    capacity: Number(room.capacity)
                }])
                .select()

            if (error) throw error

            if (data) {
                setFreeRooms(prev => [...prev, { ...data[0], orders: [] }])
                setShowAddRoom(false)
            }
        } catch (err) {
            alert("Xona qo'shishda xatolik: " + err.message)
        }
    }

    const handleDeleteRoom = (id) => {
        setDeleteRoomId(id)
    }

    const confirmDelete = async () => {
        if (deleteRoomId) {
            try {
                const { error } = await supabase
                    .from('rooms')
                    .delete()
                    .eq('id', deleteRoomId)

                if (error) throw error

                setFreeRooms(prev => prev.filter(r => String(r.id) !== String(deleteRoomId)))
                setDeleteRoomId(null)
            } catch (err) {
                alert("Xonani o'chirishda xatolik: " + err.message)
            }
        }
    }

    const handleStart = (room) => {
        const now = new Date()
        setActiveRooms(prev => [...prev, {
            ...room,
            client: "Mijoz",
            startTimeActual: now.toISOString(),
            isStopwatch: true,
            orders: []
        }])
        setFreeRooms(prev => prev.filter(r => String(r.id) !== String(room.id)))
    }

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .order('created_at', { ascending: false })
        if (!error && data) {
            setHistory(prev => {
                const merged = [...data]
                prev.forEach(local => {
                    const isDuplicate = data.some(remote =>
                        remote.id === local.id ||
                        (remote.created_at === local.created_at && (remote.room_name || remote.name) === (local.room_name || local.name))
                    )
                    if (!isDuplicate) merged.push(local)
                })
                return merged.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
            })
        }
    }

    const handleStop = async (id) => {
        const stopped = activeRooms.find(r => String(r.id) === String(id))
        if (!stopped) return

        const now = new Date()
        const start = new Date(stopped.startTimeActual).getTime()
        const hours = (now.getTime() - start) / (1000 * 3600)
        const itemsTotal = (stopped.orders || []).reduce((sum, p) => sum + Number(p.price), 0)
        const preciseTotal = Math.round(hours * Number(stopped.price)) + itemsTotal
        const roundedTotal = Math.round(preciseTotal / 1000) * 1000

        const entry = {
            roomId: String(stopped.id),
            name: stopped.name,
            client: stopped.client,
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
            totalPrice: roundedTotal,
            total_price: roundedTotal,
            precisePrice: preciseTotal,
            precise_price: preciseTotal,
            hours: Number(hours.toFixed(2)),
            formattedTime: formatTime(Math.floor((now.getTime() - start) / 1000)),
            products: stopped.orders || [],
            roomPrice: stopped.price,
            room_price: stopped.price
        }

        setPaymentEntry({ entry, stoppedId: id })
    }

    const completePayment = async (cash, card) => {
        if (!paymentEntry) return
        const { entry, stoppedId } = paymentEntry

        const finalEntry = { ...entry, cash, card, created_at: new Date().toISOString() }

        // Optimistic update: add to local history immediately
        setHistory(prev => [finalEntry, ...prev])

        // Prepare data for Supabase (only use snake_case columns and valid fields)
        const dbEntry = {
            room_id: finalEntry.roomId,
            room_name: finalEntry.name,
            client: finalEntry.client,
            date: finalEntry.date,
            total_price: finalEntry.total_price,
            hours: finalEntry.hours,
            products: finalEntry.products,
            cash: finalEntry.cash,
            card: finalEntry.card,
            created_at: finalEntry.created_at
        }

        try {
            const { error } = await supabase.from('history').insert([dbEntry])
            if (error) throw error
            // fetchHistory() // Let local state handle it first, then sync
        } catch (err) {
            console.error("History save error:", err)
            alert("Ma'lumotlarni saqlashda xatolik yuz berdi: " + (err.message || "Noma'lum xato"))
        }

        const stopped = activeRooms.find(r => String(r.id) === String(stoppedId))
        if (stopped) {
            setFreeRooms(prev => [...prev, { id: stopped.id, name: stopped.name, price: stopped.price, orders: [] }])
        }
        setActiveRooms(prev => prev.filter(r => String(r.id) !== String(stoppedId)))

        setPaymentEntry(null)
        setShowReceipt(finalEntry)
    }

    const handleAddProduct = async (room, product) => {
        if (!product) {
            setQuickProductRoom(room)
            return
        }

        setActiveRooms(prev => prev.map(r =>
            (String(r.id) === String(room.id) || r.name.toLowerCase() === room.name.toLowerCase())
                ? { ...r, orders: [...(r.orders || []), product] }
                : r
        ))

        try {
            const { error } = await supabase
                .from('products')
                .update({ stock: Math.max(0, product.stock - 1) })
                .eq('id', product.id)

            if (error) throw error

            setBarProducts(prev => prev.map(p =>
                p.id === product.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p
            ))
        } catch (err) {
            console.error("Skladni yangilashda xatolik:", err)
        }
    }

    return (
        <div className="p-8 min-h-screen animate-fadeIn max-w-7xl mx-auto">
            {showAddRoom && <AddRoomModal onAdd={handleAddRoom} onClose={() => setShowAddRoom(false)} />}
            {showReceipt && <ReceiptModal receipt={showReceipt} onClose={() => setShowReceipt(null)} />}
            {deleteRoomId && <DeleteConfirmModal onConfirm={confirmDelete} onCancel={() => setDeleteRoomId(null)} />}
            {paymentEntry && (
                <PaymentModal
                    entry={paymentEntry.entry}
                    onConfirm={completePayment}
                    onCancel={() => setPaymentEntry(null)}
                />
            )}
            {quickProductRoom && (
                <QuickProductAddModal
                    room={activeRooms.find(r => String(r.id) === String(quickProductRoom.id)) || quickProductRoom}
                    onClose={() => setQuickProductRoom(null)}
                    onAddProduct={handleAddProduct}
                    products={barProducts}
                />
            )}

            {detailsRoom && (
                <RoomDetailsModal
                    room={activeRooms.find(r =>
                        (r.id && detailsRoom.id && String(r.id) === String(detailsRoom.id)) ||
                        (r.name.toLowerCase() === detailsRoom.name.toLowerCase())
                    ) || detailsRoom}
                    history={history}
                    barProducts={barProducts}
                    isActive={activeRooms.some(r =>
                        (r.id && detailsRoom.id && String(r.id) === String(detailsRoom.id)) ||
                        (r.name.toLowerCase() === detailsRoom.name.toLowerCase())
                    )}
                    onClose={() => setDetailsRoom(null)}
                    onAddOrder={handleAddProduct}
                    onStop={handleStop}
                />
            )}

            <div className="flex justify-between items-center mb-10 text-center md:text-left">
                <div>
                    <h1 className="text-white text-3xl font-black uppercase tracking-tighter">Monitoring</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">GaimPoint Dashboard</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-[#1a1630] border border-[#2d2556] px-6 py-3 rounded-2xl flex items-center gap-3">
                        <Activity size={20} className="text-violet-500" />
                        <div>
                            <p className="text-white font-black leading-tight">{activeRooms.length}</p>
                            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Faol</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddRoom(true)}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-violet-900/20 hover:from-violet-500 hover:to-indigo-500 transition cursor-pointer"
                    >
                        <Plus size={18} /> Xona qo'shish
                    </button>
                </div>
            </div>

            <div className="flex justify-center mb-12">
                <div className="bg-[#1a1630] border border-[#2d2556] p-2 rounded-[32px] flex gap-3 shadow-2xl">
                    <button
                        onClick={() => setActiveTab('free')}
                        className={`flex items-center gap-3 px-10 py-5 rounded-[24px] text-sm font-black uppercase tracking-widest transition-all
                            ${activeTab === 'free' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <DoorOpen size={20} /> Bo'sh Xonalar
                        <span className="ml-2 bg-black/30 px-3 py-1 rounded-full text-[10px]">{freeRooms.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex items-center gap-3 px-10 py-5 rounded-[24px] text-sm font-black uppercase tracking-widest transition-all
                            ${activeTab === 'active' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Activity size={20} /> Faol Seanslar
                        <span className="ml-2 bg-black/30 px-3 py-1 rounded-full text-[10px]">{activeRooms.length}</span>
                    </button>
                </div>
            </div>

            {activeTab === 'free' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slideUp">
                    {freeRooms.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-[#1a1630]/40 border-2 border-dashed border-[#2d2556] rounded-[60px]">
                            <DoorOpen size={60} className="mx-auto text-slate-800 mb-6" />
                            <h3 className="text-white text-xl font-bold">Barcha xonalar band</h3>
                        </div>
                    ) : (
                        freeRooms.map(room => (
                            <FreeRoomCard key={room.id} room={room} onStart={handleStart} onDelete={handleDeleteRoom} onOpenDetails={setDetailsRoom} />
                        ))
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideUp">
                    {activeRooms.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-[#1a1630]/40 border-2 border-dashed border-[#2d2556] rounded-[60px]">
                            <Activity size={60} className="mx-auto text-slate-800 mb-6" />
                            <h3 className="text-white text-xl font-bold">Faol seanslar mavjud emas</h3>
                        </div>
                    ) : (
                        activeRooms.map(room => (
                            <ActiveRoomCard key={room.id} room={room} onStop={handleStop} onAddOrder={handleAddProduct} onOpenDetails={setDetailsRoom} />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
