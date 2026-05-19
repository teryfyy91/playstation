import { useState } from 'react'
import { Gamepad2, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {
    const [form, setForm] = useState({ username: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            // Local fallback for admin
            if (form.username === 'admin' && form.password === '1234') {
                setSuccess('Admin xush kelibsiz!')
                setTimeout(() => onLogin({ username: 'admin', role: 'admin' }), 1000)
                return
            }

            // Try login by name first
            let staffData = null
            const { data: byName, error: err1 } = await supabase
                .from('staff')
                .select('*')
                .eq('name', form.username)
                .eq('password', form.password)
                .maybeSingle()

            if (byName) {
                staffData = byName
            } else {
                // Try login by email
                const { data: byEmail } = await supabase
                    .from('staff')
                    .select('*')
                    .eq('email', form.username)
                    .eq('password', form.password)
                    .maybeSingle()
                if (byEmail) staffData = byEmail
            }

            if (staffData) {
                setSuccess(`${staffData.name} xush kelibsiz!`)
                setTimeout(() => {
                    onLogin({
                        username: staffData.name,
                        id: staffData.id,
                        email: staffData.email,
                        role: staffData.role
                    })
                }, 1000)
                return
            }

            // No match found
            throw new Error("Ism yoki parol noto'g'ri!")
        } catch (err) {
            setError(err.message || "Ism yoki parol noto'g'ri!")
        } finally {
            setLoading(false)
        }
    }

    const inputCls = "w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-2xl px-11 py-3.5 text-sm outline-none focus:border-violet-500 transition-all duration-300 placeholder:text-slate-600 shadow-inner"

    return (
        <div className="min-h-screen w-full bg-[#0f0c1e] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Animated Background Spheres */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-600/10 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="w-full max-w-md z-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center bg-black shadow-2xl shadow-violet-900/50 mb-5 overflow-hidden border-2 border-violet-500/20 transform hover:scale-105 transition-all">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex' }} />
                        <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700">
                            <Gamepad2 size={40} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-white text-3xl font-black tracking-tight uppercase flex items-center gap-3">
                        GaimPoint <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 text-sm tracking-[0.2em] mt-1 relative top-px">ADMIN</span>
                    </h1>
                </div>

                {/* Main Card */}
                <div className="bg-[#1a1630]/60 backdrop-blur-2xl border border-[#2d2556] rounded-[40px] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-t-[#3d3470]">

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 focus-within:text-violet-400" size={18} />
                                <input
                                    type="text"
                                    value={form.username}
                                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                    placeholder="Username yoki Email kiring"
                                    className={inputCls}
                                    required
                                />
                            </div>

                            <div className="relative border-b border-[#2d2556]/0 pb-2">
                                <Lock className="absolute left-4 top-[17px] text-slate-500" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    placeholder="Parol"
                                    className={inputCls}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-[17px] text-slate-600 hover:text-slate-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] py-3.5 px-4 rounded-2xl text-center font-bold tracking-wide animate-shake">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] py-3.5 px-4 rounded-2xl text-center font-bold tracking-wide">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)] active:scale-[0.98] mt-4 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Tizimga Kirish'}
                        </button>
                    </form>
                </div>

                {/* Footer Credits */}
                <div className="mt-10 flex flex-col items-center gap-4">
                    <div className="h-[1px] w-12 bg-[#2d2556]" />
                    <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
                        &copy; 2026 GAIMPOINT PLATFORM
                    </p>
                </div>
            </div>
        </div>
    )
}
