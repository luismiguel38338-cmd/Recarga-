import React from 'react';
import { Globe, Smartphone, Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onOpenUnlock: (amount: number) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenUnlock }) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-5 mb-7">
      {/* Main Hero Banner */}
      <div 
        id="hero-main-card"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#14253b] to-[#0e1a2b] border border-white/10 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col justify-between"
      >
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#168df4]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-[#39a5ff]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1675e8]/15 border border-[#39a5ff]/30 text-[#39a5ff] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recargas internacionales</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-[1.1] max-w-xl mb-3.5">
            Conecta a tu gente con una recarga al instante.
          </h2>

          <p className="text-sm sm:text-base text-[#9db0c8] leading-relaxed max-w-xl mb-6">
            Envía saldo a teléfonos de distintas compañías y países desde una sola aplicación. 
            Rápido, sencillo y con pago seguro a través de PayPal.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2.5 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs sm:text-sm text-[#d8e7f6] font-medium backdrop-blur-sm">
            <Globe className="w-4 h-4 text-[#39a5ff]" />
            <span>Muchos países</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs sm:text-sm text-[#d8e7f6] font-medium backdrop-blur-sm">
            <Smartphone className="w-4 h-4 text-[#26d39b]" />
            <span>Cualquier compañía</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs sm:text-sm text-[#d8e7f6] font-medium backdrop-blur-sm">
            <Lock className="w-4 h-4 text-[#ffc857]" />
            <span>Pago con PayPal</span>
          </div>
        </div>
      </div>

      {/* Hero Side - Unlock Countries */}
      <div 
        id="hero-unlock-card"
        className="rounded-3xl bg-gradient-to-br from-[#14253b] to-[#0e1a2b] border border-white/10 p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <h3 className="text-base sm:text-lg font-bold text-white m-0">
              Desbloquea más países
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#39a5ff]/20 text-[#60b6ff]">
              Global Pass
            </span>
          </div>

          <div className="space-y-2.5 mb-3">
            {/* $10 plan */}
            <div 
              onClick={() => onOpenUnlock(10)}
              className="group cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 p-3.5 flex items-center justify-between transition-all"
            >
              <div>
                <div className="text-xl sm:text-2xl font-black text-white group-hover:text-[#39a5ff] transition-colors">
                  $10
                </div>
                <div className="text-xs text-[#9db0c8]">Acceso internacional</div>
              </div>
              <span className="text-xs text-[#9db0c8] font-medium bg-black/20 px-2.5 py-1 rounded-lg">
                Pago único
              </span>
            </div>

            {/* $14 plan (Recommended) */}
            <div 
              onClick={() => onOpenUnlock(14)}
              className="group cursor-pointer rounded-2xl border border-[#39a5ff]/40 bg-[#168df4]/10 hover:bg-[#168df4]/15 hover:border-[#39a5ff]/60 p-3.5 flex items-center justify-between transition-all relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="text-xl sm:text-2xl font-black text-white group-hover:text-[#39a5ff] transition-colors">
                  $14
                </div>
                <div className="text-xs text-[#c2dcfa]">Acceso + prioridad</div>
              </div>
              <div className="relative z-10 flex flex-col items-end gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#39a5ff] text-[#05101d] px-2 py-0.5 rounded-md shadow-sm">
                  RECOMENDADO
                </span>
                <span className="text-[11px] text-[#9db0c8]">Activación rápida</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#9db0c8] leading-relaxed mb-4">
            Paga con PayPal y solicita la activación. El acceso global se habilita inmediatamente después de verificar el pago.
          </p>
        </div>

        <button
          onClick={() => onOpenUnlock(14)}
          id="btn-hero-unlock-countries"
          className="w-full py-3 px-4 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-[#3ab5ff] to-[#176ee8] hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_10px_24px_rgba(22,117,232,0.35)] flex items-center justify-center gap-2"
        >
          <span>Desbloquear países</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
