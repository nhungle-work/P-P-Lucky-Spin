export default function Logo({ className = "" }: { className?: string }) {
  return (
    <img 
      src="/logo-light.png" 
      alt="Phuoc & Partners Logo" 
      className={`object-contain ${className}`}
    />
  );
}

