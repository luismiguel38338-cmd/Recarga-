import React, { useState, useEffect } from 'react';
import { Country, RechargeFormData, RechargeHistoryItem } from './types';
import { COUNTRIES_DATA, INITIAL_HISTORY } from './data/countries';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { RechargeForm } from './components/RechargeForm';
import { HistorySidebar } from './components/HistorySidebar';
import { UnlockModal } from './components/UnlockModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ReceiptModal } from './components/ReceiptModal';
import { Toast } from './components/Toast';

export default function App() {
  // State for unlocked countries
  const [unlockedCountries, setUnlockedCountries] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('rm_unlocked');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
    return new Set(
      COUNTRIES_DATA.filter((c) => c.isDefaultUnlocked).map((c) => c.name)
    );
  });

  // State for recharge history
  const [history, setHistory] = useState<RechargeHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('rm_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_HISTORY;
  });

  // Modals state
  const [isUnlockOpen, setIsUnlockOpen] = useState<boolean>(false);
  const [unlockAmount, setUnlockAmount] = useState<number>(14);
  const [targetedCountry, setTargetedCountry] = useState<string | undefined>(undefined);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<RechargeFormData | null>(null);
  const [activeCountry, setActiveCountry] = useState<Country | null>(null);

  const [selectedReceipt, setSelectedReceipt] = useState<RechargeHistoryItem | null>(null);

  // Prefill state for repeat recharge
  const [prefillData, setPrefillData] = useState<{
    countryName: string;
    operator: string;
    phone: string;
    amount: number;
  } | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // Persist unlocked countries
  useEffect(() => {
    try {
      localStorage.setItem('rm_unlocked', JSON.stringify(Array.from(unlockedCountries)));
    } catch (e) {
      console.error(e);
    }
  }, [unlockedCountries]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('rm_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Open unlock modal
  const handleOpenUnlock = (amount: number = 14, countryName?: string) => {
    setUnlockAmount(amount);
    setTargetedCountry(countryName);
    setIsUnlockOpen(true);
  };

  // Confirm unlock
  const handleConfirmUnlock = (allCountries: boolean = true) => {
    if (allCountries) {
      const allNames = COUNTRIES_DATA.map((c) => c.name);
      setUnlockedCountries(new Set(allNames));
    } else if (targetedCountry) {
      setUnlockedCountries((prev) => new Set([...prev, targetedCountry]));
    }
  };

  // Submit recharge form -> open checkout
  const handleSubmitRecharge = (formData: RechargeFormData, country: Country) => {
    setActiveOrder(formData);
    setActiveCountry(country);
    setIsCheckoutOpen(true);
  };

  // Recharge completed -> prepend to history
  const handleRechargeCompleted = (item: RechargeHistoryItem) => {
    setHistory((prev) => [item, ...prev]);
  };

  // Repeat recharge action
  const handleRepeatRecharge = (item: RechargeHistoryItem) => {
    // Find country object
    const matched = COUNTRIES_DATA.find((c) => c.name === item.country);
    if (!matched) return;

    if (!unlockedCountries.has(item.country)) {
      handleOpenUnlock(10, item.country);
      showToast(`Desbloquea ${item.country} para repetir esta recarga.`);
      return;
    }

    setPrefillData({
      countryName: item.country,
      operator: item.operator,
      phone: item.phone,
      amount: item.amountUsd,
    });

    showToast(`Datos cargados para recargar ${item.operator} (${item.country}).`);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08111f] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d5180]/30 via-[#08111f] to-[#08111f] text-[#f7fbff] antialiased">
      <main className="max-w-[1180px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Top Header */}
        <Header
          unlockedCount={unlockedCountries.size}
          totalCountries={COUNTRIES_DATA.length}
          onOpenUnlock={() => handleOpenUnlock(14)}
        />

        {/* Hero Section */}
        <HeroSection onOpenUnlock={handleOpenUnlock} />

        {/* Main Grid: Form on Left, History & Pass on Right */}
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)] gap-6">
          <RechargeForm
            countries={COUNTRIES_DATA}
            unlockedCountries={unlockedCountries}
            onOpenUnlock={handleOpenUnlock}
            onSubmitRecharge={handleSubmitRecharge}
            onToast={showToast}
            initialPrefill={prefillData}
          />

          <HistorySidebar
            history={history}
            onOpenUnlock={handleOpenUnlock}
            onRepeatRecharge={handleRepeatRecharge}
            onViewReceipt={(item) => setSelectedReceipt(item)}
            onToast={showToast}
          />
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-[#6f8299] space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-[#9db0c8]">
            <span>RecargaMundial · Servicio internacional de recargas</span>
            <span>•</span>
            <button
              onClick={() => {
                const confirmed = window.confirm('¿Deseas reiniciar los países desbloqueados al valor predeterminado?');
                if (confirmed) {
                  const defaultUnlocked = new Set(
                    COUNTRIES_DATA.filter((c) => c.isDefaultUnlocked).map((c) => c.name)
                  );
                  setUnlockedCountries(defaultUnlocked);
                  showToast('Países restablecidos al estado inicial.');
                }
              }}
              className="hover:text-white transition-colors underline"
            >
              Restablecer configuración
            </button>
            <span>•</span>
            <a
              href="https://paypal.me/luis921904"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#39a5ff] hover:underline"
            >
              PayPal oficial
            </a>
          </div>
          <p>
            Plataforma protegida con estándares de alta disponibilidad y cifrado para transacciones móviles internacionales.
          </p>
        </footer>
      </main>

      {/* Modals & Feedback */}
      <UnlockModal
        isOpen={isUnlockOpen}
        onClose={() => setIsUnlockOpen(false)}
        defaultAmount={unlockAmount}
        targetedCountryName={targetedCountry}
        onConfirmUnlock={handleConfirmUnlock}
        onToast={showToast}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        orderData={activeOrder}
        country={activeCountry}
        onRechargeComplete={handleRechargeCompleted}
        onToast={showToast}
      />

      <ReceiptModal
        item={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        onToast={showToast}
      />

      <Toast message={toastMessage} />
    </div>
  );
}
