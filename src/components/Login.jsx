import { useState } from 'react'
import { Gamepad2, Lock, User, Eye, EyeOff } from 'lucide-react'

export default function Login({ onLogin }) {
    const [mode, setMode] = useState('login') // 'login' or 'register'
    const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (mode === 'register') {
            if (form.password !== form.confirmPassword) {
                return setError('Parollar bir-biriga mos kelmadi!')
            }
            if (form.password.length < 4) {
                return setError('Parol kamida 4 ta belgidan iborat bo\'lishi kerak!')
            }

            const users = JSON.parse(localStorage.getItem('ps_registered_users') || '[]')
            if (users.find(u => u.username === form.username) || form.username === 'admin') {
                return setError('Ushbu login band, boshqasini tanlang!')
            }

            const newUser = { username: form.username, password: form.password }
            localStorage.setItem('ps_registered_users', JSON.stringify([...users, newUser]))

            setSuccess('Ro\'yxatdan o\'tdingiz! Kirish mumkin.')
            setTimeout(() => {
                setMode('login')
                setForm({ username: form.username, password: '', confirmPassword: '' })
                setSuccess('')
            }, 1500)
        } else {
            const users = JSON.parse(localStorage.getItem('ps_registered_users') || '[]')
            const staffMembers = JSON.parse(localStorage.getItem('ps_staff') || '[]')

            const user = users.find(u => u.username === form.username && u.password === form.password)
            const staff = staffMembers.find(s => s.email === form.username && s.password === form.password)

            if ((form.username === 'admin' && form.password === '1234') || user || staff) {
                const loggedUser = staff || user || { username: 'admin' }
                setSuccess(`${loggedUser.name || loggedUser.username} xush kelibsiz!`)
                setTimeout(() => {
                    onLogin(loggedUser)
                }, 1000)
            } else {
                setError('Login yoki parol noto\'g\'ri!')
            }
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
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-violet-900/50 mb-4 transform hover:rotate-6 transition-transform">
                        <Gamepad2 size={32} className="text-white" />
                    </div>
                    <h1 className="text-white text-2xl font-black tracking-[0.2em] uppercase">
                        PS CLUB <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">ADMIN</span>
                    </h1>
                </div>

                {/* Main Card */}
                <div className="bg-[#1a1630]/60 backdrop-blur-2xl border border-[#2d2556] rounded-[40px] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-t-[#3d3470]">

                    {/* Mode Switcher */}
                    <div className="flex bg-[#0f0c1e] p-1.5 rounded-2xl mb-8 relative border border-[#2d2556]">
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl transition-all duration-300 ease-out shadow-lg
                                ${mode === 'register' ? 'left-[calc(50%+3px)]' : 'left-1.5'}`}
                        />
                        <button
                            onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest z-10 transition-colors duration-300 ${mode === 'login' ? 'text-white' : 'text-slate-500'}`}
                        >
                            Kirish
                        </button>
                        <button
                            onClick={() => { setMode('register'); setError(''); setSuccess('') }}
                            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest z-10 transition-colors duration-300 ${mode === 'register' ? 'text-white' : 'text-slate-500'}`}
                        >
                            Ro'yxatdan o'tish
                        </button>
                    </div>

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

                            {mode === 'register' && (
                                <div className="relative animate-slideDown duration-300">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={form.confirmPassword}
                                        onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                        placeholder="Parolni tasdiqlang"
                                        className={inputCls}
                                        required={mode === 'register'}
                                    />
                                </div>
                            )}
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
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)] active:scale-[0.98] mt-4"
                        >
                            {mode === 'register' ? 'Hisobni Tasdiqlash' : 'Tizimga Kirish'}
                        </button>
                    </form>
                </div>

                {/* Footer Credits */}
                <div className="mt-10 flex flex-col items-center gap-4">
                    <div className="h-[1px] w-12 bg-[#2d2556]" />
                    <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
                        &copy; 2026 PS CLUB PLATFORM
                    </p>
                </div>
            </div>
        </div>
    )
}
