import { useState, useEffect } from 'react'
import {
    Clock, AlertTriangle, Play, DoorOpen, Tv, Users,
    Activity, Plus, X, Settings2
} from 'lucide-react'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(seconds) {
    const abs = Math.abs(seconds)
    const m = Math.floor(abs / 60)
    const s = abs % 60
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

// ─── Room Details Modal (Room Control Center) ───────────────────────────────
function RoomDetailsModal({ room, history, onClose, onAddOrder, isActive }) {
    const today = new Date().toLocaleDateString()
    const roomHistory = history.filter(h => h.roomId === room.id && h.date === today)

    const totalEarnings = roomHistory.reduce((sum, h) => sum + h.totalPrice, 0)
    const totalHours = roomHistory.reduce((sum, h) => sum + h.hours, 0)

    // Sklad mahsulotlari
    const barProducts = JSON.parse(localStorage.getItem('ps_bar_products') || '[]')
    const [showSklad, setShowSklad] = useState(false)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
            <div className="bg-[#1a1630] border border-[#2d2556] rounded-[40px] w-full max-w-5xl shadow-2xl overflow-hidden animate-scaleUp flex flex-col md:flex-row h-[85vh]">

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
                                            <p className="text-slate-500 text-xs">{h.timeRange} ({h.hours} soat)</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-emerald-400 font-black">{formatMoney(h.totalPrice)}</p>
                                        {h.products?.length > 0 && <p className="text-slate-600 text-[10px] uppercase font-bold">{h.products.length} ta mahsulot</p>}
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
                            <h4 className="text-white font-black text-lg uppercase tracking-tighter">Olingan Narsalar</h4>
                            <p className="text-slate-500 text-xs font-bold">Joriy seans hisoboti</p>
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
                                    <button
                                        onClick={() => setShowSklad(true)}
                                        className="w-full py-5 rounded-[24px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-violet-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
                                    >
                                        <Plus size={18} /> Mahsulot qo'shish
                                    </button>
                                ) : (
                                    <div className="bg-[#1a1630] rounded-[32px] p-6 border border-violet-500/50 shadow-2xl animate-slideUp">
                                        <div className="flex justify-between items-center mb-4">
                                            <h5 className="text-violet-400 font-black text-xs uppercase tracking-widest">SKLADDAGI NARSALAR</h5>
                                            <button onClick={() => setShowSklad(false)} className="text-slate-500 hover:text-white"><X size={16} /></button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                            {barProducts.map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => {
                                                        onAddOrder(room, p);
                                                    }}
                                                    className="p-3 rounded-2xl bg-[#0f0c1e] border border-[#2d2556] text-slate-400 hover:text-white hover:border-violet-500 transition-all text-xs text-left group cursor-pointer relative"
                                                >
                                                    <div className="font-bold truncate">{p.name}</div>
                                                    <div className="text-emerald-500 text-[10px] font-mono">{formatMoney(p.price)}</div>
                                                    <Plus size={12} className="absolute top-2 right-2 text-violet-500 opacity-0 group-hover:opacity-100 transition" />
                                                </button>
                                            ))}
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
            className={`relative rounded-3xl p-5 border transition-all duration-300 group cursor-pointer shadow-xl
                ${isOverdue ? 'bg-red-950/40 border-red-500' : isWarning ? 'bg-amber-950/30 border-amber-500/60' : 'bg-[#1a1630] border-[#2d2556] hover:border-violet-500/40'}`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-xl bg-violet-900/30 flex items-center justify-center text-violet-400">
                            <Tv size={16} />
                        </div>
                        <span className="text-white font-black text-base truncate tracking-tighter">{room.name}</span>
                    </div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{room.client} · {formatMoney(room.price)}/soat</p>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-mono font-black tracking-tighter ${isOverdue ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                        {displayTime}
                    </p>
                    <p className="text-sm font-black text-white/90 font-mono">
                        {formatMoney(Math.round(earnedMoney))}
                    </p>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); onAddOrder(room) }}
                    className="p-3 rounded-2xl bg-[#0f0c1e] border border-[#2d2556] text-slate-400 hover:text-white hover:border-violet-500 transition cursor-pointer"
                >
                    <Plus size={18} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onStop(room.id) }}
                    className="flex-1 py-3 rounded-2xl bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white text-xs font-black uppercase tracking-widest transition duration-300 shadow-lg shadow-red-900/20 cursor-pointer"
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
            className="rounded-3xl p-6 bg-[#1a1630] border border-[#2d2556] hover:border-emerald-500/50 transition-all duration-300 group cursor-pointer shadow-lg"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#0f0c1e] border border-[#2d2556] flex items-center justify-center text-slate-500 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                        <DoorOpen size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-black text-lg tracking-tighter">{room.name}</h4>
                        <p className="text-emerald-500/70 text-[10px] font-bold uppercase tracking-widest">Bo'sh</p>
                    </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDelete(room.id) }} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-red-400 transition cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                    <Users size={14} /> {room.capacity}
                </div>
                <div className="text-white font-black text-sm">{formatMoney(room.price)}</div>
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); onStart(room) }}
                className="w-full py-4 rounded-[20px] bg-[#0f0c1e] border border-[#2d2556] hover:bg-emerald-600 hover:text-white hover:border-emerald-500 text-emerald-500 text-xs font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/40"
            >
                <Play size={14} /> Start
            </button>
        </div>
    )
}

