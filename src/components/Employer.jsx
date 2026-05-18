import { useState, useEffect } from 'react'
import { Briefcase, UserPlus, Shield, Clock, Phone, Mail, MoreHorizontal, Trash2, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Employer() {
    const [staff, setStaff] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', role: 'Operator', phone: '', email: '', password: '' })

    useEffect(() => {
        fetchStaff()
    }, [])

    const fetchStaff = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('staff')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            if (data) setStaff(data)
        } catch (err) {
            console.error("Staff fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async () => {
        if (!form.name || !form.phone || !form.email || !form.password) return

        try {
            const { error } = await supabase
                .from('staff')
                .insert([{
                    name: form.name,
                    role: form.role,
                    phone: form.phone,
                    email: form.email,
                    password: form.password,
                    status: 'Dam olmoqda'
                }])

            if (error) throw error

            fetchStaff()
            setForm({ name: '', role: 'Operator', phone: '', email: '', password: '' })
            setShowForm(false)
        } catch (err) {
            alert("Xodim qo'shishda xatolik: " + err.message)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Rostdan ham ushbu xodimni o'chirmoqchimisiz?")) return

        try {
            const { error } = await supabase
                .from('staff')
                .delete()
                .eq('id', id)

            if (error) throw error
            setStaff(prev => prev.filter(x => x.id !== id))
        } catch (err) {
            alert("O'chirishda xatolik: " + err.message)
        }
    }

    return (
        <div className="p-6 min-h-screen">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-white text-2xl font-bold uppercase tracking-tighter">Xodimlar</h1>
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest font-medium mt-1">Klub xodimlari va ularning rollari</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition shadow-lg shadow-violet-900/40 cursor-pointer"
                >
                    <UserPlus size={16} /> Xodim qo'shish
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="text-violet-500 animate-spin mb-4" size={40} />
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Yuklanmoqda...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {staff.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#1a1630]/30 border-2 border-dashed border-[#2d2556] rounded-[32px]">
                            <Briefcase size={40} className="text-slate-700 mb-4" />
                            <p className="text-white font-bold mb-1">Xodimlar topilmadi</p>
                            <p className="text-slate-500 text-xs">Yangi xodim qo'shish uchun yuqoridagi tugmani bosing</p>
                        </div>
                    ) : (
                        staff.map(s => (
                            <div key={s.id} className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-5 flex items-center justify-between hover:border-violet-500/30 transition-all group shadow-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2d2556] to-[#1a1630] border border-[#3d3470] flex items-center justify-center text-violet-400 font-bold group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300">
                                        {s.name[0]}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-white font-bold">{s.name}</p>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border 
                                                ${s.role === 'Admin' ? 'bg-amber-900/20 text-amber-500 border-amber-800/30' : 'bg-blue-900/20 text-blue-500 border-blue-800/30'}`}>
                                                {s.role}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-slate-500 text-xs flex items-center gap-1">
                                                <Phone size={10} /> {s.phone}
                                            </p>
                                            <p className="text-slate-500 text-xs flex items-center gap-1">
                                                <Mail size={10} /> {s.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${s.status === 'Ishda' ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                                            <p className={`text-xs font-medium ${s.status === 'Ishda' ? 'text-emerald-400' : 'text-slate-400'}`}>{s.status}</p>
                                        </div>
                                        <p className="text-slate-500 text-[10px] mt-0.5 uppercase font-bold tracking-tighter opacity-50">So'nggi faollik: hozir</p>
                                    </div>
                                    <button className="p-2 rounded-lg bg-[#2d2556] text-slate-400 hover:text-white transition cursor-pointer">
                                        <MoreHorizontal size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg bg-red-900/10 text-red-500/50 hover:text-red-500 hover:bg-red-900/20 transition cursor-pointer">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-[#1a1630] border border-[#2d2556] rounded-[32px] p-8 w-full max-w-sm shadow-2xl overflow-y-auto max-h-[90vh] animate-scaleUp">
                        <h3 className="text-white font-black text-xl mb-1 uppercase tracking-wider text-center">Yangi Xodim</h3>
                        <p className="text-slate-500 text-xs mb-8 text-center uppercase tracking-widest font-medium">Klub xodimi ma'lumotlarini kiriting</p>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-slate-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] ml-1">Ism familiya</label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Ism kiriting..." className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition shadow-inner" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] ml-1">Lavozim</label>
                                    <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                        className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition cursor-pointer shadow-inner">
                                        <option value="Admin">Admin</option>
                                        <option value="Operator">Operator</option>
                                        <option value="Kassir">Kassir</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] ml-1">Telefon</label>
                                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        placeholder="+998..." className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition shadow-inner" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] ml-1">Gmail / Email</label>
                                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    placeholder="example@gmail.com" className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition shadow-inner" />
                            </div>
                            <div>
                                <label className="block text-slate-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] ml-1">Parol</label>
                                <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    placeholder="******" className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition shadow-inner" />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowForm(false)} className="flex-1 py-4 rounded-2xl bg-[#0f0c1e] border border-[#2d2556] text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition cursor-pointer">Bekor</button>
                            <button onClick={handleAdd} className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-violet-900/40 hover:scale-[1.02] active:scale-95 transition cursor-pointer">Saqlash</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
