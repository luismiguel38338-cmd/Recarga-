import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Radio, 
  Server, 
  CreditCard, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Wallet
} from 'lucide-react';

interface LiveStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

interface StatusData {
  status: string;
  reloadly: {
    configured: boolean;
    mode: string;
    isLive: boolean;
    balance?: { balance: number; currencyCode: string } | null;
    message: string;
  };
  paypal: {
    configured: boolean;
    mode: string;
    isLive: boolean;
    meLink: string;
    message: string;
  };
}

export const LiveStatusModal: React.FC<LiveStatusModalProps> = ({ isOpen, onClose, onToast }) => {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchStatus = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/status');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.warn('Error fetching status:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020711]/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-2xl rounded-3xl bg-[#0e1b2f] border border-white/20 p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative text-white max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#168df4] to-[#10b981] flex items-center justify-center text-white shadow-[0_5px_20px_rgba(16,185,129,0.35)] shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white m-0">
                  Estado de Conexión en Vivo
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 text-[#34d399]">
                  Auditoría Real
                </span>
              </div>
              <p className="text-xs text-[#9db0c8] mt-0.5">
                Verificación de pasarelas de pago y red de telecomunicaciones directa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#a9bad0] hover:text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cero Estafas / Compromiso de Autenticidad */}
        <div className="rounded-2xl bg-[#091524] border border-[#1e3450] p-4 mb-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-white text-sm">
                Transparencia Garantizada: Cero Simulaciones en Producción
              </h4>
              <p className="text-[#a4b8ce] leading-relaxed">
                Esta aplicación no utiliza cobros ficticios ni emuladores ocultos. Al colocar tus claves en el archivo <code className="text-[#38bdf8] bg-black/40 px-1 py-0.5 rounded">.env</code> del servidor, cada recarga viaja a la antena del operador móvil destinatario (Claro, Altice, T-Mobile, Movistar, etc.) y cada pago se procesa en los servidores bancarios de PayPal.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-[#9db0c8] flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#38bdf8]" />
            <span>Consultando estado de las pasarelas y balance...</span>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {/* Card 1: Reloadly Telecom Airtime */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 transition-all hover:border-[#38bdf8]/40">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center font-bold">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      Red Móvil: Reloadly Airtime API
                    </h4>
                    <p className="text-[11px] text-[#8ea5be]">
                      Despacho directo de saldo a más de 140 países
                    </p>
                  </div>
                </div>

                {data?.reloadly.configured ? (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                    data.reloadly.isLive 
                      ? 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30' 
                      : 'bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                    {data.reloadly.isLive ? 'EN VIVO (Saldo Real)' : 'Modo Sandbox'}
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 text-[#cbd5e1] border border-white/20">
                    Modo Demostración
                  </span>
                )}
              </div>

              <div className="text-xs text-[#a4b8ce] space-y-2 bg-[#060e1a]/60 rounded-xl p-3 border border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[#8097b0]">Estado del proveedor:</span>
                  <span className="font-semibold text-white">{data?.reloadly.message}</span>
                </div>
                {data?.reloadly.balance && (
                  <div className="flex justify-between items-center text-sm font-bold text-[#10b981] pt-1 border-t border-white/10">
                    <span className="flex items-center gap-1.5">
                      <Wallet className="w-4 h-4" />
                      Saldo en cuenta Reloadly:
                    </span>
                    <span>${data.reloadly.balance.balance.toFixed(2)} {data.reloadly.balance.currencyCode}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[#8097b0]">Infraestructura:</span>
                  <span className="text-[#cbd5e1]">API Oficial Reloadly (OAuth 2.0)</span>
                </div>
              </div>

              {!data?.reloadly.configured && (
                <div className="mt-3 flex items-center justify-between text-xs pt-2 text-[#8ea5be]">
                  <span>Para enviar saldo telefónico real a cualquier número:</span>
                  <a 
                    href="https://www.reloadly.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#38bdf8] font-bold hover:underline flex items-center gap-1"
                  >
                    Crear cuenta en Reloadly.com
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Card 2: PayPal Payment Gateway */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 transition-all hover:border-[#168df4]/40">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0070ba]/20 text-[#60b6ff] flex items-center justify-center font-bold">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      Pasarela de Cobros: PayPal REST API v2
                    </h4>
                    <p className="text-[11px] text-[#8ea5be]">
                      Cobro oficial con cuentas PayPal y tarjetas de crédito/débito
                    </p>
                  </div>
                </div>

                {data?.paypal.configured ? (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                    data.paypal.isLive 
                      ? 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30' 
                      : 'bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                    {data.paypal.isLive ? 'EN VIVO (Dinero Real)' : 'Modo Sandbox'}
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#0070ba]/20 text-[#60b6ff] border border-[#0070ba]/30">
                    PayPal.Me Habilitado
                  </span>
                )}
              </div>

              <div className="text-xs text-[#a4b8ce] space-y-2 bg-[#060e1a]/60 rounded-xl p-3 border border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[#8097b0]">Estado de pasarela:</span>
                  <span className="font-semibold text-white">{data?.paypal.message}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8097b0]">Receptor de fondos:</span>
                  <a 
                    href={data?.paypal.meLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#38bdf8] font-bold hover:underline flex items-center gap-1"
                  >
                    {data?.paypal.meLink}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {!data?.paypal.configured && (
                <div className="mt-3 flex items-center justify-between text-xs pt-2 text-[#8ea5be]">
                  <span>Para cobrar con tarjetas en tu propia cuenta:</span>
                  <a 
                    href="https://developer.paypal.com/dashboard/applications" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#38bdf8] font-bold hover:underline flex items-center gap-1"
                  >
                    Crear App en PayPal Developer
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              fetchStatus();
              onToast('Estado de conexión actualizado.');
            }}
            disabled={refreshing}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Verificar conexión ahora</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#168df4] to-[#10b981] hover:brightness-110 text-xs font-extrabold text-white transition-all shadow-[0_4px_15px_rgba(22,141,244,0.3)]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
