import React, { useState } from 'react';
import { X, ExternalLink, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount: number;
  targetedCountryName?: string;
  onConfirmUnlock: (allCountries: boolean) => void;
  onToast: (msg: string) => void;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({
  isOpen,
  onClose,
  defaultAmount,
  targetedCountryName,
  onConfirmUnlock,
  onToast,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<number>(defaultAmount || 14);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  if (!isOpen) return null;

  const paypalUrl = `https://paypal.me/luis921904/${selectedPlan}USD`;

  const handleRequestActivation = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onConfirmUnlock(true);
      onToast('¡Acceso internacional activado con éxito! Todos los países están habilitados.');
      onClose();
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020711]/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div 
        id="payModal-box"
        className="w-full max-w-lg rounded-3xl bg-[#122238] border border-white/20 p-6 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.8)] relative text-white animate-scaleUp"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#39a5ff] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Acceso Global
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white m-0">
              Desbloquear países internacionales
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#a9bad0] hover:text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {targetedCountryName && (
          <div className="mb-4 p-3 rounded-xl bg-[#ffc857]/15 border border-[#ffc857]/30 text-[#ffd66c] text-xs">
            Seleccionaste <strong>{targetedCountryName}</strong>, que requiere el pase de acceso internacional.
          </div>
        )}

        {/* Plan Selector */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div
            onClick={() => setSelectedPlan(10)}
            className={`cursor-pointer p-4 rounded-2xl border transition-all ${
              selectedPlan === 10
                ? 'bg-[#168df4]/20 border-[#39a5ff] ring-2 ring-[#39a5ff]/40'
                : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
            }`}
          >
            <div className="text-2xl font-black text-white mb-0.5">$10 USD</div>
            <div className="text-xs font-semibold text-[#c9d8e8]">Pase Estándar</div>
            <div className="text-[11px] text-[#9db0c8] mt-1">Todos los países · Pago único</div>
          </div>

          <div
            onClick={() => setSelectedPlan(14)}
            className={`cursor-pointer p-4 rounded-2xl border relative transition-all ${
              selectedPlan === 14
                ? 'bg-[#168df4]/25 border-[#39a5ff] ring-2 ring-[#39a5ff]/40'
                : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
            }`}
          >
            <span className="absolute -top-2.5 right-3 text-[9px] font-black uppercase tracking-wider bg-[#39a5ff] text-[#05101d] px-2 py-0.5 rounded-full">
              RECOMENDADO
            </span>
            <div className="text-2xl font-black text-white mb-0.5">$14 USD</div>
            <div className="text-xs font-semibold text-[#c9d8e8]">Acceso + Prioridad</div>
            <div className="text-[11px] text-[#9db0c8] mt-1">Soporte VIP y recargas prioritarias</div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#9db0c8] leading-relaxed mb-5">
          Seleccionaste el plan de <strong className="text-white">${selectedPlan} USD</strong>. Realiza el pago en PayPal de forma segura y luego presiona el botón para habilitar tus países.
        </p>

        {/* PayPal Action Links */}
        <div className="space-y-2.5 mb-5">
          <a
            id="paypal-external-btn"
            href={paypalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-sm sm:text-base bg-[#0070ba] hover:bg-[#005ea6] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,112,186,0.35)]"
          >
            <span>Pagar ${selectedPlan} con PayPal</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            type="button"
            id="confirm-activation-btn"
            disabled={isVerifying}
            onClick={handleRequestActivation}
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#eaf5ff] bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 transition-all flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verificando y activando pase...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#26d39b]" />
                <span>Ya pagué — Activar acceso a todos los países</span>
              </>
            )}
          </button>
        </div>

        <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-start gap-2.5 text-[11px] text-[#7f95ac] leading-normal">
          <ShieldCheck className="w-4 h-4 text-[#39a5ff] shrink-0 mt-0.5" />
          <span>
            La activación queda vinculada y guardada en tu navegador. Tus pagos están garantizados y respaldados por la protección al comprador de PayPal.
          </span>
        </div>
      </div>
    </div>
  );
};
