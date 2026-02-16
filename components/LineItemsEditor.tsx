"use client";

import { useInvoiceStore } from "@/lib/store/invoiceStore";
import { formatCurrency } from "@/lib/utils/format";
import { calculateInvoiceTotals } from "@/lib/utils/totals";

export default function LineItemsEditor() {
  const invoice = useInvoiceStore((s) => s.invoice);
  const addItem = useInvoiceStore((s) => s.addItem);
  const updateItem = useInvoiceStore((s) => s.updateItem);
  const removeItem = useInvoiceStore((s) => s.removeItem);

  const { items, currency, taxRate, discountType, discountValue } = invoice;

  const totals = calculateInvoiceTotals({
    items,
    taxRate: Number(taxRate) || 0,
    discountType,
    discountValue: Number(discountValue) || 0,
  });

  return (
    <div className="space-y-4">
      {/* Header row - Desktop only */}
      <div className="hidden md:grid grid-cols-[auto_2fr_1fr_1fr_1fr] gap-3 px-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
        <span></span>
        <span>Description</span>
        <span className="text-right">Rate</span>
        <span className="text-center">Qty</span>
        <span className="text-right">Amount</span>
      </div>

      {/* Line items */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const lineAmount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4"
            >
              {/* Desktop Layout */}
              <div className="hidden md:grid grid-cols-[auto_2fr_1fr_1fr_1fr] items-center gap-3">
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-xs font-semibold text-slate-500 hover:bg-ember hover:text-white"
                  onClick={() => removeItem(item.id)}
                  title="Remove"
                >
                  ×
                </button>
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Enter Description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                />
                <input
                  type="number"
                  step="any"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-right text-sm"
                  placeholder="0.00"
                  min={0}
                  value={item.rate === 0 ? "" : item.rate}
                  onChange={(e) => {
                    const v = e.target.valueAsNumber;
                    updateItem(item.id, "rate", isNaN(v) ? 0 : v);
                  }}
                />
                <input
                  type="number"
                  step="1"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-center text-sm"
                  placeholder="1"
                  min={0}
                  value={item.quantity === 0 ? "" : item.quantity}
                  onChange={(e) => {
                    const v = e.target.valueAsNumber;
                    updateItem(item.id, "quantity", isNaN(v) ? 0 : v);
                  }}
                />
                <div className="text-right text-sm font-semibold text-ink">
                  {formatCurrency(lineAmount, currency)}
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Item {index + 1}</span>
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500 hover:bg-ember hover:text-white active:scale-95"
                    onClick={() => removeItem(item.id)}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>

                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Rate</label>
                    <input
                      type="number"
                      step="any"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                      placeholder="0.00"
                      min={0}
                      value={item.rate === 0 ? "" : item.rate}
                      onChange={(e) => {
                        const v = e.target.valueAsNumber;
                        updateItem(item.id, "rate", isNaN(v) ? 0 : v);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Qty</label>
                    <input
                      type="number"
                      step="1"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-center"
                      placeholder="1"
                      min={0}
                      value={item.quantity === 0 ? "" : item.quantity}
                      onChange={(e) => {
                        const v = e.target.valueAsNumber;
                        updateItem(item.id, "quantity", isNaN(v) ? 0 : v);
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-400">Amount</span>
                  <span className="text-sm font-semibold text-ink">
                    {formatCurrency(lineAmount, currency)}
                  </span>
                </div>
              </div>

              {/* Additional Details toggle */}
              <details className="mt-2 md:pl-9">
                <summary className="text-xs font-medium text-lagoon hover:underline cursor-pointer py-1">
                  + Additional details
                </summary>
                <textarea
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 sm:py-2 text-sm resize-none"
                  rows={2}
                  placeholder="Additional details"
                  value={item.additionalDetails}
                  onChange={(e) => updateItem(item.id, "additionalDetails", e.target.value)}
                />
              </details>
            </div>
          );
        })}
      </div>

      {/* Add item button */}
      <button
        type="button"
        className="flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-lagoon text-lg font-bold text-white shadow transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow"
        onClick={addItem}
        title="Add line item"
      >
        +
      </button>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-full sm:w-64 space-y-2 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal, currency)}</span>
          </div>
          {(Number(taxRate) || 0) > 0 && (
            <div className="flex justify-between text-slate-500">
              <span>Tax ({taxRate}%)</span>
              <span>{formatCurrency(totals.taxAmount, currency)}</span>
            </div>
          )}
          {(Number(discountValue) || 0) > 0 && (
            <div className="flex justify-between text-slate-500">
              <span>
                Discount{" "}
                {discountType === "percentage"
                  ? `(${discountValue}%)`
                  : ""}
              </span>
              <span>-{formatCurrency(totals.discountAmount, currency)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-ink">
            <span>Balance Due</span>
            <span>{formatCurrency(totals.total, currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

