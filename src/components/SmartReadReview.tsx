import React, { useState, useEffect } from 'react';
import {
  ExtractionResult,
  ExpenseItem,
  ExpenseCategory,
  PaymentMethod,
  ExpenseRecord,
} from '../types.ts';
import {
  Check,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  CreditCard,
  Building2,
  Tag,
  FileText,
  Copy,
  Info,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SmartReadReviewProps {
  extraction: ExtractionResult;
  sourceImage: string;
  existingExpenses: ExpenseRecord[];
  onConfirm: (finalExpense: Omit<ExpenseRecord, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  isLiveAI?: boolean;
}

const CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Groceries',
  'Travel & Fuel',
  'Shopping',
  'Bills & Utilities',
  'Health & Medical',
  'Entertainment',
  'Others',
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'UPI',
  'Credit/Debit Card',
  'Cash',
  'Net Banking',
  'Wallet',
  'Other',
];

export const SmartReadReview: React.FC<SmartReadReviewProps> = ({
  extraction,
  sourceImage,
  existingExpenses,
  onConfirm,
  onCancel,
  isLiveAI = false,
}) => {
  // Form State initialized from extraction
  const [merchant, setMerchant] = useState(extraction.merchant);
  const [date, setDate] = useState(extraction.date);
  const [time, setTime] = useState(extraction.time || '');
  const [amount, setAmount] = useState<number>(extraction.amount);
  const [currency, setCurrency] = useState(extraction.currency || '₹');
  const [tax, setTax] = useState<number>(extraction.tax ?? 0);
  const [category, setCategory] = useState<ExpenseCategory>(extraction.category);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(extraction.paymentMethod);
  const [items, setItems] = useState<ExpenseItem[]>(extraction.items || []);
  const [notes, setNotes] = useState<string>('');

  // Track user edits
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());

  // Image zoom state
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const markEdited = (fieldName: string) => {
    setEditedFields((prev) => new Set(prev).add(fieldName));
  };

  // Duplicate Transaction Check
  const potentialDuplicates = existingExpenses.filter((exp) => {
    const isSameMerchant = exp.merchant.trim().toLowerCase() === merchant.trim().toLowerCase();
    const isSimilarAmount = Math.abs(exp.amount - amount) < 2.0;
    return isSameMerchant && isSimilarAmount;
  });

  const hasDuplicateWarning = potentialDuplicates.length > 0;

  // Recalculate line items subtotal if items exist
  const itemsSum = items.reduce((acc, cur) => acc + (cur.totalPrice || 0), 0);
  const itemsSumMismatch = items.length > 0 && Math.abs(itemsSum + (tax || 0) - amount) > 5.0;

  const handleAddItem = () => {
    const newItem: ExpenseItem = {
      id: `item-manual-${Date.now()}`,
      name: 'New item',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    setItems([...items, newItem]);
    markEdited('items');
  };

  const handleUpdateItem = (index: number, updated: Partial<ExpenseItem>) => {
    const next = [...items];
    const curr = next[index];
    const qty = updated.quantity !== undefined ? updated.quantity : curr.quantity || 1;
    const unitP = updated.unitPrice !== undefined ? updated.unitPrice : curr.unitPrice || 0;
    const totalP = updated.totalPrice !== undefined ? updated.totalPrice : qty * unitP;

    next[index] = {
      ...curr,
      ...updated,
      quantity: qty,
      unitPrice: unitP,
      totalPrice: totalP,
    };
    setItems(next);
    markEdited('items');
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    markEdited('items');
  };

  const handleConfirm = () => {
    // Fire pleasant confetti burst on confirmation
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#E07A5F', '#2A9D8F', '#F4A261', '#2D2B2A'],
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }

    onConfirm({
      merchant,
      date,
      time,
      amount,
      currency,
      tax,
      category,
      paymentMethod,
      items,
      sourceImage,
      sourceType: extraction.sourceType,
      confidenceScores: extraction.confidenceScores,
      uncertainties: extraction.uncertainties,
      isEdited: editedFields.size > 0,
      notes,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Breadcrumb & Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E8E2D5]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg bg-[#EFEAE1] hover:bg-[#E5DFD4] text-[#5C5549] transition-colors"
            title="Back to Capture"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl md:text-2xl font-bold text-[#1E1E1E]">
                What We Found
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#E07A5F]/10 text-[#C85A17] border border-[#E07A5F]/20">
                Step 2: Understand & Verify
              </span>
            </div>
            <p className="text-xs text-[#7D7565] mt-0.5">
              Review extracted visible data. Edit any field below before confirming to your personal ledger.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {isLiveAI ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Gemini 3.8 Flash Vision</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAE1] text-[#5C5549] border border-[#DDD5C5] font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-[#2A9D8F]" />
              <span>Verified Sample Read</span>
            </span>
          )}
        </div>
      </div>

      {/* Duplicate Warning Callout if found */}
      {hasDuplicateWarning && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Possible duplicate transaction detected:</span>
            <p className="text-amber-800 leading-relaxed">
              You already recorded an expense of {currency}
              {potentialDuplicates[0].amount.toFixed(2)} at {potentialDuplicates[0].merchant} on{' '}
              {potentialDuplicates[0].date}. If this was a separate purchase or repeat coffee, you can proceed with confidence.
            </p>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Inspector of Original Slip */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E0D7C6] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFEAE1] mb-3">
            <span className="text-xs font-semibold text-[#5C5549] uppercase tracking-wider">
              Original Artifact
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                className="p-1.5 rounded-md hover:bg-[#F5F1E9] text-[#5C5549]"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="px-1.5 py-0.5 text-[11px] font-mono rounded hover:bg-[#F5F1E9] text-[#5C5549]"
                title="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
                className="p-1.5 rounded-md hover:bg-[#F5F1E9] text-[#5C5549]"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Image Frame */}
          <div className="relative h-[380px] sm:h-[460px] bg-[#F7F5EE] rounded-xl overflow-hidden border border-[#E8E2D5] flex items-center justify-center p-2">
            <img
              src={sourceImage}
              alt="Uploaded receipt or payment"
              referrerPolicy="no-referrer"
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-h-full max-w-full object-contain rounded-md transition-transform duration-150 origin-center select-none shadow-xs"
            />
          </div>

          {/* Extraction Confidence Summary */}
          <div className="mt-4 pt-3 border-t border-[#EFEAE1] space-y-2">
            <div className="text-xs font-medium text-[#7D7565] flex items-center justify-between">
              <span>Extraction Fidelity</span>
              <span className="font-mono text-[#1E1E1E]">
                {Math.round(
                  ((extraction.confidenceScores.merchant +
                    extraction.confidenceScores.amount +
                    extraction.confidenceScores.date) /
                    3) *
                    100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-[#EFEAE1] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2A9D8F] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(
                    ((extraction.confidenceScores.merchant +
                      extraction.confidenceScores.amount +
                      extraction.confidenceScores.date) /
                      3) *
                      100
                  )}%`,
                }}
              />
            </div>

            {/* Uncertainty Flags */}
            {extraction.uncertainties && extraction.uncertainties.length > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-[#FDFBF7] border border-[#E5DFD4] space-y-1.5">
                <span className="text-[11px] font-bold text-[#8C5E28] uppercase tracking-wide flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Reader Observations & Uncertainty</span>
                </span>
                <ul className="text-xs text-[#6B6356] space-y-1 pl-1 list-disc list-inside">
                  {extraction.uncertainties.map((u, i) => (
                    <li key={i} className="leading-snug">
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pocket Ledger Bill Sheet */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#DDD5C5] rounded-2xl shadow-sm receipt-serrated-top p-6 sm:p-8 relative">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#8C8474]">
                Kharcha Slip #{Math.floor(1000 + Math.random() * 9000)}
              </span>
              <h3 className="font-heading text-xl font-bold text-[#1E1E1E]">
                Expense Audit & Classification
              </h3>
            </div>
            {editedFields.size > 0 && (
              <span className="text-[11px] font-medium text-[#C85A17] bg-[#E07A5F]/10 border border-[#E07A5F]/20 px-2 py-0.5 rounded">
                {editedFields.size} field{editedFields.size > 1 ? 's' : ''} edited
              </span>
            )}
          </div>

          <div className="space-y-5">
            {/* Merchant Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#5C5549] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Merchant / Payee Name</span>
                </label>
                {editedFields.has('merchant') ? (
                  <span className="text-[10px] text-[#C85A17]">Edited by you</span>
                ) : (
                  <span className="text-[10px] text-[#2A9D8F]">Auto-extracted</span>
                )}
              </div>
              <input
                type="text"
                value={merchant}
                onChange={(e) => {
                  setMerchant(e.target.value);
                  markEdited('merchant');
                }}
                className="w-full text-base font-semibold text-[#1E1E1E] bg-[#FBF9F5] border border-[#D5CCBC] rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40"
              />
            </div>

            {/* Amount, Currency & Tax Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#5C5549]">
                    Total Amount
                  </label>
                  {editedFields.has('amount') ? (
                    <span className="text-[10px] text-[#C85A17]">Edited</span>
                  ) : (
                    <span className="text-[10px] text-[#2A9D8F]">Auto-extracted</span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-base font-bold text-[#5C5549]">
                    {currency}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => {
                      setAmount(parseFloat(e.target.value) || 0);
                      markEdited('amount');
                    }}
                    className="w-full font-mono text-xl font-bold text-[#1E1E1E] bg-[#FBF9F5] border border-[#D5CCBC] rounded-lg pl-8 pr-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40 tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5C5549] block mb-1.5">
                  Tax / GST ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={tax}
                  onChange={(e) => {
                    setTax(parseFloat(e.target.value) || 0);
                    markEdited('tax');
                  }}
                  className="w-full font-mono text-sm font-semibold text-[#1E1E1E] bg-[#FBF9F5] border border-[#D5CCBC] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40 tabular-nums"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#5C5549] block mb-1.5">
                  Payment Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      markEdited('date');
                    }}
                    className="w-full text-sm font-medium text-[#1E1E1E] bg-[#FBF9F5] border border-[#D5CCBC] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5C5549] block mb-1.5">
                  Time (if visible)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:34 AM"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    markEdited('time');
                  }}
                  className="w-full text-sm font-medium text-[#1E1E1E] bg-[#FBF9F5] border border-[#D5CCBC] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40"
                />
              </div>
            </div>

            {/* Category Suggestion & Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#5C5549] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Category Classification</span>
                </label>
                <span className="text-[11px] text-[#7D7565]">Smart Suggestion</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        markEdited('category');
                      }}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#2D2B2A] text-white shadow-xs'
                          : 'bg-[#F5F1E9] text-[#5C5549] hover:bg-[#EBE4D7] border border-[#E0D7C6]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-xs font-semibold text-[#5C5549] block mb-1.5">
                Payment Channel
              </label>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = paymentMethod === pm;
                  return (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(pm);
                        markEdited('paymentMethod');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#2A9D8F] text-white shadow-xs'
                          : 'bg-[#F5F1E9] text-[#5C5549] hover:bg-[#EBE4D7] border border-[#E0D7C6]'
                      }`}
                    >
                      {pm}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Itemized Line Items Breakdown */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5C5549]">
                    Line Items Breakdown
                  </h4>
                  <p className="text-[11px] text-[#7D7565]">
                    {items.length > 0
                      ? `${items.length} item${items.length > 1 ? 's' : ''} extracted from bill`
                      : 'No printed items found (standard for UPI screens)'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#E07A5F] hover:text-[#C85A17]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              </div>

              {items.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#FBF9F5] border border-dashed border-[#DDD5C5] text-center text-xs text-[#7D7565]">
                  <FileText className="w-5 h-5 mx-auto mb-1 text-[#C5BBA7]" />
                  <span>
                    UPI payment screenshots contain merchant and total amounts only.
                    KharchaKatha never hallucinates missing grocery lines.
                  </span>
                </div>
              ) : (
                <div className="border border-[#E5DFD4] rounded-xl overflow-hidden bg-[#FDFBF7]">
                  <div className="max-h-60 overflow-y-auto divide-y divide-[#EFEAE1]">
                    {items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-2.5 sm:px-3 sm:py-2 flex items-center gap-2 text-xs"
                      >
                        <input
                          type="text"
                          value={item.name}
                          placeholder="Item name"
                          onChange={(e) =>
                            handleUpdateItem(idx, { name: e.target.value })
                          }
                          className="flex-1 bg-white border border-[#E0D7C6] rounded px-2 py-1 text-xs font-medium text-[#1E1E1E]"
                        />
                        <div className="w-16">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity || 1}
                            placeholder="Qty"
                            onChange={(e) =>
                              handleUpdateItem(idx, {
                                quantity: parseInt(e.target.value) || 1,
                              })
                            }
                            className="w-full bg-white border border-[#E0D7C6] rounded px-2 py-1 text-xs text-center font-mono tabular-nums"
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            step="0.01"
                            value={item.totalPrice}
                            placeholder="Price"
                            onChange={(e) =>
                              handleUpdateItem(idx, {
                                totalPrice: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-white border border-[#E0D7C6] rounded px-2 py-1 text-xs text-right font-mono font-semibold tabular-nums"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-[#A89F91] hover:text-red-600 rounded transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Line items sum check */}
                  {items.length > 0 && (
                    <div className="bg-[#F5F1E9] px-3 py-2 text-xs flex items-center justify-between border-t border-[#E5DFD4]">
                      <span className="font-medium text-[#7D7565]">Items Subtotal:</span>
                      <span className="font-mono font-bold text-[#1E1E1E]">
                        {currency}
                        {itemsSum.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {itemsSumMismatch && (
                <p className="mt-1.5 text-[11px] text-amber-700 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>
                    Note: Items subtotal ({currency}
                    {itemsSum.toFixed(2)}) + tax ({currency}
                    {tax.toFixed(2)}) differs slightly from total ({currency}
                    {amount.toFixed(2)}).
                  </span>
                </p>
              )}
            </div>

            {/* Personal Memory / Note */}
            <div>
              <label className="text-xs font-semibold text-[#5C5549] block mb-1">
                Story Note / Context (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Chai with team after sprint kickoff, or weekly pantry refill"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs text-[#1E1E1E] bg-[#FBF9F5] border border-[#D5CCBC] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40"
              />
            </div>

            {/* Clear Next Action: Confirm Expense Button */}
            <div className="pt-4 border-t border-[#E8E2D5] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border border-[#D5CCBC] text-[#5C5549] hover:bg-[#F5F1E9] text-xs font-semibold transition-all"
              >
                Discard & Rescan
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-[#2D2B2A] hover:bg-[#1E1E1E] active:scale-[0.98] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2.5 group"
              >
                <Check className="w-4 h-4 text-[#2A9D8F] group-hover:scale-110 transition-transform" />
                <span>Confirm Expense & Weave Story</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
