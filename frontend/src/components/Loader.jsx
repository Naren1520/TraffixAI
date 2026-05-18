import React, { useEffect, useState } from 'react';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); // Wait a bit at 100%
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center">
      {/* Logo or Icon */}
      <div className="mb-12 flex flex-col items-center opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
        <div className="w-20 h-20 rounded-full border border-[#222] bg-[#0A0A0A] flex items-center justify-center mb-6 overflow-hidden">
          <img src="/logo1.png" alt="TraffixAI" className="w-16 h-16 object-cover rounded-full" />
        </div>
        <h1 className="text-3xl font-light tracking-[0.2em] text-white">TRAFFIX<span className="font-bold">AI</span></h1>
        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-[#666]">Initializing System</p>
      </div>

      {/* Progress Line */}
      <div className="w-64 max-w-[80vw] h-[1px] bg-[#222] relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-4 tabular-nums text-xs text-[#555] tracking-widest font-mono">
        {progress.toString().padStart(3, '0')}%
      </div>
    </div>
  );
};

export default Loader;
