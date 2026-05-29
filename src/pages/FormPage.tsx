import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkPhone } from '../lib/api';
import Logo from '../components/Logo';

export default function FormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', company: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = () => {
    if (!formData.fullName.trim() || formData.fullName.length < 2) return false;
    if (!formData.phone.trim() || formData.phone.length < 10 || !formData.phone.startsWith('0')) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return false;
    if (!formData.company.trim() || formData.company.length < 2) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const exists = await checkPhone(formData.phone);
      if (exists) {
        setError('Số điện thoại này đã tham gia! Mỗi người chỉ được quay 1 lần.');
        setIsSubmitting(false);
        return;
      }
      
      // Store in location state to pass to SpinWheel
      navigate('/spin', { state: { lead: { 
        name: formData.fullName, 
        phone: formData.phone, 
        email: formData.email, 
        company: formData.company 
      }}});
    } catch (err: any) {
      setError(`Lỗi: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow w-full max-w-[480px] mx-auto px-gutter py-lg animate-fade-in">
      <header className="flex flex-col items-center mb-xl">
        <div className="w-48 h-auto mb-md relative flex justify-center">
          <div className="absolute inset-0 bg-primary opacity-20 blur-2xl rounded-full"></div>
          <Logo className="rounded-xl w-32 drop-shadow-[0_0_30px_rgba(137,206,255,0.3)] relative z-10" />
        </div>
        <h1 className="font-display-lg-mobile text-[36px] text-center text-[#15b0f8] font-extrabold mb-xs">P&P Lucky Spin</h1>
        <p className="font-subheading text-[18px] font-semibold text-white text-center px-md">Vietnam Labour Forum 2026</p>
      </header>

      <div className="glass-card rounded-xl p-md mb-lg">
        <div className="mb-lg">
          <h2 className="font-headline-md text-[24px] font-bold text-[#15b0f8] mb-xs">Thông Tin Tham Gia</h2>
          <p className="font-label-bold text-[14px] text-white">Vui lòng cung cấp thông tin để tham gia vòng quay.</p>
        </div>

        {error && (
          <div className="mb-md p-sm bg-error-container/20 border border-error/50 rounded-lg text-error text-center font-label-bold text-[14px]">
            {error}
          </div>
        )}

        <form className="space-y-md" onSubmit={handleSubmit}>
          <div className="space-y-xs">
            <label className="block font-label-bold text-[14px] font-bold text-white ml-xs">Họ và tên</label>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg py-sm px-md font-body text-[16px] text-white placeholder-white/40 focus:ring-0 focus:border-secondary transition-all outline-none input-glow" 
                placeholder="Nguyễn Văn A" required type="text"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
              <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-white" style={{ fontSize: '18px' }}>person</span>
            </div>
          </div>
          
          <div className="space-y-xs">
            <label className="block font-label-bold text-[14px] font-bold text-white ml-xs">Số điện thoại</label>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg py-sm px-md font-body text-[16px] text-white placeholder-white/40 focus:ring-0 focus:border-secondary transition-all outline-none input-glow" 
                placeholder="09xx xxx xxx" required type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-white" style={{ fontSize: '18px' }}>call</span>
            </div>
            <p className="text-[12px] text-white/60 ml-xs mt-1">Hãy điền số điện thoại đúng để đi tiếp</p>
          </div>

          <div className="space-y-xs">
            <label className="block font-label-bold text-[14px] font-bold text-white ml-xs">Email</label>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg py-sm px-md font-body text-[16px] text-white placeholder-white/40 focus:ring-0 focus:border-secondary transition-all outline-none input-glow" 
                placeholder="example@company.com" required type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-white" style={{ fontSize: '18px' }}>mail</span>
            </div>
            <p className="text-[12px] text-white/60 ml-xs mt-1">Hãy điền email đúng format để đi tiếp</p>
          </div>

          <div className="space-y-xs">
            <label className="block font-label-bold text-[14px] font-bold text-white ml-xs">Tên công ty</label>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg py-sm px-md font-body text-[16px] text-white placeholder-white/40 focus:ring-0 focus:border-secondary transition-all outline-none input-glow" 
                placeholder="Công ty Phuoc & Partners" required type="text"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
              />
              <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-white" style={{ fontSize: '18px' }}>business</span>
            </div>
          </div>

          <button 
            disabled={!isFormValid() || isSubmitting}
            className="w-full mt-lg py-md rounded-lg font-button-text font-bold text-[16px] uppercase tracking-widest bg-brand-yellow text-brand-blue-deep disabled:bg-surface-container-highest disabled:text-on-surface-variant disabled:cursor-not-allowed transition-all duration-300 btn-glow flex items-center justify-center gap-xs"
            type="submit"
          >
            {isSubmitting ? (
              <><span className="w-4 h-4 border-2 border-brand-blue-deep border-t-transparent rounded-full animate-spin"></span> ĐANG XỬ LÝ...</>
            ) : "TIẾP TỤC"}
          </button>
        </form>
      </div>
    </main>
  );
}
