import React from 'react';
import { RechargeHistoryItem } from '../types';
import { X, Copy, Download, CheckCircle2, ShieldCheck, Smartphone } from 'lucide-react';

interface ReceiptModalProps {
  item: RechargeHistoryItem | null;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ item, onClose, onToast }) => {
  if (!item) return null;

  const handleCopy = () => {
    const text = `=== COMPROBANTE DE RECARGA ===\nReferencia: ${item.referenceId}\nFecha: ${item.date}\nLínea: ${item.phone}\nPaís: ${item.country}\nOperador: ${item.operator}\nMonto: $${item.amountUsd} USD\nSaldo acreditado: ${item.localAmount}\nEstado: ${item.status}\n==============================`;
    navigator.clipboard.writeText(text);
    onToast('Recibo copiado al portapapeles');
  };

  const handleDownload = () => {
    const text = `COMPROBANTE RECARGAMUNDIAL\n================================\nID Transacción: ${item.referenceId}\nFecha: ${item.date}\nDestinatario: ${item.phone}\nPaís: ${item.country}\nOperador: ${item.operator}\nMonto: $${item.amountUsd} USD\nSaldo recibido: ${item.localAmount}\nEstado: ${item.status}\n================================\nRecargaMundial — Conectando a los tuyos.`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recibo_${item.referenceId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onToast('Comprobante descargado');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020711]/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-md rounded-3xl bg-[#122238] border border-white/20 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.8)] relative text-white"
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#26d39b]/20 text-[#26d39b] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white m-0">Comprobante de Recarga</h3>
              <p className="text-xs text-[#9db0c8]">Transacción confirmada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#a9bad0] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#091522] border border-dashed border-white/20 text-xs sm:text-sm font-mono space-y-2 mb-5">
          <div className="flex justify-between text-[#9db0c8]">
            <span>Referencia:</span>
            <span className="font-bold text-white">{item.referenceId}</span>
          </div>
          <div className="flex justify-between text-[#9db0c8]">
            <span>Fecha y Hora:</span>
            <span className="font-bold text-white">{item.date}</span>
          </div>
          <div className="flex justify-between text-[#9db0c8]">
            <span>Destinatario:</span>
            <span className="font-bold text-white">{item.phone}</span>
          </div>
          <div className="flex justify-between text-[#9db0c8]">
            <span>País / Operador:</span>
            <span className="font-bold text-[#60b6ff]">{item.country} · {item.operator}</span>
          </div>
          <div className="flex justify-between text-[#9db0c8]">
            <span>Monto USD:</span>
            <span className="font-bold text-white">${item.amountUsd}.00 USD</span>
          </div>
          <div className="flex justify-between text-[#9db0c8]">
            <span>Saldo Recibido:</span>
            <span className="font-bold text-[#26d39b]">{item.localAmount}</span>
          </div>
          <div className="flex justify-between text-[#9db0c8] pt-2 border-t border-white/10">
            <span>Estado:</span>
            <span className="font-extrabold text-[#26d39b]">{item.status} ✓</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={handleCopy}
            className="py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar</span>
          </button>
          <button
            onClick={handleDownload}
            className="py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/[0.1] hover:bg-white/[0.15] text-xs font-bold text-[#c9d8e8] transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
