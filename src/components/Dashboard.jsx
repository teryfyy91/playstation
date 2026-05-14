import { useState, useEffect, useCallback } from 'react'
import { Clock, AlertTriangle, Play, DoorOpen, Tv, Users, Activity } from 'lucide-react'

// ─── Initial data ────────────────────────────────────────────────────────────
const INITIAL_FREE_ROOMS = [
    { id: 1, name: 'VIP 1', type: 'VIP', price: 15000, capacity: 4 },
    { id: 2, name: 'VIP 2', type: 'VIP', price: 15000, capacity: 4 },
    { id: 3, name: 'Zal 4', type: 'Oddiy', price: 8000, capacity: 2 },
    { id: 4, name: 'Zal 5', type: 'Oddiy', price: 8000, capacity: 2 },
    { id: 5, name: 'Zal 6', type: 'Oddiy', price: 8000, capacity: 2 },
]

function formatTime(seconds) {
    if (seconds <= 0) return '00:00'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatMoney(num) {
    return num.toLocaleString('uz-UZ') + " so'm"
}

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(initialSeconds) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return timeLeft
}

// ─── Active Room Card ─────────────────────────────────────────────────────────
function ActiveRoomCard({ room, onStop }) {
    const timeLeft = useCountdown(room.secondsLeft)
    const isOverdue = timeLeft <= 0
    const isWarning = timeLeft > 0 && timeLeft <= 300

    return (
        <div
            className={`relative rounded-2xl p-5 border transition-all duration-300
        ${isOverdue
                    ? 'bg-red-950/40 border-red-500 overdue-card'
                    : isWarning
                        ? 'bg-amber-950/30 border-amber-500/60'
                        : 'bg-[#1a1630] border-[#2d2556]'
                }`}
        >
            {/* Overdue Badge */}
            {isOverdue && (
                <div className="absolute -top-3 left-4 flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    <AlertTriangle size={12} />
                    Vaqt o'tdi!
                </div>
            )}

            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Tv size={16} className={isOverdue ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-violet-400'} />
                        <span className="text-white font-bold text-base">{room.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
              ${room.type === 'VIP' ? 'bg-violet-900/60 text-violet-300' : 'bg-indigo-900/60 text-indigo-300'}`}>
                            {room.type}
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs">{room.client} · {formatMoney(room.price)}/soat</p>
                </div>

                <div className={`text-right`}>
                    <p className="text-xs text-slate-500 mb-1">Qolgan vaqt</p>
                    <p className={`text-2xl font-mono font-bold
            ${isOverdue ? 'text-red-400' : isWarning ? 'text-amber-400 warn-blink' : 'text-emerald-400'}`}>
                        {isOverdue ? '-' + formatTime(Math.abs(timeLeft)) : formatTime(timeLeft)}
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#0f0c1e] rounded-full h-1.5 mb-4">
                <div
                    className={`h-1.5 rounded-full transition-all duration-1000
            ${isOverdue ? 'w-full bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: isOverdue ? '100%' : `${(1 - timeLeft / room.totalSeconds) * 100}%` }}
                />
            </div>

            <button
                onClick={() => onStop(room.id)}
                className="w-full py-2 rounded-xl bg-[#2d2556] hover:bg-red-900/50 text-slate-300 hover:text-red-300 text-sm font-medium transition-all duration-200 border border-[#3d3470] hover:border-red-700 cursor-pointer"
            >
                Tugatish
            </button>
        </div>
    )
}

// ─── Free Room Card ───────────────────────────────────────────────────────────
function FreeRoomCard({ room, onStart }) {
    return (
        <div className="rounded-2xl p-5 bg-[#1a1630] border border-[#2d2556] hover:border-violet-500/50 transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
                <DoorOpen size={16} className="text-violet-400" />
                <span className="text-white font-bold text-base">{room.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
          ${room.type === 'VIP' ? 'bg-violet-900/60 text-violet-300' : 'bg-indigo-900/60 text-indigo-300'}`}>
                    {room.type}
                </span>
            </div>

            <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Users size={12} /> {room.capacity} o'rindiq
                </span>
                <span className="text-violet-300 text-sm font-semibold">{formatMoney(room.price)}/soat</span>
            </div>

            <div className="flex items-center gap-1 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                <span className="text-emerald-400 text-xs font-medium">Bo'sh</span>
            </div>

            <button
                onClick={() => onStart(room)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-900/40 flex items-center justify-center gap-2 cursor-pointer"
            >
                <Play size={14} />
                Start – 1 soat
            </button>
        </div>
    )
}

// ─── Start Room Modal ─────────────────────────────────────────────────────────
function StartModal({ room, onConfirm, onClose }) {
    const [client, setClient] = useState('')
    const [hours, setHours] = useState(1)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#1a1630] border border-[#2d2556] rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-violet-900/30">
                <h3 className="text-white font-bold text-lg mb-1">Xonani boshlash</h3>
                <p className="text-violet-300 text-sm mb-5">{room.name} · {formatMoney(room.price)}/soat</p>

                <label className="block text-slate-400 text-xs mb-1">Mijoz ismi (ixtiyoriy)</label>
                <input
                    value={client}
                    onChange={e => setClient(e.target.value)}
                    placeholder="Ism kiriting..."
                    className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm mb-4 outline-none focus:border-violet-500 transition"
                />

                <label className="block text-slate-400 text-xs mb-1">Muddat</label>
                <div className="flex gap-2 mb-6">
                    {[1, 2, 3].map(h => (
                        <button
                            key={h}
                            onClick={() => setHours(h)}
                            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition cursor-pointer
                ${hours === h
                                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/40'
                                    : 'bg-[#2d2556] text-slate-300 hover:bg-[#3d3470]'}`}
                        >
                            {h} soat
                        </button>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-[#2d2556] text-slate-300 text-sm font-medium hover:bg-[#3d3470] transition cursor-pointer">
                        Bekor
                    </button>
                    <button
                        onClick={() => onConfirm(client, hours)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-900/40 cursor-pointer"
                    >
                        Boshlash
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function Dashboard() {
    const [freeRooms, setFreeRooms] = useState(INITIAL_FREE_ROOMS)
    const [activeRooms, setActiveRooms] = useState([
        { id: 10, name: 'VIP 3', type: 'VIP', price: 15000, client: 'Jasur', secondsLeft: 420, totalSeconds: 3600 },
        { id: 11, name: 'Zal 1', type: 'Oddiy', price: 8000, client: 'Mehmet', secondsLeft: -180, totalSeconds: 3600 },
        { id: 12, name: 'Zal 2', type: 'Oddiy', price: 8000, client: 'Sherzod', secondsLeft: 1540, totalSeconds: 7200 },
        { id: 13, name: 'Zal 3', type: 'Oddiy', price: 8000, client: 'Bekzod', secondsLeft: 280, totalSeconds: 3600 },
    ])
    const [modalRoom, setModalRoom] = useState(null)

    const handleStart = (room) => setModalRoom(room)

    const handleConfirm = (client, hours) => {
        const secs = hours * 3600
        setActiveRooms(prev => [...prev, {
            id: modalRoom.id,
            name: modalRoom.name,
            type: modalRoom.type,
            price: modalRoom.price,
            client: client || 'Noma\'lum',
            secondsLeft: secs,
            totalSeconds: secs,
        }])
        setFreeRooms(prev => prev.filter(r => r.id !== modalRoom.id))
        setModalRoom(null)
    }

    const handleStop = (id) => {
        const stopped = activeRooms.find(r => r.id === id)
        if (stopped) {
            setFreeRooms(prev => [...prev, {
                id: stopped.id,
                name: stopped.name,
                type: stopped.type,
                price: stopped.price,
                capacity: stopped.type === 'VIP' ? 4 : 2,
            }])
            setActiveRooms(prev => prev.filter(r => r.id !== id))
        }
    }

    const overdueCount = activeRooms.filter(r => r.secondsLeft <= 0).length
    const warnCount = activeRooms.filter(r => r.secondsLeft > 0 && r.secondsLeft <= 300).length

    return (
        <div className="p-6 min-h-screen">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-white text-2xl font-bold">Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-1">PlayStation Klub – Boshqaruv paneli</p>
                </div>
                <div className="flex items-center gap-3">
                    {overdueCount > 0 && (
                        <div className="flex items-center gap-2 bg-red-900/40 border border-red-600/50 text-red-400 text-sm font-semibold px-4 py-2 rounded-xl">
                            <AlertTriangle size={15} />
                            {overdueCount} xona vaqti o'tdi
                        </div>
                    )}
                    {warnCount > 0 && (
                        <div className="flex items-center gap-2 bg-amber-900/40 border border-amber-600/50 text-amber-400 text-sm font-semibold px-4 py-2 rounded-xl warn-blink">
                            <Clock size={15} />
                            {warnCount} xona tugayapti
                        </div>
                    )}
                    <div className="flex items-center gap-2 bg-[#1a1630] border border-[#2d2556] text-slate-400 text-sm px-4 py-2 rounded-xl">
                        <Activity size={15} className="text-emerald-400" />
                        {activeRooms.length} faol
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Jami xonalar', value: freeRooms.length + activeRooms.length, color: 'from-violet-600 to-indigo-600' },
                    { label: 'Bo\'sh xonalar', value: freeRooms.length, color: 'from-emerald-600 to-teal-600' },
                    { label: 'Band xonalar', value: activeRooms.length, color: 'from-rose-600 to-pink-600' },
                ].map(stat => (
                    <div key={stat.label} className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-5 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                            <span className="text-white text-xl font-bold">{stat.value}</span>
                        </div>
                        <p className="text-slate-400 text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Free Rooms */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <DoorOpen size={18} className="text-emerald-400" />
                        <h2 className="text-white font-bold text-lg">Bo'sh Xonalar</h2>
                        <span className="ml-auto bg-emerald-900/40 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-700/40">
                            {freeRooms.length} ta
                        </span>
                    </div>
                    {freeRooms.length === 0 ? (
                        <div className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-8 text-center">
                            <p className="text-slate-500 text-sm">Hamma xonalar band</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {freeRooms.map(room => (
                                <FreeRoomCard key={room.id} room={room} onStart={handleStart} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Active Rooms */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Play size={18} className="text-violet-400" />
                        <h2 className="text-white font-bold text-lg">Band Xonalar</h2>
                        <span className="ml-auto bg-violet-900/40 text-violet-400 text-xs font-bold px-2.5 py-1 rounded-full border border-violet-700/40">
                            {activeRooms.length} ta
                        </span>
                    </div>
                    {activeRooms.length === 0 ? (
                        <div className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-8 text-center">
                            <p className="text-slate-500 text-sm">Hech qanday xona ishlamayapti</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeRooms.map(room => (
                                <ActiveRoomCard key={room.id} room={room} onStop={handleStop} />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Modal */}
            {modalRoom && (
                <StartModal room={modalRoom} onConfirm={handleConfirm} onClose={() => setModalRoom(null)} />
            )}
        </div>
    )
}
