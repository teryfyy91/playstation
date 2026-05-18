import { useState, useEffect } from 'react'
import { Save, Store, Clock, DollarSign, Wifi, Bell, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Settings() {
    const [settings, setSettings] = useState({
        clubName: 'ProPlay PlayStation Club',
        address: 'Toshkent sh., Chilonzor tumani',
        openTime: '09:00',
        closeTime: '24:00',
        vipPrice: '15000',
        regularPrice: '8000',
        warnMinutes: '5',
        autoNotify: true,
    })
    const [loading, setLoading] = useState(true)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .single()

            if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                throw error
            }

            if (data) {
                setSettings(data)
            }
        } catch (err) {
            console.error("Settings fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            // Remove id if it exists to let supabase handle it or use it for upsert
            const { error } = await supabase
                .from('settings')
                .upsert([settings])

            if (error) throw error

            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
            fetchSettings()
        } catch (err) {
            alert("Sozlamalarni saqlashda xatolik: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    const inputCls = "w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition placeholder:text-slate-700"

    if (loading && !saved) {
        return (
            <div className="p-6 min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="text-violet-500 animate-spin mb-4" size={40} />
                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Yuklanmoqda...</p>
            </div>
        )
    }

    return (
        <div className="p-6 min-h-screen max-w-2xl animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-white text-3xl font-black uppercase tracking-tighter">Sozlamalar</h1>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-1">Klub konfiguratsiyasini boshqarish</p>
            </div>

            <div className="space-y-6">
                {/* Club info */}
                <div className="rounded-[32px] bg-[#1a1630] border border-[#2d2556] p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-violet-600/10 transition-all duration-700"></div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                            <Store size={20} />
                        </div>
                        <h2 className="text-white font-black text-xs uppercase tracking-widest">Klub ma'lumotlari</h2>
                    </div>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Klub nomi</label>
                            <input value={settings.clubName} onChange={e => setSettings(s => ({ ...s, clubName: e.target.value }))} className={inputCls} placeholder="Klub nomini kiriting..." />
                        </div>
                        <div>
                            <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Manzil</label>
                            <input value={settings.address} onChange={e => setSettings(s => ({ ...s, address: e.target.value }))} className={inputCls} placeholder="Klub manzilini kiriting..." />
                        </div>
                    </div>
                </div>

                {/* Working hours */}
                <div className="rounded-[32px] bg-[#1a1630] border border-[#2d2556] p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-600/10 transition-all duration-700"></div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                            <Clock size={20} />
                        </div>
                        <h2 className="text-white font-black text-xs uppercase tracking-widest">Ish vaqti</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Ochilish</label>
                            <input type="time" value={settings.openTime} onChange={e => setSettings(s => ({ ...s, openTime: e.target.value }))} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Yopilish</label>
                            <input type="time" value={settings.closeTime} onChange={e => setSettings(s => ({ ...s, closeTime: e.target.value }))} className={inputCls} />
                        </div>
                    </div>
                </div>

                {/* Prices */}
                <div className="rounded-[32px] bg-[#1a1630] border border-[#2d2556] p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-600/10 transition-all duration-700"></div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <DollarSign size={20} />
                        </div>
                        <h2 className="text-white font-black text-xs uppercase tracking-widest">Narxlar (soatiga, so'm)</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">VIP xona</label>
                            <div className="relative">
                                <input type="number" value={settings.vipPrice} onChange={e => setSettings(s => ({ ...s, vipPrice: e.target.value }))} className={inputCls} />
                                <span className="absolute right-4 top-2.5 text-[10px] text-slate-600 font-bold">SO'M</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Oddiy zal</label>
                            <div className="relative">
                                <input type="number" value={settings.regularPrice} onChange={e => setSettings(s => ({ ...s, regularPrice: e.target.value }))} className={inputCls} />
                                <span className="absolute right-4 top-2.5 text-[10px] text-slate-600 font-bold">SO'M</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="rounded-[32px] bg-[#1a1630] border border-[#2d2556] p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-amber-600/10 transition-all duration-700"></div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Bell size={20} />
                        </div>
                        <h2 className="text-white font-black text-xs uppercase tracking-widest">Ogohlantirishlar</h2>
                    </div>
                    <div className="flex items-center justify-between mb-8 p-4 bg-[#0f0c1e] rounded-2xl border border-[#2d2556]">
                        <div>
                            <p className="text-white text-sm font-black uppercase tracking-tight">Avtomatik ogohlantirish</p>
                            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-1">Vaqt tugashidan oldin xabar berish</p>
                        </div>
                        <button
                            onClick={() => setSettings(s => ({ ...s, autoNotify: !s.autoNotify }))}
                            className={`relative w-12 h-6 rounded-full transition-all duration-500 cursor-pointer shadow-inner
                ${settings.autoNotify ? 'bg-violet-600' : 'bg-[#2d2556]'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 shadow-md
                ${settings.autoNotify ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                    <div>
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">Ogohlantirish (daqiqa oldin)</label>
                        <input type="number" value={settings.warnMinutes} onChange={e => setSettings(s => ({ ...s, warnMinutes: e.target.value }))} className={inputCls} />
                    </div>
                </div>

                <div className="pt-4 pb-12">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 cursor-pointer shadow-2xl active:scale-95 disabled:opacity-50
                ${saved
                                ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-violet-900/40'
                            }`}
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : (saved ? (
                            <>Saqlandi ✓</>
                        ) : (
                            <><Save size={18} /> Saqlash</>
                        ))}
                    </button>
                </div>
            </div>
        </div>
    )
}
