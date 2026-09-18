import React, { useState, useMemo } from 'react';
import { RechargeHistoryItem } from '../types';
import { 
  History, 
  CheckCircle2, 
  RotateCcw, 
  ExternalLink, 
  Globe, 
  FileText, 
  Download,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  X
} from 'lucide-react';

interface HistorySidebarProps {
  history: RechargeHistoryItem[];
  onOpenUnlock: (amount: number) => void;
  onRepeatRecharge: (item: RechargeHistoryItem) => void;
  onViewReceipt: (item: RechargeHistoryItem) => void;
  onToast?: (msg: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  onOpenUnlock,
  onRepeatRecharge,
  onViewReceipt,
  onToast,
}) => {
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Accounting metrics
  const totalAmountSpent = useMemo(() => {
    return history.reduce((sum, item) => sum + (item.amountUsd || 0), 0);
  }, [history]);

  // Export to CSV
  const handleExportCSV = () => {
    if (history.length === 0) {
      onToast?.('No hay transacciones para exportar.');
      return;
    }

    const headers = [
      'ID Transacción',
      'Fecha',
      'País',
      'Operador',
      'Línea Telefónica',
      'Monto USD',
      'Saldo Entregado',
      'Estado'
    ];

    const rows = history.map((item) => [
      `"${item.referenceId}"`,
      `"${item.date}"`,
      `"${item.country}"`,
      `"${item.operator}"`,
      `"${item.phone}"`,
      item.amountUsd,
      `"${item.localAmount.replace(/"/g, '""')}"`,
      `"${item.status}"`
    ]);

    // Add summary row for personal accounting
    rows.push([
      '"TOTAL ACUMULADO"',
      `"${new Date().toLocaleDateString('es-ES')}"`,
      '""',
      '""',
      '""',
      totalAmountSpent,
      '""',
      '"CONFIRMADO"'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Recargas_Contabilidad_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onToast?.('Reporte CSV exportado exitosamente para contabilidad.');
    setShowExportModal(false);
  };

  // Export to PDF / Printable Report
  const handleExportPDF = () => {
    if (history.length === 0) {
      onToast?.('No hay transacciones para exportar.');
      return;
    }

    const todayStr = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const reportHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>RecargaMundial - Reporte Contable de Transacciones</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 30px; color: #1e293b; }
          .header { border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
          .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
          .badge { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: bold; }
          .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; }
          .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; background: #f8fafc; }
          .card-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 4px; }
          .card-value { font-size: 20px; font-weight: 800; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th { background: #f1f5f9; text-align: left; padding: 10px 12px; font-weight: 700; color: #334155; border-bottom: 2px solid #cbd5e1; }
          td { padding: 9px 12px; border-bottom: 1px solid #e2e8f0; color: #334155; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .status { display: inline-block; padding: 2px 8px; border-radius: 6px; font-weight: 600; font-size: 11px; background: #dcfce7; color: #15803d; }
          .total-row { font-weight: 800; background: #f1f5f9 !important; border-top: 2px solid #94a3b8; }
          .footer { margin-top: 35px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center; }
          @media print {
            body { margin: 15mm; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">RecargaMundial</h1>
            <div class="subtitle">Estado de Cuenta y Registro de Recargas Móviles Internacionales</div>
          </div>
          <div style="text-align: right;">
            <div class="badge">DOCUMENTO CONTABLE</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 6px;">Fecha de emisión: ${todayStr}</div>
          </div>
        </div>

        <div class="summary-cards">
          <div class="card">
            <div class="card-label">Total Recargas Realizadas</div>
            <div class="card-value">${history.length}</div>
          </div>
          <div class="card">
            <div class="card-label">Total Invertido (USD)</div>
            <div class="card-value">$${totalAmountSpent.toFixed(2)} USD</div>
          </div>
          <div class="card">
            <div class="card-label">Estado de Transacciones</div>
            <div class="card-value" style="color: #15803d; font-size: 16px;">100% Completadas</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID Referencia</th>
              <th>Fecha y Hora</th>
              <th>Destinatario</th>
              <th>País</th>
              <th>Operador</th>
              <th>Monto (USD)</th>
              <th>Saldo Recibido</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${history
              .map(
                (item) => `
              <tr>
                <td style="font-family: monospace; font-weight: 600;">${item.referenceId}</td>
                <td>${item.date}</td>
                <td>${item.phone}</td>
                <td>${item.flag} ${item.country}</td>
                <td><strong>${item.operator}</strong></td>
                <td><strong>$${item.amountUsd}.00</strong></td>
                <td>${item.localAmount}</td>
                <td><span class="status">${item.status}</span></td>
              </tr>
            `
              )
              .join('')}
            <tr class="total-row">
              <td colspan="5" style="text-align: right; padding-right: 15px;">TOTAL GENERAL (USD):</td>
              <td colspan="3" style="font-size: 14px; color: #0f172a;">$${totalAmountSpent.toFixed(2)} USD</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          Comprobante generado desde la plataforma RecargaMundial para control contable personal y deducción de gastos.
        </div>
      </body>
      </html>
    `;

    // Open print preview
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 350);
      onToast?.('Ventana de impresión/guardar PDF abierta.');
    } else {
      // Fallback: download HTML/PDF file directly
      const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Reporte_Contabilidad_Recargas_${new Date().toISOString().slice(0, 10)}.html`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      onToast?.('Reporte contable descargado como documento listo para imprimir/PDF.');
    }

    setShowExportModal(false);
  };

  return (
    <aside className="flex flex-col gap-5">
      {/* Card: Últimas Recargas */}
      <div 
        id="history-card"
        className="rounded-3xl bg-gradient-to-br from-[#14253b] to-[#0e1a2b] border border-white/10 p-5 sm:p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#26d39b]/20 text-[#26d39b] flex items-center justify-center font-bold">
              <History className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white m-0">
              Últimas recargas
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#9db0c8]">
              {history.length} registradas
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[#9db0c8] m-0">
            Tus movimientos y recibos personales.
          </p>

          {/* Export Button */}
          <button
            type="button"
            id="btn-open-export-history"
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#168df4]/20 hover:bg-[#168df4]/30 border border-[#39a5ff]/40 text-[#60b6ff] hover:text-white text-xs font-bold transition-all"
            title="Exportar registros para contabilidad"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>
        </div>

        {/* Accounting Summary Mini Bar */}
        {history.length > 0 && (
          <div className="mb-4 p-2.5 rounded-xl bg-[#091522] border border-[#263951] flex items-center justify-between text-xs">
            <span className="text-[#9db0c8]">Gasto total acumulado:</span>
            <span className="font-extrabold text-[#26d39b]">
              ${totalAmountSpent.toFixed(2)} USD
            </span>
          </div>
        )}

        {/* List of items */}
        <div className="divide-y divide-white/10">
          {history.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#9db0c8]">
              No hay recargas recientes registradas.
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className="py-3.5 first:pt-1 last:pb-1 group transition-colors"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-lg shrink-0">
                      {item.flag}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#39a5ff] transition-colors">
                        {item.phone}
                      </div>
                      <div className="text-[11px] text-[#9db0c8]">
                        {item.country} · {item.operator}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-black text-white">
                      ${item.amountUsd} USD
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#26d39b]/15 text-[#69e2ba]">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px]">
                  <span className="text-[#9db0c8]">{item.date}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewReceipt(item)}
                      className="text-[#9db0c8] hover:text-white flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-white/5"
                      title="Ver comprobante"
                    >
                      <FileText className="w-3 h-3" />
                      Recibo
                    </button>
                    <button
                      onClick={() => onRepeatRecharge(item)}
                      className="text-[#39a5ff] hover:text-[#60b6ff] font-semibold flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-[#39a5ff]/10"
                      title="Cargar estos datos en el formulario"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Repetir
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Card: ¿No encuentras tu país? Desbloqueo PayPal */}
      <div 
        id="unlock-sidebar-card"
        className="rounded-3xl bg-gradient-to-br from-[#168df4]/15 via-[#14253b] to-[#0e1a2b] border border-[#39a5ff]/35 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-[#39a5ff]" />
          <h4 className="text-sm sm:text-base font-bold text-white m-0">
            ¿No encuentras tu país?
          </h4>
        </div>

        <p className="text-xs text-[#9db0c8] leading-relaxed mb-4">
          Amplía el acceso a destinos internacionales por un pago único a través de PayPal.
        </p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => onOpenUnlock(10)}
            id="sidebar-unlock-10"
            className="h-10 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1"
          >
            <span>$10 USD</span>
          </button>
          <button
            onClick={() => onOpenUnlock(14)}
            id="sidebar-unlock-14"
            className="h-10 rounded-xl bg-gradient-to-r from-[#168df4]/30 to-[#39a5ff]/30 hover:from-[#168df4]/40 hover:to-[#39a5ff]/40 border border-[#39a5ff]/50 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1"
          >
            <span>$14 recomendado</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#7f95ac] pt-1">
          <span>Enlace de pago:</span>
          <a
            href="https://paypal.me/luis921904"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#60b6ff] hover:underline inline-flex items-center gap-1 font-medium"
          >
            paypal.me/luis921904
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Export Options Modal */}
      {showExportModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020711]/85 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-3xl bg-[#122238] border border-white/20 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.8)] relative text-white">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#39a5ff]/20 text-[#39a5ff] flex items-center justify-center font-bold">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white m-0">
                    Exportar contabilidad
                  </h3>
                  <p className="text-xs text-[#9db0c8]">
                    Descarga tus registros en CSV o PDF
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#a9bad0] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#091522] border border-[#263951] text-xs mb-5 space-y-1.5">
              <div className="flex justify-between text-[#9db0c8]">
                <span>Transacciones a exportar:</span>
                <span className="font-bold text-white">{history.length} registros</span>
              </div>
              <div className="flex justify-between text-[#9db0c8]">
                <span>Total desembolsado:</span>
                <span className="font-bold text-[#26d39b]">${totalAmountSpent.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {/* CSV Option */}
              <button
                type="button"
                id="btn-export-csv"
                onClick={handleExportCSV}
                className="w-full p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-[#39a5ff]/50 transition-all text-left flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#26d39b]/20 text-[#26d39b] flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white group-hover:text-[#39a5ff] transition-colors flex items-center justify-between">
                    <span>Exportar archivo CSV</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-[#d8e7f6]">
                      .CSV
                    </span>
                  </div>
                  <p className="text-xs text-[#9db0c8] mt-0.5">
                    Compatible con Microsoft Excel, Google Sheets y software contable.
                  </p>
                </div>
              </button>

              {/* PDF Option */}
              <button
                type="button"
                id="btn-export-pdf"
                onClick={handleExportPDF}
                className="w-full p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-[#39a5ff]/50 transition-all text-left flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#ff758c]/20 text-[#ff758c] flex items-center justify-center shrink-0">
                  <Printer className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white group-hover:text-[#39a5ff] transition-colors flex items-center justify-between">
                    <span>Reporte contable PDF / Imprimir</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-[#d8e7f6]">
                      .PDF
                    </span>
                  </div>
                  <p className="text-xs text-[#9db0c8] mt-0.5">
                    Estado de cuenta formal con membrete, tabla detallada y totales.
                  </p>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowExportModal(false)}
              className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-bold text-[#c9d8e8] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
