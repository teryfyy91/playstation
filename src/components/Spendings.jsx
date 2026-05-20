import { useState, useEffect } from 'react'
import { Plus, X, Pencil, Trash2, Wallet, TrendingDown, Receipt } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Spendings({ user }) {
    const [spendings, setSpendings] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editId, setEditId] = useState(null)
    const todayIso = new Date().toISOString().split('T')[0]
    const [form, setForm] = useState({ amount: '', date: todayIso, description: '' })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSpendings()
    }, [])

    const fetchSpendings = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('spendings')
            .select('*')
            .order('date', { ascending: false })

        if (!error && data) {
            const filtered = data.filter(s => s.description?.includes(`[Staff:${user?.name || user?.username || 'Unknown'}]`))
            setSpendings(filtered)
        }
        setLoading(false)
    }

    const totalMonth = spendings.reduce((acc, curr) => acc + Number(curr.amount), 0)

    const handleAddOrEdit = async () => {
        if (!form.amount || !form.date || !form.description) return

        try {
            const spendingData = {
                amount: Number(form.amount),
                date: form.date,
                description: `${form.description} [Staff:${user?.name || user?.username || 'Unknown'}]`
            }

            if (editId) {
                const { error } = await supabase
                    .from('spendings')
                    .update(spendingData)
                    .eq('id', editId)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('spendings')
                    .insert([spendingData])
                if (error) throw error
            }

            fetchSpendings()
            closeModal()
        } catch (err) {
            alert("Xatolik: " + err.message)
        }
    }

    const startEdit = (id) => {
        const target = spendings.find(s => s.id === id)
        if (target) {
            setForm({
                amount: target.amount,
                date: target.date,
                description: target.description?.split(' [Staff:')[0] || target.description
            })
            setEditId(id)
            setShowForm(true)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Rostdan ham o\'chirmoqchimisiz?')) {
            const { error } = await supabase
                .from('spendings')
                .delete()
                .eq('id', id)

            if (!error) fetchSpendings()
            else alert("O'chirishda xatolik: " + error.message)
        }
    }

    const closeModal = () => {
        setShowForm(false)
        setEditId(null)
        setForm({ amount: '', date: todayIso, description: '' })
    }

    const inputCls = "w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition placeholder:text-slate-700"

    return (
        <div className="p-6 min-h-screen animate-fadeIn">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-white text-2xl font-bold uppercase tracking-tighter">Xarajatlar</h1>
                    <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-medium text-[10px]">Klub xarajatlarini monitoring qilish</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition shadow-lg shadow-violet-900/40 cursor-pointer"
                >
                    <Plus size={16} /> Yangi xarajat
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-[#1a1630] border border-[#2d2556] rounded-[32px] p-6 flex items-center gap-5 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-violet-600/20 transition-all duration-700"></div>
                    <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-inner">
                        <Wallet size={28} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Umumiy xarajat</p>
                        <h3 className="text-white text-3xl font-black tracking-tighter">{totalMonth.toLocaleString()} <span className="text-xs text-slate-500 font-bold ml-1 uppercase">so'm</span></h3>
                    </div>
                </div>
                <div className="bg-[#1a1630] border border-[#2d2556] rounded-[32px] p-6 flex items-center gap-5 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-600/20 transition-all duration-700"></div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                        <TrendingDown size={28} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Eng ko'p sarf</p>
                        <h3 className="text-white text-2xl font-black tracking-tighter truncate max-w-[200px]">
                            {spendings.length > 0 ? spendings.reduce((a, b) => Number(a.amount) > Number(b.amount) ? a : b).description : '-'}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {spendings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-center bg-[#1a1630]/30 border-2 border-dashed border-[#2d2556] rounded-[48px]">
                    <div className="w-20 h-20 rounded-3xl bg-[#0f0c1e] border border-[#2d2556] flex items-center justify-center mb-6 shadow-2xl">
                        <Receipt size={32} className="text-slate-700" />
                    </div>
                    <p className="text-white font-black text-xl mb-2">Xarajatlar mavjud emas</p>
                    <p className="text-slate-600 text-sm mb-8 font-medium">Barcha chiqimlarni shu yerda kuzatib borishingiz mumkin</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-violet-600 hover:text-white transition-all shadow-xl cursor-pointer"
                    >
                        <Plus size={18} /> Qo'shish
                    </button>
                </div>
            )}

            {/* List */}
            {spendings.length > 0 && (
                <div className="space-y-4">
                    {spendings.map(s => (
                        <div key={s.id} className="rounded-[28px] bg-[#1a1630] border border-[#2d2556] p-6 flex items-center justify-between gap-6 hover:border-violet-500/30 hover:bg-[#1e1a3a] transition-all duration-300 shadow-md">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2d2556] to-[#0f0c1e] border border-[#3d3470] flex items-center justify-center flex-shrink-0 text-violet-400 font-black">
                                    <TrendingDown size={20} />
                                </div>
                                <div>
                                    <p className="text-white font-black text-lg tracking-tight mb-0.5">{s.description?.split(' [Staff:')[0] || s.description}</p>
                                    <div className="flex items-center gap-3">
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{s.date}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <h4 className="text-white font-black text-xl tracking-tighter">{Number(s.amount).toLocaleString()} <span className="text-[10px] text-slate-500 uppercase ml-1">so'm</span></h4>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => startEdit(s.id)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0f0c1e] border border-[#2d2556] text-slate-400 hover:bg-violet-600 hover:text-white hover:border-violet-500 transition-all cursor-pointer"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(s.id)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0f0c1e] border border-[#2d2556] text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-500 transition-all cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-fadeIn overflow-y-auto">
                    <div className="bg-[#1a1630] border border-[#2d2556] rounded-[48px] p-8 md:p-10 w-full max-w-[420px] shadow-[0_0_100px_rgba(124,58,237,0.15)] animate-scaleUp relative overflow-hidden flex flex-col my-auto">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white mb-5 shadow-lg shadow-violet-900/40">
                                    <Wallet size={24} />
                                </div>
                                <h3 className="text-white font-black text-2xl uppercase tracking-tighter">{editId ? 'Xarajatni tahrirlash' : 'Yangi Xarajat'}</h3>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5">Klubdan pul chiqishi</p>
                            </div>
                            <button onClick={closeModal} className="w-12 h-12 rounded-full border border-[#2d2556] bg-[#0f0c1e] flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2d2556] hover:rotate-90 transition-all duration-300 cursor-pointer shadow-lg shadow-black/20">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-12 relative z-10">
                            <div className="bg-[#0f0c1e] p-5 rounded-[28px] border border-[#2d2556] transition focus-within:border-violet-500/50 focus-within:shadow-[0_0_30px_rgba(124,58,237,0.1)]">
                                <label className="block text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Summa</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        autoFocus
                                        type="number"
                                        value={form.amount}
                                        onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                                        placeholder="0"
                                        className="w-full bg-transparent text-white text-4xl font-black outline-none placeholder:text-slate-800 tracking-tighter"
                                    />
                                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] bg-[#1a1630] border border-[#2d2556] px-4 py-2.5 rounded-[14px]">So'm</span>
                                </div>
                            </div>

                            <div className="bg-[#0f0c1e] p-5 rounded-[28px] border border-[#2d2556] transition hover:border-[#3d3470]">
                                <label className="block text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Sana</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                    className="w-full bg-transparent text-white text-sm font-bold outline-none cursor-pointer"
                                />
                            </div>

                            <div className="bg-[#0f0c1e] p-5 rounded-[28px] border border-[#2d2556] transition focus-within:border-violet-500/50">
                                <label className="block text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Xarajat maqsadi</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Nima uchun xarajat qilindi? (Masalan: Areknda to'lovi, Suv, Elektr...)"
                                    className="w-full bg-transparent text-white text-sm font-bold outline-none resize-none h-16 placeholder:text-slate-700/60 leading-relaxed"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 relative z-10">
                            <button
                                onClick={closeModal}
                                className="flex-1 py-5 rounded-[24px] bg-[#0f0c1e] border border-[#2d2556] text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-[#2d2556] transition-all cursor-pointer"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleAddOrEdit}
                                disabled={!form.amount || !form.date || !form.description}
                                className="flex-1 py-5 rounded-[24px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-900/40 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {editId ? 'Saqlash' : "Qo'shish"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
