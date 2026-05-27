import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getInventory, submitLead } from '../lib/api';
import { Inventory, LeadData, Prize } from '../types';
import Logo from '../components/Logo';

const prizesLookup = [
  { id: 'tag', name: "Tag hành lý", icon: "tag" },
  { id: 'notebook', name: "Sổ tay Phuoc & Partners", icon: "menu_book" },
  { id: 'combo', name: "Combo nhân sự", icon: "folder_shared" },
  { id: 'combo', name: "Combo nhân sự", icon: "folder_shared" },
  { id: 'tag', name: "Tag hành lý", icon: "tag" },
  { id: 'tag', name: "Tag hành lý", icon: "tag" },
  { id: 'combo', name: "Combo nhân sự", icon: "folder_shared" },
  { id: 'tag', name: "Tag hành lý", icon: "tag" },
  { id: 'combo', name: "Combo nhân sự", icon: "folder_shared" },
  { id: 'combo', name: "Combo nhân sự", icon: "folder_shared" }
];

export default function SpinWheel() {
  const location = useLocation();
  const navigate = useNavigate();
  const lead = location.state?.lead as LeadData;

  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!lead) {
      navigate('/form');
      return;
    }
    loadInventory();
  }, [lead, navigate]);

  const loadInventory = async () => {
    try {
      const inv = await getInventory();
      setInventory(inv);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    try {
      const response = await submitLead(lead);
      const prizeId = response.prize.id;
      
      // Find index of prize in wheel to stop at
      // We'll pick a random matching segment from our lookup array
      const matchingIndices = prizesLookup.map((p, i) => p.id === prizeId ? i : -1).filter(i => i !== -1);
      const targetIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
      
      // 10 segments -> 36 degrees per segment
      const segmentAngle = 36;
      // The pointer is at the top (0 degrees).
      // We want the target segment to land at 0/-360 mode.
      const targetRotation = 360 - (targetIndex * segmentAngle);
      
      const extraSpins = 5; // Spin 5 full times
      const newRotation = rotation + (extraSpins * 360) + targetRotation - (rotation % 360);
      
      setRotation(newRotation);

      setTimeout(() => {
        setIsSpinning(false);
        navigate('/result', { state: { prize: response.prize } });
      }, 4500); // Wait for animation to finish
      
    } catch (e: any) {
      alert(e.message || "Có lỗi xảy ra");
      setIsSpinning(false);
    }
  };

  return (
    <main className="w-full max-w-[480px] mx-auto px-md pt-24 pb-xl flex flex-col items-center animate-fade-in">
      
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[448px] rounded-xl border border-secondary/30 bg-surface/40 backdrop-blur-md z-50 flex justify-between items-center px-gutter py-base shadow-[0_0_20px_rgba(137,206,255,0.2)]">
        <div className="flex items-center gap-base">
          <Logo className="h-8 w-auto" />
          <span className="font-display-lg-mobile text-[18px] font-extrabold text-white tracking-tight">P&P Lucky Spin</span>
        </div>
      </nav>

      <header className="w-full mb-lg text-center mt-8">
        <h1 className="font-headline-md text-[24px] font-bold text-white">Chào <span className="text-brand-yellow font-bold">{lead?.name.split(' ').pop()}</span>,</h1>
        <p className="font-body text-[16px] text-white mt-xs">Chúc bạn gặp nhiều may mắn hôm nay!</p>
      </header>

      <section className="relative mb-xl flex flex-col items-center">
        {/* Pointer */}
        <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 w-10 h-12 z-40 drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[35px] border-brand-yellow relative">
            <div className="absolute top-[-40px] left-[-8px] w-4 h-4 bg-[#ffd700] rounded-full border-2 border-brand-blue-deep"></div>
          </div>
        </div>

        {/* Wheel Container */}
        <div className="w-[340px] h-[340px] rounded-full bg-gradient-to-br from-[#ffd700] to-[#b8860b] p-2 relative shadow-[0_10px_40px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.5)]">
          
          {/* Rivets */}
          {[...Array(16)].map((_, i) => {
             const angle = (i * 360 / 16) * (Math.PI / 180);
             const radius = 162;
             const x = Math.cos(angle) * radius;
             const y = Math.sin(angle) * radius;
             return (
               <div key={i} className="absolute w-[6px] h-[6px] bg-white rounded-full top-1/2 left-1/2 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" 
                    style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }} />
             );
          })}

          <div 
            className="w-full h-full bg-[#002e68] rounded-full overflow-hidden relative border-4 border-[#001a40] transition-transform"
            style={{ 
              transform: `rotate(${rotation}deg)`, 
              transitionDuration: isSpinning ? '4s' : '0s',
              transitionTimingFunction: 'cubic-bezier(0.15, 0, 0.15, 1)'
            }}
          >
            {prizesLookup.map((prize, index) => {
              const segmentAngle = 36;
              const skew = 90 - segmentAngle;
              return (
                <div key={index} className="absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center border-r border-white/20"
                     style={{
                       transform: `rotate(${index * segmentAngle}deg) skewY(${skew}deg)`,
                       backgroundColor: index % 2 === 0 ? '#184d99' : '#00aaf2'
                     }}>
                  <div className="flex flex-col items-center gap-1"
                       style={{ transform: `skewY(-${skew}deg) rotate(${segmentAngle/2}deg) translateY(-85px)` }}>
                    <span className="material-symbols-outlined text-white text-[28px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">{prize.icon}</span>
                    <span className="text-white text-[10px] font-bold uppercase text-center max-w-[60px] leading-[1.1] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      {prize.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-[radial-gradient(circle,#ffecb3_0%,#ffc60b_60%,#b8860b_100%)] border-4 border-[#002e68] z-30 shadow-[0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center">
            <div className="w-[30px] h-[30px] rounded-full bg-[#184d99] border-2 border-brand-yellow"></div>
          </div>
        </div>
      </section>

      <div className="w-full flex flex-col gap-md items-center">
        <button 
          onClick={handleSpin}
          disabled={isSpinning}
          className={`w-full py-md rounded-xl font-button-text font-bold text-[20px] uppercase tracking-widest transition-all duration-300 bg-brand-yellow text-brand-blue-deep ${!isSpinning ? 'animate-pulse-active hover:scale-[1.02]' : 'opacity-80 scale-95'}`}
        >
          {isSpinning ? "ĐANG QUAY..." : "QUAY NGAY"}
        </button>

        <div className="w-full glass-card rounded-xl p-md flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-label-bold font-bold text-white">Phần thưởng còn lại</h3>
            <span className="material-symbols-outlined text-secondary text-[20px]">inventory_2</span>
          </div>

          <div className="grid grid-cols-1 gap-sm">
            <div className="flex justify-between items-center p-sm rounded-lg bg-surface-container-highest/50 border border-outline-variant/30">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-brand-yellow">tag</span>
                <span className="font-label-bold font-bold text-[13px] text-white">Tag hành lý</span>
              </div>
              <span className="bg-secondary-container/80 border border-white/20 backdrop-blur-sm px-sm py-1 rounded-full text-[12px] font-bold text-white">
                {inventory?.tag ?? '-'} còn lại
              </span>
            </div>
            <div className="flex justify-between items-center p-sm rounded-lg bg-surface-container-highest/50 border border-outline-variant/30">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-brand-yellow">menu_book</span>
                <span className="font-label-bold font-bold text-[13px] text-white">Sổ tay Phuoc & Partners</span>
              </div>
              <span className="bg-secondary-container/80 border border-white/20 backdrop-blur-sm px-sm py-1 rounded-full text-[12px] font-bold text-white">
                 {inventory?.notebook ?? '-'} còn lại
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
