import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 transform transition-all scale-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 text-red-600">
            <div className="bg-red-50 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          </div>
          
          <p className="text-slate-600 mb-8 leading-relaxed text-base">
            {message}
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-slate-700 font-medium hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200 outline-none"
            >
              Não
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 outline-none"
            >
              Sim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};