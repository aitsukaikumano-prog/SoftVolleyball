
import React from 'react';
import { UserRole } from '../types';

interface AdminToolsProps {
  onReset: () => void;
  onClose: () => void;
  role: UserRole;
}

const AdminTools: React.FC<AdminToolsProps> = ({ onReset, onClose, role }) => {
  const baseUrl = window.location.origin + window.location.pathname;
  const adminUrl = `${baseUrl}?role=admin`;
  const generalUrl = `${baseUrl}?role=general`;

  const shareText = '矢野町内混成ソフトバーレーボール大会 - リアルタイムスコア速報';
  const shareUrl = baseUrl;

  const shareToX = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToLINE = () => {
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToInstagram = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    window.open('https://www.instagram.com/', '_blank');
  };

  const qrAdmin = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(adminUrl)}`;
  const qrGeneral = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(generalUrl)}`;

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-800">大会を共有する</h3>
            <button onClick={onClose} className="text-slate-400 p-2"><i className="fas fa-times"></i></button>
          </div>

          {role === UserRole.ADMIN ? (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-indigo-50 p-4 rounded-2xl text-center">
                <span className="text-[10px] font-black text-indigo-600 uppercase mb-2 block">運営用 (入力可)</span>
                <img src={qrAdmin} alt="Admin QR" className="w-full aspect-square bg-white p-2 rounded-lg mb-3" />
                <button
                  onClick={() => { navigator.clipboard.writeText(adminUrl); alert('URLをコピーしました'); }}
                  className="text-[10px] font-bold text-indigo-500 underline"
                >
                  URLをコピー
                </button>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center">
                <span className="text-[10px] font-black text-slate-500 uppercase mb-2 block">一般用 (閲覧のみ)</span>
                <img src={qrGeneral} alt="General QR" className="w-full aspect-square bg-white p-2 rounded-lg mb-3" />
                <button
                  onClick={() => { navigator.clipboard.writeText(generalUrl); alert('URLをコピーしました'); }}
                  className="text-[10px] font-bold text-slate-500 underline"
                >
                  URLをコピー
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-8">
              <div className="bg-slate-50 p-6 rounded-2xl text-center max-w-xs w-full">
                <span className="text-[10px] font-black text-slate-500 uppercase mb-2 block">一般用 (閲覧のみ)</span>
                <img src={qrGeneral} alt="General QR" className="w-full aspect-square bg-white p-2 rounded-lg mb-3" />
                <button
                  onClick={() => { navigator.clipboard.writeText(generalUrl); alert('URLをコピーしました'); }}
                  className="text-[10px] font-bold text-slate-500 underline"
                >
                  URLをコピー
                </button>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">SNSで共有</h4>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={shareToInstagram}
                className="flex flex-col items-center justify-center gap-2 h-20 rounded-2xl text-white active:scale-95 transition"
                style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
              >
                <div className="h-6 flex items-center justify-center"><i className="fab fa-instagram text-lg"></i></div>
                <span className="text-[10px] font-bold">Instagram</span>
              </button>
              <button
                onClick={shareToX}
                className="flex flex-col items-center justify-center gap-2 h-20 bg-slate-900 rounded-2xl text-white active:scale-95 transition"
              >
                <div className="h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-bold">X</span>
              </button>
              <button
                onClick={shareToLINE}
                className="flex flex-col items-center justify-center gap-2 h-20 bg-[#06C755] rounded-2xl text-white active:scale-95 transition"
              >
                <div className="h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                  </svg>
                </div>
                <span className="text-[10px] font-bold">LINE</span>
              </button>
            </div>
          </div>

          {role === UserRole.ADMIN && (
            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-black text-red-500 uppercase mb-3">危険な操作</h4>
              <button 
                onClick={onReset}
                className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm active:bg-red-100 transition"
              >
                データをすべてリセット
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTools;
