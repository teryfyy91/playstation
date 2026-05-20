import { useState, useEffect } from 'react'
import { Package, Search, Plus, X, Tag, ShoppingCart, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import DeleteConfirmModal from './modals/DeleteConfirmModal'

export default function Bar() {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', buy_price: '', price: '', stock: '' })
    const [loading, setLoading] = useState(true)
    const [editingProduct, setEditingProduct] = useState(null)
    const [deleteId, setDeleteId] = useState(null)

    // Supabase dan mahsulotlarni olish
    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name')

        if (!error && data) setProducts(data)
        setLoading(false)
    }

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleSave = async () => {
        if (!form.name || !form.price || !form.buy_price) return

        try {
            const productData = {
                name: form.name,
                buy_price: Number(form.buy_price),
                price: Number(form.price),
                stock: Number(form.stock) || 0
            }

            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData])
                if (error) throw error
            }

            fetchProducts()
            closeModal()
        } catch (err) {
            alert("Xatolik: " + err.message)
        }
    }

    const openEditModal = (p) => {
        setEditingProduct(p)
        setForm({
            name: p.name,
            buy_price: p.buy_price,
            price: p.price,
            stock: p.stock
        })
        setShowForm(true)
    }

    const closeModal = () => {
        setShowForm(false)
        setEditingProduct(null)
        setForm({ name: '', buy_price: '', price: '', stock: '' })
    }

    const deleteProduct = async () => {
        if (!deleteId) return

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', deleteId)

        if (!error) {
            fetchProducts()
            setDeleteId(null)
        } else {
            alert("O'chirishda xatolik: " + error.message)
        }
    }

    return (
        <div className="p-6 min-h-screen animate-fadeIn">
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-white text-3xl font-black uppercase tracking-tight">Mini-Bar / Sklad</h1>
                    <p className="text-slate-500 text-sm mt-1">Mahsulotlar zaxirasi va foyda boshqaruvi</p>
                </div>
                <button
                    onClick={() => {
                        setEditingProduct(null)
                        setForm({ name: '', buyPrice: '', price: '', stock: '' })
                        setShowForm(true)
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition shadow-lg shadow-emerald-900/40 cursor-pointer"
                >
                    <Plus size={18} /> Yangi mahsulot
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-[#1a1630] border border-[#2d2556] p-5 rounded-3xl">
                    <Package className="text-emerald-400 mb-2" size={20} />
                    <p className="text-2xl text-white font-black">{products.length}</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Turdagi mahsulotlar</p>
                </div>
                <div className="bg-[#1a1630] border border-[#2d2556] p-5 rounded-3xl">
                    <TrendingUp className="text-violet-400 mb-2" size={20} />
                    <p className="text-2xl text-white font-black">{products.reduce((acc, p) => acc + p.stock, 0)}</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Jami zaxira soni</p>
                </div>
                <div className="bg-[#1a1630] border border-[#2d2556] p-5 rounded-3xl">
                    <ShoppingCart className="text-amber-400 mb-2" size={20} />
                    <p className="text-2xl text-white font-black">{(products.reduce((acc, p) => acc + (p.buy_price * p.stock), 0)).toLocaleString()}</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Sklad tan narxi</p>
                </div>
                <div className="bg-[#1a1630] border border-[#2d2556] p-5 rounded-3xl border-emerald-500/30">
                    <TrendingUp className="text-emerald-400 mb-2" size={20} />
                    <p className="text-2xl text-emerald-400 font-black">
                        {(products.reduce((acc, p) => acc + ((p.price - p.buy_price) * p.stock), 0)).toLocaleString()}
                    </p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Kutilayotgan foyda</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-8">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Mahsulot ismini qidirish..."
                    className="w-full bg-[#1a1630] border border-[#2d2556] text-white rounded-[24px] pl-14 pr-6 py-4 text-sm outline-none focus:border-emerald-500 transition shadow-inner"
                />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map((p) => (
                    <div
                        key={p.id}
                        onClick={() => openEditModal(p)}
                        className="group relative rounded-[32px] bg-[#1a1630] border border-[#2d2556] p-6 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer"
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(p.id);
                            }}
                            className="absolute top-4 right-4 text-slate-700 hover:text-red-500 transition opacity-0 group-hover:opacity-100 cursor-pointer p-2 z-10"
                        >
                            <X size={18} />
                        </button>

                        <div className="w-14 h-14 rounded-2xl bg-[#0f0c1e] flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                            <Tag size={24} />
                        </div>

                        <h3 className="text-white font-black text-lg mb-1 truncate">{p.name}</h3>

                        <div className="space-y-1 mb-4">
                            <p className="text-slate-500 text-[10px] font-bold uppercase flex justify-between">
                                Kelish: <span className="text-slate-400 font-mono">{p.buy_price?.toLocaleString()}</span>
                            </p>
                            <p className="text-slate-500 text-[10px] font-bold uppercase flex justify-between">
                                Sotish: <span className="text-emerald-400 font-mono">{p.price.toLocaleString()}</span>
                            </p>
                            <p className="text-violet-400 text-[10px] font-bold uppercase flex justify-between border-t border-[#2d2556] pt-1">
                                Foyda: <span className="font-mono">{(p.price - (p.buy_price || 0)).toLocaleString()}</span>
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-[#2d2556]">
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Soni:</span>
                            <span className={`text-sm font-black ${p.stock < 10 ? 'text-amber-500' : 'text-slate-300'}`}>
                                {p.stock} ta
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-20 text-center animate-fadeIn">
                    <div className="w-20 h-20 rounded-full bg-[#1a1630] flex items-center justify-center mx-auto mb-4 border border-[#2d2556]">
                        <Package size={32} className="text-slate-700" />
                    </div>
                    <p className="text-slate-500 font-bold">Mahsulot topilmadi</p>
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
                    <div className="bg-[#1a1630] border border-[#2d2556] rounded-[40px] p-10 w-full max-w-sm shadow-2xl animate-scaleUp">
                        <h3 className="text-white font-black text-2xl mb-2 uppercase tracking-tighter">
                            {editingProduct ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot'}
                        </h3>
                        <p className="text-slate-500 text-sm mb-8">
                            {editingProduct ? 'Mahsulot ma\'lumotlarini o\'zgartirish' : 'Skladga yangi narsa qo\'shish'}
                        </p>

                        <div className="space-y-6 mb-10">
                            <div>
                                <label className="block text-slate-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] ml-1">Mahsulot Nomi</label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Masalan: Pepsi 1.5L" className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-2xl px-5 py-4 text-sm outline-none focus:border-emerald-500 transition shadow-inner" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] ml-1">Kelgan Narxi</label>
                                    <input type="number" value={form.buy_price} onChange={e => setForm(f => ({ ...f, buy_price: e.target.value }))}
                                        placeholder="7000" className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-2xl px-5 py-4 text-sm outline-none focus:border-emerald-500 transition shadow-inner" />
                                </div>
                                <div>
                                    <label className="block text-slate-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] ml-1">Sotish Narxi</label>
                                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                        placeholder="10000" className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-2xl px-5 py-4 text-sm outline-none focus:border-emerald-500 transition shadow-inner" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-500 text-[10px] font-bold mb-2 uppercase tracking-[0.2em] ml-1">Soni (zaxira)</label>
                                <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                                    placeholder="24" className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-2xl px-5 py-4 text-sm outline-none focus:border-emerald-500 transition shadow-inner" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={closeModal} className="flex-1 py-4 rounded-2xl bg-[#0f0c1e] border border-[#2d2556] text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-white transition cursor-pointer">Bekor</button>
                            <button onClick={handleSave} className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition cursor-pointer">
                                {editingProduct ? 'Saqlash' : 'Qo\'shish'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteId && (
                <DeleteConfirmModal
                    onConfirm={deleteProduct}
                    onCancel={() => setDeleteId(null)}
                    description="Ushbu mahsulotni skladdan butunlay o'chirib tashlamoqchimisiz?"
                />
            )}
        </div>
    )
}

