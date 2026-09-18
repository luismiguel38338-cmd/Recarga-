import React from 'react';
import { ShieldCheck, ArrowUpRight, Zap } from 'lucide-react';

interface HeaderProps {
  unlockedCount: number;
  totalCountries: number;
  onOpenUnlock: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unlockedCount,
  totalCountries,
  onOpenUnlock,
}) => {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-4 border-b border-white/10">
      <div className="flex items-center gap-3.5">
        <div 
          id="brand-logo"
          className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#52c7ff] to-[#1764e8] flex items-center justify-center text-white font-black text-2xl shadow-[0_10px_30px_rgba(22,141,244,0.35)] shrink-0 transition-transform hover:scale-105"
        >
          <ArrowUpRight className="w-7 h-7 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white m-0">
              RecargaMundial
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#1675e8]/20 border border-[#39a5ff]/30 text-[#60b6ff]">
              Online
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#9db0c8] mt-0.5">
            Recarga cualquier móvil, estés donde estés
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={onOpenUnlock}
          id="status-countries-btn"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs text-[#c9d8e8] transition-colors"
          title="Ver países desbloqueados"
        >
          <Zap className="w-3.5 h-3.5 text-[#ffc857]" />
          <span>
            Países activos:{' '}
            <strong className="text-white font-semibold">
              {unlockedCount}/{totalCountries}
            </strong>
          </span>
        </button>

        <div 
          id="security-indicator"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#26d39b]/10 border border-[#26d39b]/25 text-xs text-[#69e2ba] font-medium"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#26d39b] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#26d39b]"></span>
          </span>
          <ShieldCheck className="w-3.5 h-3.5 text-[#26d39b]" />
          <span>Plataforma protegida</span>
        </div>
      </div>
    </header>
  );
};
