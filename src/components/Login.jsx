import { useState } from 'react'
import { Gamepad2, Lock, User, Eye, EyeOff, Loader2, Mail, Phone, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {
    const [isSignup, setIsSignup] = useState(false)
    const [form, setForm] = useState({ username: '', password: '', email: '', phone: '' })
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
            if (isSignup) {
                // Registration Logic
                if (!form.username || !form.password || !form.email) {
                    throw new Error("Iltimos, barcha maydonlarni to'ldiring!")
                }

                // Check if user already exists
                const { data: existingUser } = await supabase
                    .from('staff')
                    .select('id')
                    .or(`name.eq."${form.username}",email.eq."${form.email}"`)
                    .maybeSingle()

                if (existingUser) {
                    throw new Error("Ushbu ism yoki email allaqachon foydalanilmoqda!")
                }

                // Insert into staff table
                const { data: newUser, error: signUpErr } = await supabase
                    .from('staff')
                    .insert([
                        {
                            name: form.username,
                            password: form.password,
                            email: form.email,
                            phone: form.phone || '',
                            role: 'Staff',
                            status: 'Ishda'
                        }
                    ])
                    .select()
                    .single()

                if (signUpErr) throw signUpErr

                setSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi tizimga kiring.")
                setTimeout(() => {
                    setIsSignup(false)
                    setSuccess('')
                }, 2000)

            } else {
                // Login Logic
                if (form.username === 'admin' && form.password === '1234') {
                    setSuccess('Admin xush kelibsiz!')
                    onLogin({ name: 'Admin', username: 'admin', role: 'admin' })
                    return
                }

                let staffData = null
                const { data: byName } = await supabase
                    .from('staff')
                    .select('*')
                    .eq('name', form.username)
                    .eq('password', form.password)
                    .maybeSingle()

                if (byName) {
                    staffData = byName
                } else {
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
                    onLogin({
                        name: staffData.name,
                        username: staffData.name,
                        id: staffData.id,
                        email: staffData.email,
                        role: staffData.role
                    })
                    return
                }

                throw new Error("Ism yoki parol noto'g'ri!")
            }
        } catch (err) {
            setError(err.message || "Xatolik yuz berdi!")
        } finally {
            setLoading(false)
        }
    }

    const inputCls = "w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-2xl px-11 py-3.5 text-sm outline-none focus:border-violet-500 transition-all duration-300 placeholder:text-slate-600 shadow-inner group-hover:border-violet-500/50"

    return (
        <div className="min-h-screen w-full bg-[#0f0c1e] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-violet-500/30">
            {/* Animated Background Spheres */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-600/10 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="w-full max-w-md z-10 transition-all duration-500 translate-y-0 opacity-100">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-32 h-32 rounded-[40px] flex items-center justify-center bg-[#1a1630] shadow-[0_0_50px_rgba(139,92,246,0.3)] mb-6 overflow-hidden border border-violet-500/20 transform hover:scale-105 hover:rotate-3 transition-all duration-500 group">
                        <img src="/gaim-logo.png" alt="Logo" className="w-full h-full object-cover mix-blend-screen transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex' }} />
                        <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700">
                            <Gamepad2 size={50} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-white text-4xl font-black tracking-tighter uppercase flex flex-col items-center gap-2 font-orbitron text-center">
                        GAIMPOINT <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 text-[10px] tracking-[0.5em] font-black">{isSignup ? "RO'YXATDAN O'TISH" : "ADMIN PANELIGA KIRISH"} - v2.0.4</span>
                    </h1>
                </div>

                {/* Main Card */}
                <div className="bg-[#1a1630]/60 backdrop-blur-3xl border border-[#2d2556] rounded-[40px] p-8 shadow-[0_32px_100px_-16px_rgba(0,0,0,0.6)] border-t-[#3d3470]/50 relative overflow-hidden group">
                    {/* Decorative reflection */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                        <div className="space-y-3.5">
                            <div className="relative group/input">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-violet-400 transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={form.username}
                                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                    placeholder={isSignup ? "To'liq ismingiz" : "Username yoki Email kiring"}
                                    className={inputCls}
                                    required
                                />
                            </div>

                            {isSignup && (
                                <>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-violet-400 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                            placeholder="Email manzilingiz"
                                            className={inputCls}
                                            required
                                        />
                                    </div>
                                    <div className="relative group/input">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-violet-400 transition-colors" size={18} />
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                            placeholder="Telefon (ixtiyoriy)"
                                            className={inputCls}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-violet-400 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    placeholder="Parol yarating"
                                    className={inputCls}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
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
                            {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    {isSignup ? "Ro'yxatdan O'tish" : "Tizimga Kirish"}
                                    {!loading && <ArrowRight size={16} />}
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsSignup(!isSignup)
                                setError('')
                                setSuccess('')
                            }}
                            className="w-full text-center text-slate-500 text-[11px] font-bold uppercase tracking-widest hover:text-violet-400 transition-colors py-2"
                        >
                            {isSignup ? "Accountingiz bormi? Kirish" : "Hesabingiz yo'qmi? Ro'yxatdan o'ting"}
                        </button>
                    </form>
                </div>

                {/* Footer Credits */}
                <div className="mt-10 flex flex-col items-center gap-4">
                    <div className="h-[1px] w-12 bg-[#2d2556] opacity-50" />
                    <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
                        &copy; 2026 GAIMPOINT PLATFORM
                    </p>
                </div>
            </div>
        </div>
    )
}
