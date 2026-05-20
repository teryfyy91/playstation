import { AlertTriangle } from 'lucide-react'

export default function DeleteConfirmModal({ onConfirm, onCancel, title = "O'chirishni Tasdiqlash", description = "Haqiqatan ham ushbu ma'lumotni o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi." }) {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-[#1a1630] border border-[#2d2556] rounded-[32px] p-8 w-full max-w-sm shadow-2xl animate-scaleUp text-center my-auto relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full -mr-16 -mt-16"></div>

                <div className="w-20 h-20 rounded-[24px] bg-red-600/10 flex items-center justify-center mx-auto mb-6 text-red-500 shadow-inner">
                    <AlertTriangle size={40} />
                </div>

                <h3 className="text-white font-black text-xl mb-3 uppercase tracking-tight">{title}</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed px-2">{description}</p>

                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-4 rounded-2xl bg-[#0f0c1e] border border-[#2d2556] text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white hover:bg-[#2d2556] transition-all cursor-pointer"
                    >
                        Bekor Qilish
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-900/40 hover:bg-red-500 transform active:scale-95 transition-all cursor-pointer"
                    >
                        Ha, O'chirish
                    </button>
                </div>
            </div>
        </div>
    )
}
