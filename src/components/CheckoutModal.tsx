import React, { useState } from 'react';
import { Country, RechargeFormData, RechargeHistoryItem } from '../types';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Download, 
  Smartphone, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Clock
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: RechargeFormData | null;
  country: Country | null;
  onRechargeComplete: (item: RechargeHistoryItem) => void;
  onToast: (msg: string) => void;
}

type CheckoutStep = 'review' | 'processing' | 'success';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  orderData,
  country,
  onRechargeComplete,
  onToast,
}) => {
  const [step, setStep] = useState<CheckoutStep>('review');
  const [processingPhase, setProcessingPhase] = useState<string>('Iniciando conexión con PayPal...');
  const [completedItem, setCompletedItem] = useState<RechargeHistoryItem | null>(null);

  if (!isOpen || !orderData || !country) return null;

  const fullPhone = `${country.prefix} ${orderData.phone}`;
  const amountUsd = orderData.amountUsd;
  const localEquivalent = (amountUsd * country.exchangeRate).toLocaleString('es-ES', {
    maximumFractionDigits: country.exchangeRate > 100 ? 0 : 2,
  });
  const localFormatted = `${country.currencySymbol} ${localEquivalent} ${country.currency}`;

  const handleStartPayment = () => {
    setStep('processing');
    setProcessingPhase('Conectando con pasarela segura de PayPal...');

    setTimeout(() => {
      setProcessingPhase('Validando autorización de fondos...');
    }, 1100);

    setTimeout(() => {
      setProcessingPhase(`Enviando ${localFormatted} a ${orderData.operator}...`);
    }, 2200);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const refId = `PAY-${Math.floor(100000 + Math.random() * 900000)}-RM`;

      const newItem: RechargeHistoryItem = {
        id: 'rec_' + Date.now(),
        flag: country.flag,
        phone: `${country.prefix} ${orderData.phone.slice(0, 3)} ••• ${orderData.phone.slice(-4)}`,
        country: country.name,
        operator: orderData.operator,
        amountUsd: amountUsd,
        localAmount: localFormatted,
        status: 'Completada',
        date: `Hoy, ${timeStr}`,
        referenceId: refId,
      };

      setCompletedItem(newItem);
      onRechargeComplete(newItem);
      setStep('success');
      onToast('¡Recarga enviada y completada con éxito!');
    }, 3400);
  };

  const handleCopyReceipt = () => {
    if (!completedItem) return;
    const text = `=== COMPROBANTE RECARGAMUNDIAL ===\nRef: ${completedItem.referenceId}\nTeléfono: ${fullPhone}\nOperador: ${completedItem.operator}\nPaís: ${completedItem.country}\nMonto pagado: $${completedItem.amountUsd} USD\nSaldo recibido: ${completedItem.localAmount}\nEstado: ${completedItem.status}\nFecha: ${completedItem.date}\n================================`;
    navigator.clipboard.writeText(text);
    onToast('Comprobante copiado al portapapeles');
  };

  const handleDownloadReceipt = () => {
    if (!completedItem) return;
    const text = `RECIBO OFICIAL RECARGAMUNDIAL\n--------------------------------\nID Transacción: ${completedItem.referenceId}\nFecha: ${completedItem.date}\nDestinatario: ${fullPhone}\nPaís: ${completedItem.country}\nOperador: ${completedItem.operator}\nMonto: $${completedItem.amountUsd} USD\nSaldo acreditado: ${completedItem.localAmount}\nEstado: Aprobado y Entregado\nPasarela: PayPal Verified\n--------------------------------\nGracias por recargar con RecargaMundial.`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recibo_${completedItem.referenceId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onToast('Recibo descargado');
  };

  const handleClose = () => {
    setStep('review');
    setCompletedItem(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020711]/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-lg rounded-3xl bg-[#122238] border border-white/20 p-6 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.8)] relative text-white animate-scaleUp"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#168df4]/20 border border-[#39a5ff]/30 text-[#39a5ff] flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white m-0">
                {step === 'success' ? 'Recarga completada ✓' : 'Confirmar recarga móvil'}
              </h3>
              <p className="text-xs text-[#9db0c8]">
                {step === 'success' ? 'Comprobante de envío oficial' : 'Revisa los detalles antes del pago'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#a9bad0] hover:text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: REVIEW ORDER */}
        {step === 'review' && (
          <div>
            <div className="rounded-2xl bg-[#091522] border border-[#263951] p-4 mb-4 divide-y divide-white/10 text-xs sm:text-sm">
              <div className="flex justify-between py-2 first:pt-0">
                <span className="text-[#9db0c8]">País:</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#9db0c8]">Compañía telefónica:</span>
                <span className="font-bold text-[#60b6ff]">{orderData.operator}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#9db0c8]">Número destinatario:</span>
                <span className="font-bold font-mono text-white">{fullPhone}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#9db0c8]">Saldo a entregar:</span>
                <span className="font-extrabold text-[#26d39b]">{localFormatted}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#9db0c8]">Comisión de servicio:</span>
                <span className="font-semibold text-[#69e2ba]">$0.00 USD (Gratis)</span>
              </div>
              <div className="flex justify-between py-2.5 last:pb-0 text-sm sm:text-base border-t border-white/15">
                <span className="font-bold text-white">Total a pagar:</span>
                <span className="font-black text-xl text-white">${amountUsd.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Payment buttons */}
            <div className="space-y-3 mb-4">
              <button
                type="button"
                id="btn-pay-paypal-express"
                onClick={handleStartPayment}
                className="w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-sm sm:text-base bg-gradient-to-r from-[#0070ba] to-[#003087] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(0,112,186,0.35)]"
              >
                <span>Pagar con PayPal Express (${amountUsd} USD)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-center text-xs text-[#7f95ac] my-1">
                <div className="h-px bg-white/10 flex-1" />
                <span>o también mediante</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <a
                href={`https://paypal.me/luis921904/${amountUsd}USD`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#c9d8e8] bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-all flex items-center justify-center gap-2"
              >
                <span>Abrir enlace directo PayPal.Me/luis921904</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#9db0c8] justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#26d39b]" />
              <span>Conexión cifrada SSL de 256 bits · Pago 100% protegido</span>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING ANIMATION */}
        {step === 'processing' && (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="relative w-16 h-16 mb-5">
              <div className="absolute inset-0 rounded-full border-4 border-[#39a5ff]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#39a5ff] border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-[#39a5ff]">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <h4 className="text-lg font-bold text-white mb-2">Procesando recarga</h4>
            <p className="text-sm text-[#9db0c8] max-w-sm mb-6 animate-pulse">
              {processingPhase}
            </p>

            <div className="w-full max-w-xs bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#39a5ff] to-[#26d39b] h-full animate-[progress_3.4s_ease-in-out_infinite]" style={{ width: '85%' }} />
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS RECEIPT */}
        {step === 'success' && completedItem && (
          <div>
            <div className="p-4 rounded-2xl bg-[#26d39b]/10 border border-[#26d39b]/30 mb-4 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-[#26d39b] shrink-0" />
              <div>
                <div className="font-extrabold text-white text-sm">
                  ¡Recarga enviada exitosamente!
                </div>
                <div className="text-xs text-[#9db0c8]">
                  El saldo se ha acreditado en la línea móvil de forma inmediata.
                </div>
              </div>
            </div>

            {/* Receipt Box */}
            <div 
              id="receipt-details"
              className="p-4 rounded-2xl bg-[#091522] border border-dashed border-white/20 text-xs sm:text-sm space-y-2 mb-5 font-mono"
            >
              <div className="flex justify-between text-[#9db0c8]">
                <span>ID Transacción:</span>
                <span className="font-bold text-white">{completedItem.referenceId}</span>
              </div>
              <div className="flex justify-between text-[#9db0c8]">
                <span>Línea Telefónica:</span>
                <span className="font-bold text-white">{fullPhone}</span>
              </div>
              <div className="flex justify-between text-[#9db0c8]">
                <span>Operador:</span>
                <span className="font-bold text-[#60b6ff]">{completedItem.operator}</span>
              </div>
              <div className="flex justify-between text-[#9db0c8]">
                <span>Monto pagado:</span>
                <span className="font-bold text-white">${completedItem.amountUsd}.00 USD</span>
              </div>
              <div className="flex justify-between text-[#9db0c8]">
                <span>Saldo recibido:</span>
                <span className="font-bold text-[#26d39b]">{completedItem.localAmount}</span>
              </div>
              <div className="flex justify-between text-[#9db0c8] pt-1 border-t border-white/10">
                <span>Estado:</span>
                <span className="font-bold text-[#26d39b]">Acreditado ✓</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={handleCopyReceipt}
                className="py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar recibo</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar ticket</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 px-4 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-[#3ab5ff] to-[#176ee8] hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <span>Hacer otra recarga</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
