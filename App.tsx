import React, { useState, useEffect, useCallback } from 'react';
import { CylinderSVG, StickBundleSVG, StickSVG } from './components/Visuals';
import { generateFortune } from './services/geminiService';
import { FortuneResult, GameState } from './types';
import { Loader2, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Pre-load audio if we were adding sound, but sticking to visual only for now.

  const handleDraw = useCallback(async () => {
    if (gameState !== GameState.IDLE) return;

    setGameState(GameState.SHAKING);
    
    // Start generating fortune immediately
    const fortunePromise = generateFortune();
    
    // Ensure animation plays for at least 2 seconds for effect
    const minTimePromise = new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const [result] = await Promise.all([fortunePromise, minTimePromise]);
      setFortune(result);
      setGameState(GameState.DROPPING);
      
      // Wait for drop animation to finish before showing modal
      setTimeout(() => {
        setGameState(GameState.RESULT);
        setShowModal(true);
      }, 1200);
      
    } catch (e) {
      console.error(e);
      setGameState(GameState.IDLE);
      alert("Something went wrong. Please try again.");
    }
  }, [gameState]);

  const resetGame = () => {
    setShowModal(false);
    // Short delay to allow modal close animation if we had one
    setTimeout(() => {
      setGameState(GameState.IDLE);
      setFortune(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2c0b0e] to-[#4a1216] flex flex-col items-center justify-between py-8 px-4 relative overflow-hidden">
      
      {/* Ambient background particles/decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 text-8xl font-serif text-red-500">福</div>
        <div className="absolute bottom-20 right-10 text-8xl font-serif text-red-500">運</div>
      </div>

      {/* Header */}
      <header className="z-10 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-calligraphy text-amber-400 drop-shadow-lg mb-2 tracking-widest">
          Tina吉时问签
        </h1>
        <p className="text-amber-200/80 font-serif text-sm md:text-base">
          诚心祈求 · 指点迷津
        </p>
      </header>

      {/* Main Interactive Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-lg perspective-1000">
        
        {/* The Sticks Bundle (moves with container) */}
        <div className={`
          absolute z-0 transition-transform duration-100
          ${gameState === GameState.SHAKING ? 'animate-shake' : ''}
          ${gameState === GameState.DROPPING ? 'translate-y-4' : 'translate-y-8'}
        `}
        style={{ top: '25%' }} // Position relative to container
        >
           <StickBundleSVG className="transform -translate-x-1/2 left-1/2" />
        </div>

        {/* The Falling Stick (Only visible during dropping phase) */}
        {gameState === GameState.DROPPING && (
          <div className="absolute z-20 animate-drop-stick" style={{ top: '30%' }}>
             <StickSVG className="w-6 h-64 shadow-xl" />
          </div>
        )}

        {/* The Container (Cylinder) */}
        <div className={`
          relative z-10 w-48 md:w-64 transition-transform duration-100 origin-bottom
          ${gameState === GameState.SHAKING ? 'animate-shake' : ''}
        `}>
          <CylinderSVG className="w-full h-auto drop-shadow-2xl" />
        </div>

      </div>

      {/* Controls */}
      <div className="z-20 w-full max-w-xs text-center mt-12 mb-8">
        {gameState === GameState.IDLE ? (
          <button
            onClick={handleDraw}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 rounded-full font-serif text-xl shadow-[0_4px_14px_0_rgba(251,191,36,0.39)] transition-all transform active:scale-95 border border-amber-400/30"
          >
            开始抽签
          </button>
        ) : (
          <div className="text-amber-200/60 font-serif animate-pulse flex items-center justify-center gap-2">
            {gameState === GameState.SHAKING && (
               <>
                 <Loader2 className="animate-spin w-4 h-4" />
                 <span>诚心祈祷，摇签中...</span>
               </>
            )}
            {gameState === GameState.DROPPING && <span>灵签掉落...</span>}
            {gameState === GameState.RESULT && <span>解签中...</span>}
          </div>
        )}
      </div>

      {/* Result Modal / Overlay */}
      {showModal && fortune && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#fdf6e3] text-[#2c0b0e] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl relative border-8 border-double border-[#8c4b20]">
            
            <button 
              onClick={resetGame}
              className="absolute top-4 right-4 p-2 text-[#8c4b20] hover:bg-[#8c4b20]/10 rounded-full transition-colors"
            >
              <RefreshCcw size={24} />
            </button>

            <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center md:items-start">
              
              {/* Left Side: The Visual Stick */}
              <div className="flex-shrink-0 flex flex-col items-center">
                 <div className="bg-[#d4a373] border-2 border-[#8c4b20] w-16 h-80 md:h-96 rounded shadow-inner flex flex-col items-center py-4 relative">
                    <div className="w-10 h-10 border-2 border-[#8c4b20] rounded-full flex items-center justify-center mb-4">
                      <span className="font-bold text-[#8c4b20] font-serif">{fortune.signLevel}</span>
                    </div>
                    
                    {/* Vertical Title on Stick */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 writing-vertical-rl text-2xl font-calligraphy text-[#5c2e14] tracking-[0.5em] py-4 select-none">
                      {fortune.title}
                    </div>
                    
                    <div className="mt-4 text-xs text-[#8c4b20]/50 font-serif">
                       Tina吉时问签
                    </div>
                 </div>
              </div>

              {/* Right Side: Interpretation */}
              <div className="flex-1 space-y-6 text-center md:text-left">
                
                <div className="space-y-2">
                  <div className="inline-block px-3 py-1 bg-[#aa0000] text-amber-100 text-sm font-bold rounded-sm mb-2">
                    {fortune.signLevel}
                  </div>
                  <h2 className="text-3xl font-calligraphy text-[#8c4b20]">
                    {fortune.title}
                  </h2>
                </div>

                {/* Poem Grid */}
                <div className="bg-[#e6d5c1]/30 p-6 rounded-lg border border-[#d4a373]">
                   <div className="grid grid-cols-1 gap-2 text-lg md:text-xl font-serif text-[#5c2e14] leading-loose">
                      {fortune.poem.map((line, i) => (
                        <p key={i} className="tracking-widest border-b border-[#d4a373]/30 pb-2 last:border-0 last:pb-0">
                          {line}
                        </p>
                      ))}
                   </div>
                </div>

                {/* Interpretation */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#8c4b20] flex items-center justify-center md:justify-start gap-2">
                    <span className="w-1 h-6 bg-[#aa0000] block"></span>
                    <span>圣意解读</span>
                  </h3>
                  <p className="text-[#3f1d0b] leading-relaxed text-justify">
                    {fortune.explanation}
                  </p>
                </div>

                {/* Lucky Numbers (Optional) */}
                {fortune.luckyNumbers && (
                   <div className="pt-4 border-t border-[#d4a373]">
                      <span className="text-[#8c4b20] font-bold text-sm">幸运数字: </span>
                      <span className="text-[#aa0000] font-serif ml-2">{fortune.luckyNumbers}</span>
                   </div>
                )}

                <div className="pt-6 md:hidden">
                   <button
                    onClick={resetGame}
                    className="w-full py-3 border border-[#8c4b20] text-[#8c4b20] hover:bg-[#8c4b20] hover:text-white rounded transition-colors font-serif"
                   >
                     谢签重来
                   </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;