// ─── Add Room Modal ───────────────────────────────────────────────────────────
function AddRoomModal({ onAdd, onClose }) {
    const [form, setForm] = useState({ name: '', type: 'Oddiy', price: '', capacity: '2' })
    const inputCls = "w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#1a1630] border border-[#2d2556] rounded-[32px] p-8 w-full max-w-sm shadow-2xl animate-scaleUp">
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-white text-[#0f0c1e] w-full max-w-[350px] rounded-[32px] p-8 shadow-2xl animate-scaleUp overflow-hidden relative border border-white/20">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600"></div>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#0f0c1e] flex items-center justify-center mx-auto mb-4 text-white">
                        <Activity size={28} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">PS CLUB</h2>
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


// ─── Dashboard ───────────────────────────────────────────────────────────────
export default function Dashboard({ freeRooms, setFreeRooms, activeRooms, setActiveRooms }) {
    const [detailsRoom, setDetailsRoom] = useState(null)
    const [showAddRoom, setShowAddRoom] = useState(false)
    const [showReceipt, setShowReceipt] = useState(null)
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('ps_detailed_history') || '[]'))
    const [activeTab, setActiveTab] = useState('free')

    useEffect(() => {
        localStorage.setItem('ps_detailed_history', JSON.stringify(history))
    }, [history])

    const handleAddRoom = (room) => {
        if (!room.name || !room.price) return
        setFreeRooms(prev => [...prev, { ...room, id: Date.now(), orders: [] }])
        setShowAddRoom(false)
    }

    const handleDeleteRoom = (id) => {
        setFreeRooms(prev => prev.filter(r => String(r.id) !== String(id)))
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

    const handleStop = (id) => {
        const stopped = activeRooms.find(r => String(r.id) === String(id))
        if (!stopped) return

        const now = new Date()
        const start = new Date(stopped.startTimeActual).getTime()
        const hours = (now.getTime() - start) / (1000 * 3600)
        const itemsTotal = (stopped.orders || []).reduce((sum, p) => sum + Number(p.price), 0)
        const total = Math.round(hours * Number(stopped.price)) + itemsTotal

        const entry = {
            id: Date.now(),
            roomId: stopped.id,
            name: stopped.name,
            client: stopped.client,
            date: now.toLocaleDateString(),
            totalPrice: total,
            hours: Number(hours.toFixed(2)),
            products: stopped.orders || [],
            roomPrice: stopped.price // To'lov cheki uchun kerak
        }

        setHistory(prev => [entry, ...prev])
        setFreeRooms(prev => [...prev, { id: stopped.id, name: stopped.name, price: stopped.price, orders: [] }])
        setActiveRooms(prev => prev.filter(r => String(r.id) !== String(id)))

        setShowReceipt(entry)
    }

    const handleAddProduct = (room, product) => {
        if (!product) {
            setDetailsRoom(room)
            return
        }

        setActiveRooms(prev => prev.map(r =>
            (String(r.id) === String(room.id) || r.name.toLowerCase() === room.name.toLowerCase())
                ? { ...r, orders: [...(r.orders || []), product] }
                : r
        ))

        const bar = JSON.parse(localStorage.getItem('ps_bar_products') || '[]')
        localStorage.setItem('ps_bar_products', JSON.stringify(bar.map(p =>
            p.id === product.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p
        )))
    }

    return (
        <div className="p-8 min-h-screen animate-fadeIn max-w-7xl mx-auto">
            {showAddRoom && <AddRoomModal onAdd={handleAddRoom} onClose={() => setShowAddRoom(false)} />}
            {showReceipt && <ReceiptModal receipt={showReceipt} onClose={() => setShowReceipt(null)} />}

            {detailsRoom && (
                <RoomDetailsModal
                    room={activeRooms.find(r =>
                        (r.id && detailsRoom.id && String(r.id) === String(detailsRoom.id)) ||
                        (r.name.toLowerCase() === detailsRoom.name.toLowerCase())
                    ) || detailsRoom}
                    history={history}
                    isActive={activeRooms.some(r =>
                        (r.id && detailsRoom.id && String(r.id) === String(detailsRoom.id)) ||
                        (r.name.toLowerCase() === detailsRoom.name.toLowerCase())
                    )}
                    onClose={() => setDetailsRoom(null)}
                    onAddOrder={handleAddProduct}
                />
            )}

            <div className="flex justify-between items-center mb-10 text-center md:text-left">
                <div>
                    <h1 className="text-white text-3xl font-black uppercase tracking-tighter">Monitoring</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">PlayStation Club Dashboard</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideUp">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto animate-slideUp">
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
