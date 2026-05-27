export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center bg-black p-2 ${className}`}>
      <div className="bg-white px-2 py-1 flex items-center justify-center">
        <span className="font-serif text-black font-bold text-[32px] leading-none tracking-tighter shrink-0" style={{ fontFamily: 'Georgia, serif' }}>
          P<span className="text-[16px] mx-[-4px] translate-y-2 inline-block">&amp;</span>P
        </span>
      </div>
      <div className="mt-2 text-white font-serif text-[18px] tracking-wide leading-none" style={{ fontFamily: 'Georgia, serif' }}>
        Phuoc &amp; Partners
      </div>
      <div className="mt-1 text-white text-[8px] uppercase tracking-[0.2em] opacity-80 font-sans leading-none pb-1">
        Attorney at Law
      </div>
    </div>
  );
}
