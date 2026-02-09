
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
  isDataReady: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, isDataReady }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [startFadeOut, setStartFadeOut] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  const [minTimeReached, setMinTimeReached] = useState(false);

  // アニメーションステップ（マウント時に1回だけ実行）
  useEffect(() => {
    const steps = [
      setTimeout(() => setAnimationStep(1), 400),  // 基礎の光
      setTimeout(() => setAnimationStep(2), 900),  // KUMANO
      setTimeout(() => setAnimationStep(3), 1400), // AI
      setTimeout(() => setAnimationStep(4), 1900), // STUDIO
      setTimeout(() => setAnimationStep(5), 2800), // Status Indicator
    ];

    const minTimer = setTimeout(() => setMinTimeReached(true), 4200);

    return () => {
      steps.forEach(clearTimeout);
      clearTimeout(minTimer);
    };
  }, []);

  // データ準備完了 & 最低表示時間経過で退出
  useEffect(() => {
    if (isDataReady && minTimeReached) {
      handleExit();
    }
  }, [isDataReady, minTimeReached]);

  const handleExit = () => {
    setStartFadeOut(true);
    // 退出アニメーションを1.5秒から1.2秒に微調整
    setTimeout(() => {
      setIsVisible(false);
      onFinish();
    }, 1200);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white overflow-hidden transition-all duration-[1200ms] cubic-bezier(0.23, 1, 0.32, 1) ${
      startFadeOut ? 'opacity-0 scale-110 blur-2xl' : 'opacity-100'
    }`}>

      {/* 背景：Vibrant Orange Energy Mesh */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#FFFFFF_0%,_#FFF9F5_100%)]`}></div>

        {/* 動的なエネルギーオーブ */}
        <div className="absolute top-[10%] left-[10%] w-[70%] h-[70%] rounded-full bg-[#FF4D00] mix-blend-soft-light filter blur-[120px] opacity-20 animate-[pulse_10s_infinite_alternate]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[70%] h-[70%] rounded-full bg-[#FFB800] mix-blend-soft-light filter blur-[120px] opacity-15 animate-[pulse_12s_infinite_alternate-reverse]"></div>

        {/* オレンジのパーティクル蒸散エフェクト */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noise'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}></div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1) translate(0, 0); opacity: 0.1; }
          100% { transform: scale(1.3) translate(5%, 5%); opacity: 0.3; }
        }
        .signature-text {
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
          letter-spacing: -0.02em;
          line-height: 0.9;
          font-weight: 900;
          color: #1A1A1A;
          position: relative;
        }
        .signature-text::after {
          content: attr(data-text);
          position: absolute;
          left: 0; top: 0;
          z-index: -1;
          color: transparent;
          text-shadow: 0 0 30px rgba(255, 77, 0, 0.4);
          opacity: 0;
          transition: opacity 1.5s ease-out;
        }
        .text-visible::after {
          opacity: 1;
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center">

        {/* 統一されたロゴブロック */}
        <div className="flex flex-col items-center select-none text-center space-y-4">
          <div
            data-text="KUMANO"
            className={`signature-text text-7xl sm:text-9xl transition-all duration-[1500ms] cubic-bezier(0.19, 1, 0.22, 1) ${
              animationStep >= 2 ? 'opacity-100 translate-y-0 blur-0 text-visible' : 'opacity-0 translate-y-8 blur-lg'
            }`}
          >
            KUMANO
          </div>

          <div
            data-text="AI"
            className={`signature-text text-7xl sm:text-9xl transition-all duration-[1500ms] delay-[150ms] cubic-bezier(0.19, 1, 0.22, 1) ${
              animationStep >= 3 ? 'opacity-100 translate-y-0 blur-0 text-visible' : 'opacity-0 translate-y-8 blur-lg'
            }`}
          >
            AI
          </div>

          <div
            data-text="STUDIO"
            className={`signature-text text-7xl sm:text-9xl transition-all duration-[1500ms] delay-[300ms] cubic-bezier(0.19, 1, 0.22, 1) ${
              animationStep >= 4 ? 'opacity-100 translate-y-0 blur-0 text-visible' : 'opacity-0 translate-y-8 blur-lg'
            }`}
          >
            STUDIO
          </div>
        </div>

        {/* プロフェッショナル・インジケーター */}
        <div className={`mt-24 flex flex-col items-center transition-all duration-[1200ms] ${
          animationStep >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex flex-col items-center gap-4">
            <div className="w-40 h-[2px] bg-slate-100 relative rounded-full overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-r from-[#FFB800] via-[#FF4D00] to-[#FFB800] bg-[length:200%_100%] transition-transform duration-[3000ms] ease-out origin-left ${
                isDataReady ? 'translate-x-0' : '-translate-x-full'
              }`}></div>
            </div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[1.2em] ml-[1.2em]">
              {isDataReady ? 'System Primed' : 'Engine Warmup'}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center gap-3 opacity-60">
        <div className="h-6 w-[1px] bg-gradient-to-b from-slate-300 to-transparent"></div>
        <div className="text-[9px] font-black text-slate-400 tracking-[0.6em] uppercase flex items-center gap-2">
          <span className="text-[#FF4D00]">Signature</span> Edition
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
