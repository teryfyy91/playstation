import { useState } from 'react'
import { LayoutDashboard, CalendarCheck, Users, Settings, Gamepad2, LogOut, Wallet, BarChart3, Briefcase, ShoppingCart, AlertTriangle } from 'lucide-react'

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'statistics', label: 'Statistika', icon: BarChart3 },
    { id: 'bar', label: 'Bar / Sklad', icon: ShoppingCart },
    { id: 'spendings', label: 'Xarajatlar', icon: Wallet },
    { id: 'settings', label: 'Sozlamalar', icon: Settings },
]

export default function Sidebar({ activePage, setActivePage, onLogout, user }) {
    const [showConfirm, setShowConfirm] = useState(false)

    return (
        <aside className="w-64 h-full bg-[#1a1630] border-r border-[#2d2556] flex flex-col relative">
            <div className="flex items-center gap-3 px-6 py-8 border-b border-[#2d2556]">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#1a1630] shadow-[0_0_30px_rgba(139,92,246,0.3)] overflow-hidden border border-violet-500/20 group hover:border-violet-500/50 transition-all duration-500">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover mix-blend-screen transform group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex' }} />
                    <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700">
                        <Gamepad2 size={28} className="text-white" />
                    </div>
                </div>
                <div>
                    <h1 className="text-white font-black text-xl leading-none tracking-tight font-orbitron">GAIMPOINT</h1>
                    <p className="text-violet-400 text-[8px] uppercase font-black tracking-[0.3em] mt-2 opacity-70">BOSHQRUV PANELI</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map(({ id, label, icon: Icon }) => {
                    const isActive = activePage === id
                    // Simple role-based visibility
                    if (user?.role === 'Operator' && (id === 'employer' || id === 'settings' || id === 'statistics')) {
                        return null
                    }

                    return (
                        <button
                            key={id}
                            onClick={() => setActivePage(id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                ${isActive
                                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/40'
                                    : 'text-slate-400 hover:bg-[#1e1a3a] hover:text-white'
                                }`}
                        >
                            <Icon size={18} />
                            {label}
                        </button>
                    )
                })}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-[#2d2556] bg-[#0f0c1e]/50">
                {user && (
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-[#1a1630] border border-[#2d2556]">
                        <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold text-xs">
                            {user.name ? user.name[0] : (user.username ? user.username[0].toUpperCase() : 'A')}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white font-bold text-xs truncate">{user.name || user.username || 'Admin'}</p>
                            <p className="text-slate-500 text-[10px] truncate">{user.role || (user.username === 'admin' ? 'Super Admin' : 'Foydalanuvchi')}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setShowConfirm(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all duration-200 cursor-pointer"
                >
                    <LogOut size={18} />
                    Chiqish
                </button>
            </div>

            {/* Logout Confirmation Dialog */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
                    <div className="bg-[#1a1630] border border-[#2d2556] rounded-3xl p-6 w-full max-w-[320px] shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-2xl bg-red-900/20 flex items-center justify-center text-red-500 mb-4 shadow-inner">
                                <AlertTriangle size={28} />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Tizimdan chiqish</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Rostdan ham tizimdan chiqmoqchimisiz?
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="py-3 rounded-2xl bg-[#2d2556] text-slate-300 text-sm font-semibold hover:bg-[#3d3470] transition active:scale-95 cursor-pointer"
                            >
                                Yo'q
                            </button>
                            <button
                                onClick={onLogout}
                                className="py-3 rounded-2xl bg-red-600 text-white text-sm font-bold hover:bg-red-500 shadow-lg shadow-red-900/20 transition active:scale-95 cursor-pointer"
                            >
                                Ha, chiqish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    )
}
