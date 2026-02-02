
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
