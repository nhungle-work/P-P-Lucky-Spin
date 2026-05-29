import { useNavigate } from "react-router-dom";

import Logo from "../components/Logo";
import PrizeIcon from "../components/PrizeIcon";

export default function Splash() {
  const navigate = useNavigate();

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-gutter text-center max-w-[480px] mx-auto animate-fade-in">
      <div className="absolute inset-0 z-0 bg-transparent pointer-events-none">
        <div className="absolute top-[15%] left-[5%] animate-float opacity-40" style={{ animationDelay: '0s' }}>
          <PrizeIcon id="tag" className="w-16 h-16 drop-shadow-lg" />
        </div>
        <div className="absolute bottom-[25%] right-[5%] animate-float opacity-40" style={{ animationDelay: '1.5s' }}>
          <PrizeIcon id="notebook" className="w-20 h-20 drop-shadow-lg" />
        </div>
        <div className="absolute top-[35%] right-[2%] animate-float opacity-40" style={{ animationDelay: '3s' }}>
          <PrizeIcon id="combo" className="w-24 h-24 drop-shadow-lg" />
        </div>
        <div className="absolute top-[60%] left-[2%] animate-float opacity-40" style={{ animationDelay: '2s' }}>
          <PrizeIcon id="tag" className="w-12 h-12 drop-shadow-lg" />
        </div>
      </div>

      <div className="mb-lg animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <Logo className="w-48 h-auto drop-shadow-[0_0_30px_rgba(137,206,255,0.3)] rounded-xl" />
      </div>

      <div className="space-y-sm mb-xl animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
        <h1 className="font-display-lg-mobile text-[36px] leading-[1.1] text-primary tracking-tight font-extrabold px-4 uppercase">
          THỬ VẬN MAY — <br/>
          <span className="text-brand-yellow">NHẬN QUÀ "BAY"</span>
        </h1>
        <p className="font-subheading text-[18px] text-on-surface-variant/80 px-8">
          Chỉ có tại Diễn đàn Lao động Việt Nam 2026
        </p>
      </div>

      <div className="w-full px-md flex flex-col items-center gap-md animate-slide-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
        <button 
          onClick={() => navigate('/form')}
          className="w-full py-md bg-brand-yellow hover:bg-yellow-400 text-brand-blue-deep font-button-text text-[16px] font-bold rounded-full uppercase shadow-[0_0_15px_rgba(255,198,11,0.4)] animate-pulse-glow active:scale-95 transition-all duration-300"
        >
          THAM GIA NGAY
        </button>
      </div>

      <div className="absolute bottom-base w-full text-center text-on-surface-variant/40 font-label-bold text-[10px] tracking-widest mt-xl">
        PHUOC & PARTNERS • LEGAL TECH GIVEAWAY • V1.0.0
      </div>
    </main>
  );
}
