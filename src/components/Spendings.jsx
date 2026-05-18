import { useState, useEffect } from 'react'
import { Plus, X, Pencil, Trash2, Wallet, TrendingDown, Receipt } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Spendings() {
    const [spendings, setSpendings] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState({ amount: '', date: '', description: '' })
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

        if (!error && data) setSpendings(data)
        setLoading(false)
    }

    const totalMonth = spendings.reduce((acc, curr) => acc + Number(curr.amount), 0)

    const handleAddOrEdit = async () => {
        if (!form.amount || !form.date || !form.description) return

        try {
            const spendingData = {
                amount: Number(form.amount),
                date: form.date,
                description: form.description
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
            setForm({ amount: target.amount, date: target.date, description: target.description })
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
        setForm({ amount: '', date: '', description: '' })
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
                                    <p className="text-white font-black text-lg tracking-tight mb-0.5">{s.description}</p>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
                    <div className="bg-[#1a1630] border border-[#2d2556] rounded-[36px] p-8 w-full max-w-sm shadow-2xl animate-scaleUp">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-white font-black text-xl uppercase tracking-tighter">{editId ? 'Tahrirlash' : 'Yangi Xarajat'}</h3>
                            <button onClick={closeModal} className="w-10 h-10 rounded-full bg-[#0f0c1e] flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div>
                                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Miqdor (so'm)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={form.amount}
                                        onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                                        placeholder="0.00"
                                        className={inputCls}
                                    />
                                    <span className="absolute right-4 top-2.5 text-[10px] text-slate-600 font-bold">SO'M</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Sana</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                    className={inputCls}
                                />
                            </div>

                            <div>
                                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Izoh (nima uchun?)</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Masalan: Elektr energiyasi to'lovi..."
                                    className={`${inputCls} h-24 resize-none pt-4`}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={closeModal}
                                className="flex-1 py-4 rounded-2xl bg-[#0f0c1e] text-slate-500 text-xs font-black uppercase tracking-[0.2em] hover:text-white transition-all cursor-pointer"
                            >
                                Bekor
                            </button>
                            <button
                                onClick={handleAddOrEdit}
                                disabled={!form.amount || !form.date || !form.description}
                                className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-violet-900/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
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
