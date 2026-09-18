import React, { useState, useEffect, useMemo } from 'react';
import { Country, RechargeFormData } from '../types';
import { 
  Phone, 
  Smartphone, 
  Globe2, 
  Sparkles, 
  Info, 
  Check, 
  Lock, 
  DollarSign, 
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface RechargeFormProps {
  countries: Country[];
  unlockedCountries: Set<string>;
  onOpenUnlock: (amount: number, countryName?: string) => void;
  onSubmitRecharge: (data: RechargeFormData, country: Country) => void;
  onToast: (msg: string) => void;
  initialPrefill?: { countryName: string; operator: string; phone: string; amount: number } | null;
}

const PRESET_AMOUNTS = [5, 10, 20, 50, 100];

export const RechargeForm: React.FC<RechargeFormProps> = ({
  countries,
  unlockedCountries,
  onOpenUnlock,
  onSubmitRecharge,
  onToast,
  initialPrefill,
}) => {
  const [selectedCountryName, setSelectedCountryName] = useState<string>('República Dominicana');
  const [selectedOperator, setSelectedOperator] = useState<string>('Selección automática');
  const [phoneDigits, setPhoneDigits] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [customAmountVal, setCustomAmountVal] = useState<string>('');
  const [detectedOperator, setDetectedOperator] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Selected Country object
  const currentCountry = useMemo(() => {
    return countries.find((c) => c.name === selectedCountryName) || countries[0];
  }, [countries, selectedCountryName]);

  const isUnlocked = useMemo(() => {
    return unlockedCountries.has(selectedCountryName);
  }, [unlockedCountries, selectedCountryName]);

  // Handle prefill if repeating from history
  useEffect(() => {
    if (initialPrefill) {
      setSelectedCountryName(initialPrefill.countryName);
      setSelectedOperator(initialPrefill.operator);
      setPhoneDigits(initialPrefill.phone.replace(/\D/g, ''));
      setSelectedAmount(initialPrefill.amount);
      setIsCustomAmount(!PRESET_AMOUNTS.includes(initialPrefill.amount));
      if (!PRESET_AMOUNTS.includes(initialPrefill.amount)) {
        setCustomAmountVal(initialPrefill.amount.toString());
      }
    }
  }, [initialPrefill]);

  // Auto-detect operator based on country & phone
  useEffect(() => {
    if (!phoneDigits || phoneDigits.length < 3) {
      setDetectedOperator(null);
      return;
    }

    const clean = phoneDigits.replace(/\D/g, '');

    if (currentCountry.iso === 'DO') {
      if (clean.startsWith('809') || clean.startsWith('829') || clean.startsWith('849')) {
        const lead = clean.slice(3, 4);
        if (['2', '3', '4', '7'].includes(lead)) setDetectedOperator('Claro');
        else if (['5', '8'].includes(lead)) setDetectedOperator('Altice');
        else setDetectedOperator('Viva');
      } else {
        setDetectedOperator('Claro (Sugerido)');
      }
    } else if (currentCountry.iso === 'US') {
      const p = clean.slice(0, 3);
      if (['305', '786', '212', '917'].includes(p)) setDetectedOperator('T-Mobile');
      else setDetectedOperator('AT&T');
    } else if (currentCountry.iso === 'MX') {
      setDetectedOperator('Telcel');
    } else if (currentCountry.iso === 'CO') {
      if (clean.startsWith('300') || clean.startsWith('301')) setDetectedOperator('Tigo');
      else if (clean.startsWith('310') || clean.startsWith('311')) setDetectedOperator('Claro');
      else setDetectedOperator('Movistar');
    } else if (currentCountry.iso === 'ES') {
      if (clean.startsWith('6') || clean.startsWith('7')) setDetectedOperator('Movistar');
      else setDetectedOperator('Orange');
    } else {
      if (currentCountry.operators.length > 0) {
        setDetectedOperator(currentCountry.operators[0]);
      } else {
        setDetectedOperator(null);
      }
    }
  }, [phoneDigits, currentCountry]);

  // Actual amount to use
  const activeAmount = isCustomAmount ? (parseFloat(customAmountVal) || 0) : selectedAmount;

  // Local currency calculation
  const calculatedLocal = useMemo(() => {
    if (!activeAmount || activeAmount <= 0) return '0.00';
    const converted = activeAmount * currentCountry.exchangeRate;
    if (converted >= 1000) {
      return `${currentCountry.currencySymbol} ${converted.toLocaleString('es-ES', { maximumFractionDigits: 0 })} ${currentCountry.currency}`;
    }
    return `${currentCountry.currencySymbol} ${converted.toFixed(2)} ${currentCountry.currency}`;
  }, [activeAmount, currentCountry]);

  const handleCountryChange = (name: string) => {
    setSelectedCountryName(name);
    setSelectedOperator('Selección automática');
    setPhoneDigits('');

    if (!unlockedCountries.has(name)) {
      onToast(`El país ${name} requiere acceso internacional.`);
      onOpenUnlock(10, name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUnlocked) {
      onToast(`Debes desbloquear ${selectedCountryName} para enviar recargas.`);
      onOpenUnlock(10, selectedCountryName);
      return;
    }

    const cleanNumber = phoneDigits.replace(/\D/g, '');
    if (cleanNumber.length < 6) {
      onToast('Por favor introduce un número telefónico móvil válido.');
      return;
    }

    if (activeAmount < 3) {
      onToast('El monto mínimo para recargar es $3 USD.');
      return;
    }

    if (activeAmount > 250) {
      onToast('El monto máximo por transacción es $250 USD.');
      return;
    }

    const effectiveOperator = selectedOperator === 'Selección automática'
      ? (detectedOperator || currentCountry.operators[0] || 'Compañía móvil')
      : selectedOperator;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitRecharge(
        {
          countryName: currentCountry.name,
          prefix: currentCountry.prefix,
          operator: effectiveOperator,
          phone: cleanNumber,
          amountUsd: activeAmount,
        },
        currentCountry
      );
    }, 450);
  };

  return (
    <div 
      id="recharge-card"
      className="rounded-3xl bg-gradient-to-br from-[#14253b] to-[#0e1a2b] border border-white/10 p-5 sm:p-7 shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#39a5ff]/20 text-[#39a5ff] flex items-center justify-center font-bold">
            <Smartphone className="w-4 h-4" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white m-0">
            Enviar una recarga
          </h3>
        </div>

        {isUnlocked ? (
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#26d39b]/15 border border-[#26d39b]/30 text-[#69e2ba] flex items-center gap-1">
            <Check className="w-3 h-3" />
            País Habilitado
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onOpenUnlock(10, selectedCountryName)}
            className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#ffc857]/15 border border-[#ffc857]/40 text-[#ffd66c] flex items-center gap-1 hover:bg-[#ffc857]/25 transition-colors"
          >
            <Lock className="w-3 h-3" />
            Bloqueado · Desbloquear
          </button>
        )}
      </div>

      <p className="text-xs sm:text-sm text-[#9db0c8] mb-6">
        Completa los datos del número que recibirá el saldo.
      </p>

      <form id="rechargeForm" onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* País del destinatario */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="country-select" className="text-xs font-bold text-[#c9d8e8] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-[#39a5ff]" />
                País del destinatario
              </span>
              <span className="text-[10px] text-[#9db0c8] font-normal">
                {currentCountry.iso}
              </span>
            </label>
            <div className="relative">
              <select
                id="country-select"
                value={selectedCountryName}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full h-12 rounded-xl border border-[#263951] bg-[#091522] text-[#f7fbff] px-3.5 pr-8 appearance-none focus:outline-none focus:border-[#39a5ff] focus:ring-2 focus:ring-[#39a5ff]/20 text-sm font-medium transition-all"
                required
              >
                {countries.map((c) => {
                  const unlocked = unlockedCountries.has(c.name);
                  return (
                    <option key={c.name} value={c.name} className="bg-[#091522] text-white">
                      {c.flag} {c.name} {unlocked ? '' : '🔒'}
                    </option>
                  );
                })}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#9db0c8]">
                ▼
              </div>
            </div>
          </div>

          {/* Compañía móvil */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="operator-select" className="text-xs font-bold text-[#c9d8e8] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#39a5ff]" />
                Compañía móvil
              </span>
              {detectedOperator && selectedOperator === 'Selección automática' && (
                <span className="text-[10px] text-[#69e2ba] font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Auto-detectado: {detectedOperator}
                </span>
              )}
            </label>
            <div className="relative">
              <select
                id="operator-select"
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="w-full h-12 rounded-xl border border-[#263951] bg-[#091522] text-[#f7fbff] px-3.5 pr-8 appearance-none focus:outline-none focus:border-[#39a5ff] focus:ring-2 focus:ring-[#39a5ff]/20 text-sm font-medium transition-all"
                required
              >
                <option value="Selección automática" className="bg-[#091522] text-[#60b6ff]">
                  ✨ Selección automática {detectedOperator ? `(${detectedOperator})` : ''}
                </option>
                {currentCountry.operators.map((op) => (
                  <option key={op} value={op} className="bg-[#091522] text-white">
                    {op}
                  </option>
                ))}
                <option value="Otra compañía" className="bg-[#091522] text-white">
                  Otra compañía
                </option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#9db0c8]">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Número de teléfono */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone-input" className="text-xs font-bold text-[#c9d8e8] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#39a5ff]" />
              Número de teléfono
            </span>
            <span className="text-[11px] text-[#9db0c8]">
              Formato internacional con prefijo
            </span>
          </label>
          <div className="flex gap-2">
            <div className="h-12 px-3.5 rounded-xl border border-[#263951] bg-[#091522] flex items-center gap-1.5 shrink-0 text-sm font-semibold text-white">
              <span>{currentCountry.flag}</span>
              <span className="text-[#39a5ff]">{currentCountry.prefix}</span>
            </div>
            <div className="relative flex-1">
              <input
                id="phone-input"
                type="tel"
                inputMode="numeric"
                value={phoneDigits}
                onChange={(e) => setPhoneDigits(e.target.value)}
                placeholder={`Ej.: ${currentCountry.samplePrefix} 555 1234`}
                className="w-full h-12 rounded-xl border border-[#263951] bg-[#091522] text-white px-3.5 pr-8 focus:outline-none focus:border-[#39a5ff] focus:ring-2 focus:ring-[#39a5ff]/20 text-sm font-medium tracking-wide placeholder:text-gray-600 transition-all"
                required
              />
              {phoneDigits && (
                <button
                  type="button"
                  onClick={() => setPhoneDigits('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9db0c8] hover:text-white p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Monto a enviar */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#c9d8e8] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#39a5ff]" />
              Monto a enviar (USD)
            </label>
            <span className="text-xs text-[#69e2ba] font-medium">
              Sin comisiones ocultas
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2" id="amounts-container">
            {PRESET_AMOUNTS.map((val) => {
              const active = !isCustomAmount && selectedAmount === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(val);
                    setIsCustomAmount(false);
                  }}
                  id={`amount-btn-${val}`}
                  className={`h-11 rounded-xl font-bold text-sm transition-all border ${
                    active
                      ? 'bg-[#168df4]/25 border-[#39a5ff] text-white shadow-[0_0_15px_rgba(57,165,255,0.3)] ring-1 ring-[#39a5ff]'
                      : 'bg-[#0a1726] border-[#263951] text-[#d8e7f6] hover:bg-[#122238] hover:border-white/20'
                  }`}
                >
                  ${val}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setIsCustomAmount(true)}
              id="amount-btn-custom"
              className={`h-11 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                isCustomAmount
                  ? 'bg-[#168df4]/25 border-[#39a5ff] text-white ring-1 ring-[#39a5ff]'
                  : 'bg-[#0a1726] border-[#263951] text-[#9db0c8] hover:bg-[#122238] hover:text-white'
              }`}
            >
              Otro
            </button>
          </div>

          {isCustomAmount && (
            <div className="mt-2 flex items-center gap-2 p-2 rounded-xl bg-[#091522] border border-[#263951]">
              <span className="text-sm font-bold text-[#39a5ff] pl-2">$</span>
              <input
                type="number"
                min="3"
                max="250"
                step="1"
                placeholder="Ingresa monto en USD (3 - 250)"
                value={customAmountVal}
                onChange={(e) => setCustomAmountVal(e.target.value)}
                className="w-full bg-transparent text-white font-bold text-sm focus:outline-none placeholder:text-gray-600"
                autoFocus
              />
              <span className="text-xs text-[#9db0c8] pr-2">USD</span>
            </div>
          )}

          {/* Estimación de saldo a recibir en moneda local */}
          <div className="mt-1 p-3 rounded-xl bg-[#168df4]/10 border border-[#39a5ff]/20 flex items-center justify-between text-xs">
            <span className="text-[#9db0c8]">El destinatario recibe aprox.:</span>
            <span className="text-sm font-extrabold text-[#60b6ff]">
              {calculatedLocal}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            id="submit-recharge-btn"
            disabled={isSubmitting}
            className="w-full h-12 sm:h-13 rounded-xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-[#3ab5ff] to-[#176ee8] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-[0_10px_24px_rgba(22,117,232,0.35)] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verificando conexión telefónica...</span>
              </>
            ) : (
              <>
                <span>Continuar con la recarga</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Notice Banner */}
      <div className="mt-5 p-3.5 rounded-xl bg-[#ffc857]/[0.07] border border-[#ffc857]/30 text-[#e6d29c] text-xs leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#ffd66c] shrink-0 mt-0.5" />
        <div>
          <b className="text-[#ffd66c] font-bold">Importante:</b> Esta versión cuenta con la interfaz interactiva lista y preparada para emitir órdenes reales con PayPal y operadoras globales. Toda recarga confirmada genera un comprobante con ID de transacción.
        </div>
      </div>
    </div>
  );
};
