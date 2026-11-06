import React from 'react';
import { ExpenseRecord } from '../types.ts';
import { X, Receipt, Calendar, CreditCard, ShieldCheck, Tag, Info, FileText } from 'lucide-react';

interface ReceiptModalProps {
  expense: ExpenseRecord | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ expense, onClose }) => {
  if (!expense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] border border-[#DDD5C5] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Top Header */}
        <div className="sticky top-0 bg-[#FFFFFF] border-b border-[#E8E2D5] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EFEAE1] flex items-center justify-center text-[#2D2B2A]">
              <Receipt className="w-4 h-4 text-[#E07A5F]" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1E1E1E]">
                {expense.merchant}
              </h3>
              <p className="text-xs text-[#7D7565]">
                Audit Slip · Recorded on {expense.date}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7D7565] hover:text-[#1E1E1E] hover:bg-[#F5F1E9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Source Artifact Image (if stored) */}
          {expense.sourceImage ? (
            <div>
              <span className="text-xs font-semibold text-[#5C5549] uppercase tracking-wider block mb-2">
                Original Verified Slip
              </span>
              <div className="h-64 sm:h-80 bg-[#F7F5EE] rounded-xl overflow-hidden border border-[#E8E2D5] flex items-center justify-center p-2">
                <img
                  src={expense.sourceImage}
                  alt={expense.merchant}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain rounded select-none shadow-xs"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#FBF9F5] border border-dashed border-[#DDD5C5] text-center text-xs text-[#7D7565]">
              <FileText className="w-6 h-6 mx-auto mb-1 text-[#C5BBA7]" />
              <span>Manual transaction entry (no physical photo attached)</span>
            </div>
          )}

          {/* Key Slip Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FDFBF7] p-3.5 rounded-xl border border-[#E8E2D5]">
            <div>
              <span className="text-[11px] text-[#7D7565] block">Total Amount</span>
              <span className="font-mono text-base font-bold text-[#1E1E1E]">
                {expense.currency}
                {expense.amount.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#7D7565] block">Category</span>
              <span className="text-xs font-semibold text-[#1E1E1E]">
                {expense.category}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#7D7565] block">Channel</span>
              <span className="text-xs font-semibold text-[#1E1E1E]">
                {expense.paymentMethod}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#7D7565] block">Tax/GST</span>
              <span className="font-mono text-xs font-semibold text-[#1E1E1E]">
                {expense.tax ? `${expense.currency}${expense.tax.toFixed(2)}` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Line Items List if exists */}
          {expense.items && expense.items.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-[#5C5549] uppercase tracking-wider">
                  Itemized Breakdown ({expense.items.length})
                </h4>
              </div>
              <div className="border border-[#E5DFD4] rounded-xl overflow-hidden divide-y divide-[#EFEAE1] bg-white">
                {expense.items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="px-3.5 py-2 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-medium text-[#1E1E1E]">{item.name}</span>
                      {item.quantity && item.quantity > 1 && (
                        <span className="text-[11px] text-[#7D7565] ml-2">
                          × {item.quantity}
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-semibold text-[#1E1E1E]">
                      {expense.currency}
                      {item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes or Uncertainties */}
          {expense.uncertainties && expense.uncertainties.length > 0 && (
            <div className="p-3 bg-[#FBF9F5] border border-[#E8E2D5] rounded-xl text-xs space-y-1">
              <span className="font-bold text-[#8C5E28] block">
                Verification Observations:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[#6B6356]">
                {expense.uncertainties.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          )}

          {expense.notes && (
            <div className="text-xs text-[#5C5549]">
              <span className="font-semibold block mb-0.5">Story Note:</span>
              <p className="italic bg-[#F5F1E9] p-2.5 rounded-lg border border-[#E0D7C6]">
                "{expense.notes}"
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-[#E8E2D5] px-6 py-3.5 bg-[#FDFBF7] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2D2B2A] text-white text-xs font-semibold rounded-lg hover:bg-[#1E1E1E] transition-colors"
          >
            Close Slip
          </button>
        </div>
      </div>
    </div>
  );
};
