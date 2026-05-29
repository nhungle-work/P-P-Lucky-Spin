import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Prize } from '../types';

import Logo from '../components/Logo';
import PrizeIcon from '../components/PrizeIcon';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const prize = location.state?.prize as Prize;
  const [showConsultModal, setShowConsultModal] = useState(false);

  const handleReset = async () => {
    navigate('/');
  };

  useEffect(() => {
    if (!prize) {
      navigate('/form');
      return;
    }

    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffc60b', '#89ceff', '#acc7ff', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffc60b', '#89ceff', '#acc7ff', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [prize, navigate]);

  if (!prize) return null;

  return (
    <main className="w-full max-w-[480px] mx-auto min-h-screen relative z-20 flex flex-col items-center gap-lg text-center p-gutter overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full opacity-20 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-container blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container blur-[120px] rounded-full"></div>
      </div>

      <header className="w-full rounded-xl border border-secondary/30 bg-surface/40 backdrop-blur-md px-gutter py-base z-50 flex justify-between items-center shadow-[0_0_20px_rgba(137,206,255,0.2)]">
        <div className="flex items-center gap-sm">
          <Logo className="h-8 w-auto" />
          <span className="font-display-lg-mobile text-[18px] font-extrabold text-white tracking-tight">P&P Lucky Spin</span>
        </div>
      </header>

      <div className="mt-xl flex flex-col gap-xs animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <h1 className="font-display-lg-mobile text-[48px] text-brand-yellow drop-shadow-[0_0_15px_rgba(255,198,11,0.5)] leading-tight font-black">
          CHÚC MỪNG!
        </h1>
      </div>

      <div className="glass-panel w-full p-md rounded-[24px] flex flex-col items-center gap-md relative overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-yellow to-transparent"></div>
        
        <div className="relative w-48 h-48 flex items-center justify-center animate-float">
          <div className="absolute inset-0 bg-brand-yellow opacity-10 blur-2xl rounded-full"></div>
          {/* Mockup prize image depending on product */}
          <div className="w-40 h-40 bg-surface-container-high rounded-xl z-10 flex items-center justify-center border border-secondary/30 drop-shadow-[0_0_20px_rgba(255,198,11,0.4)] p-4">
             <PrizeIcon id={prize.id} className="w-full h-full object-contain" />
          </div>
          
          <div className="absolute bottom-2 right-2 bg-brand-yellow text-brand-blue-deep p-2 rounded-full shadow-lg z-20">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>card_giftcard</span>
          </div>
        </div>

        <div className="flex flex-col gap-xs">
          <p className="font-body text-[16px] text-white">Bạn đã trúng:</p>
          <h2 className="font-display-lg-mobile text-[32px] text-white leading-tight px-sm font-bold">
            {prize.name}
          </h2>
        </div>

        <div className="w-16 h-[2px] bg-outline-variant/30 rounded-full my-2"></div>

        <div className="flex items-start gap-sm text-left bg-surface-container-high/50 p-sm rounded-lg border border-outline-variant/20">
          <span className="material-symbols-outlined text-secondary">info</span>
          <p className="font-label-bold font-bold text-[14px] text-white leading-relaxed">
            Vui lòng giữ màn hình này gặp nhân viên <span className="text-secondary">Phuoc & Partners</span> tại booth để nhận quà.
          </p>
        </div>

        <button 
          onClick={() => setShowConsultModal(true)}
          className="mt-xs w-full py-sm border border-brand-yellow/50 text-brand-yellow font-bold rounded-lg uppercase tracking-wider hover:bg-brand-yellow/10 transition-colors text-[13px]"
        >
          Nhận tư vấn luật lao động miễn phí
        </button>
      </div>

      <footer className="flex flex-col gap-md w-full pb-xl mt-auto pt-8 animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
        <p className="font-body text-[14px] text-white/60 px-md">
          Cảm ơn bạn đã ghé thăm booth của <span className="font-bold text-secondary">Phuoc & Partners</span> tại Vietnam Labour Forum 2026!
        </p>
        
        <div className="flex justify-center gap-md">
          {[
             { icon: 'language', label: 'Website', link: 'https://phuoc-partner.com/' },
             { icon: 'thumb_up', label: 'Facebook', link: 'https://www.facebook.com/PhuocPartners/' },
             { icon: 'work', label: 'LinkedIn', link: 'https://www.linkedin.com/company/phuoc-partners-law-firm/?viewAsMember=true' }
          ].map((item, idx) => (
             <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-xs cursor-pointer group no-underline">
               <div className="w-12 h-12 rounded-full border border-secondary/30 flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                 <span className="material-symbols-outlined text-secondary">{item.icon}</span>
               </div>
               <span className="font-label-bold font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">{item.label}</span>
             </a>
          ))}
        </div>
      </footer>

      {/* Consultation Modal */}
      {showConsultModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-gutter animate-fade-in">
          <div className="bg-[#002e68] border border-brand-yellow/30 rounded-2xl p-lg w-full max-w-[340px] flex flex-col items-center text-center gap-md shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-yellow to-transparent"></div>
            
            <div className="w-16 h-16 rounded-full bg-brand-yellow/20 flex items-center justify-center mb-xs">
              <span className="material-symbols-outlined text-brand-yellow text-[32px]">support_agent</span>
            </div>
            
            <h3 className="font-headline-md text-[20px] font-bold text-white leading-tight">
              Tư vấn Pháp luật
            </h3>
            
            <p className="font-body text-[15px] text-white/90 leading-relaxed">
              Hãy đến bàn tư vấn pháp luật lao động tại booth Phuoc & Partners nhé
            </p>
            
            <button 
              onClick={handleReset}
              className="mt-sm w-full py-sm bg-brand-yellow text-brand-blue-deep font-bold rounded-lg uppercase tracking-wider hover:opacity-90 transition-opacity text-[14px]"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
