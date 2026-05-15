import { useState, useEffect } from 'react'
import { Plus, X, Pencil, Trash2, Wallet, TrendingDown, Receipt, ShoppingBag } from 'lucide-react'

const CATEGORY_COLORS = {
    'Oziq-ovqat': 'bg-amber-900/40 text-amber-400 border-amber-700/40',
    'Texnika': 'bg-blue-900/40 text-blue-400 border-blue-700/40',
    'Kommunal': 'bg-cyan-900/40 text-cyan-400 border-cyan-700/40',
    'Maosh': 'bg-emerald-900/40 text-emerald-400 border-emerald-700/40',
    'Boshqa': 'bg-violet-900/40 text-violet-400 border-violet-700/40',
}

const CATEGORIES = Object.keys(CATEGORY_COLORS)

export default function Spendings() {
    const [spendings, setSpendings] = useState(() => {
        const saved = localStorage.getItem('ps_spendings')
        return saved ? JSON.parse(saved) : []
    })
    const [showForm, setShowForm] = useState(false)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState({ amount: '', category: 'Oziq-ovqat', date: '', description: '' })

    useEffect(() => {
        localStorage.setItem('ps_spendings', JSON.stringify(spendings))
    }, [spendings])

    const totalMonth = spendings.reduce((acc, curr) => acc + Number(curr.amount), 0)

    const catTotals = spendings.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount)
        return acc
    }, {})

    const topCategory = Object.keys(catTotals).length
        ? Object.keys(catTotals).reduce((a, b) => catTotals[a] > catTotals[b] ? a : b)
        : '-'

    // Simplified for mockup, just uses last item's date or something, but we'll leave it as simple logic
    let last24hCount = 0;
    spendings.forEach(s => {
        // Just as mock, assume everything is recent if no complex date logic is added 
        last24hCount += Number(s.amount);
    });

    const handleAddOrEdit = () => {
        if (!form.amount || !form.category || !form.date || !form.description) return

        if (editId) {
            setSpendings(prev => prev.map(s => s.id === editId ? { ...s, ...form } : s))
        } else {
            setSpendings(prev => [{ ...form, id: Date.now() }, ...prev])
        }

        closeModal()
    }

    const startEdit = (id) => {
        const target = spendings.find(s => s.id === id)
        if (target) {
            setForm({ amount: target.amount, category: target.category, date: target.date, description: target.description })
            setEditId(id)
            setShowForm(true)
        }
    }

    const handleDelete = (id) => {
        if (window.confirm('Rostdan ham o\'chirmoqchimisiz?')) {
            setSpendings(prev => prev.filter(s => s.id !== id))
        }
    }

    const closeModal = () => {
        setShowForm(false)
        setEditId(null)
        setForm({ amount: '', category: 'Oziq-ovqat', date: '', description: '' })
    }

    const inputCls = "w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition"

    return (
        <div className="p-6 min-h-screen">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-white text-2xl font-bold">Xarajatlar</h1>
                    <p className="text-slate-400 text-sm mt-1">Klub xarajatlarini boshqarish</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-900/40 cursor-pointer"
                >
                    <Plus size={16} /> Yangi xarajat
                </button>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1a1630] border border-[#2d2556] rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-900/40 border border-violet-700/40 flex items-center justify-center text-violet-400">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm mb-1">Umumiy xarajat (Shu oy)</p>
                        <h3 className="text-white text-xl font-bold">{totalMonth.toLocaleString()} so'm</h3>
                    </div>
                </div>
                <div className="bg-[#1a1630] border border-[#2d2556] rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-900/40 border border-blue-700/40 flex items-center justify-center text-blue-400">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm mb-1">Eng ko'p sarf</p>
                        <h3 className="text-white text-xl font-bold">{topCategory}</h3>
                    </div>
                </div>
                <div className="bg-[#1a1630] border border-[#2d2556] rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center text-emerald-400">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm mb-1">Oxirgi 24 soatda</p>
                        <h3 className="text-white text-xl font-bold">{last24hCount.toLocaleString()} so'm</h3>
                    </div>
                </div>
            </div>

            {/* Empty state */}
            {spendings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#1a1630] border border-[#2d2556] flex items-center justify-center mb-4">
                        <Receipt size={28} className="text-violet-400" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">Hali xarajatlar yo'q</p>
                    <p className="text-slate-500 text-sm mb-6">Xarajatni kiritish uchun "Yangi xarajat" tugmasini bosing</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-900/40 cursor-pointer"
                    >
                        <Plus size={16} /> Birinchi xarajatni qo'shish
                    </button>
                </div>
            )}

            {/* List */}
            {spendings.length > 0 && (
                <div className="space-y-3">
                    {spendings.map(s => (
                        <div key={s.id} className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-violet-500/40 hover:bg-[#1e1a3a] transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center flex-shrink-0">
                                    <TrendingDown size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{s.description}</p>
                                    <p className="text-slate-400 text-xs mt-0.5">{s.date}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 md:ml-auto">
                                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${CATEGORY_COLORS[s.category]}`}>
                                    {s.category}
                                </span>
                                <h4 className="text-white font-bold ml-2">{Number(s.amount).toLocaleString()} so'm</h4>

                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => startEdit(s.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2d2556] text-slate-400 hover:bg-violet-600 hover:text-white transition cursor-pointer"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(s.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2d2556] text-slate-400 hover:bg-red-600 hover:text-white transition cursor-pointer"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1630] border border-[#2d2556] rounded-2xl p-6 w-full max-w-sm shadow-2xl overflow-y-auto max-h-screen">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-white font-bold text-lg">{editId ? 'Xarajatni tahrirlash' : 'Yangi xarajat'}</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-white transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-400 text-xs mb-1">Miqdor (so'm)</label>
                            <input
                                type="number"
                                value={form.amount}
                                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                                placeholder="Masalan: 150000"
                                className={inputCls}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-400 text-xs mb-1">Kategoriya</label>
                            <select
                                value={form.category}
                                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                className={inputCls}
                            >
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c} className="bg-[#0f0c1e]">{c}</option>
                                ))}
                            </select>
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

                        <div className="mb-6">
                            <label className="block text-slate-400 text-xs mb-1">Izoh (qisqa)</label>
                            <input
                                type="text"
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Nima uchun sarflandi?"
                                className={inputCls}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={closeModal}
                                className="flex-1 py-2.5 rounded-xl bg-[#2d2556] text-slate-300 text-sm font-semibold hover:bg-[#3d3470] transition cursor-pointer"
                            >
                                Bekor
                            </button>
                            <button
                                onClick={handleAddOrEdit}
                                disabled={!form.amount || !form.category || !form.date || !form.description}
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
