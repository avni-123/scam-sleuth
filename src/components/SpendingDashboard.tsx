import React, { useState, useMemo } from 'react';
import {
  ExpenseRecord,
  ExpenseCategory,
  PaymentMethod,
} from '../types.ts';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Search,
  Filter,
  TrendingUp,
  Receipt,
  Download,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Trash2,
  FileSpreadsheet,
  Clock,
  Tag,
  CreditCard,
  PlusCircle,
  Target,
  Edit3,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface SpendingDashboardProps {
  expenses: ExpenseRecord[];
  onDeleteExpense: (id: string) => void;
  onOpenReceiptModal: (expense: ExpenseRecord) => void;
  onNavigateToCapture: () => void;
  latestConfirmedId?: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#E07A5F',
  'Groceries': '#2A9D8F',
  'Travel & Fuel': '#3D5A80',
  'Shopping': '#F4A261',
  'Bills & Utilities': '#E76F51',
  'Health & Medical': '#457B9D',
  'Entertainment': '#9D4EDD',
  'Others': '#8D99AE',
};

export const SpendingDashboard: React.FC<SpendingDashboardProps> = ({
  expenses,
  onDeleteExpense,
  onOpenReceiptModal,
  onNavigateToCapture,
  latestConfirmedId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');

  // Monthly Spending Budget Goal state (persisted in localStorage)
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('kharchakatha_monthly_budget');
      return saved ? parseFloat(saved) : 10000;
    } catch {
      return 10000;
    }
  });
  const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);
  const [budgetInput, setBudgetInput] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('kharchakatha_monthly_budget');
      return saved || '10000';
    } catch {
      return '10000';
    }
  });

  const handleSaveBudget = (amountToSave?: number) => {
    const val = amountToSave !== undefined ? amountToSave : parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) {
      setMonthlyBudget(val);
      setBudgetInput(val.toString());
      try {
        localStorage.setItem('kharchakatha_monthly_budget', val.toString());
      } catch {
        // ignore
      }
    }
    setIsEditingBudget(false);
  };

  // Grounded Totals & Metrics Calculation
  const totalSpent = useMemo(() => {
    return expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);
  }, [expenses]);

  // Budget progress calculations
  const rawBudgetPercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const progressPercentage = Math.min(Math.max(rawBudgetPercentage, 0), 100);
  const remainingBudget = monthlyBudget - totalSpent;
  const isOverBudget = remainingBudget < 0;

  // Calculate days remaining in current month for daily pacing
  const { daysRemaining, currentMonthName } = useMemo(() => {
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const daysLeft = Math.max(1, lastDayOfMonth - currentDay + 1);
    const monthName = now.toLocaleString('en-US', { month: 'long' });
    return { daysRemaining: daysLeft, currentMonthName: monthName };
  }, []);

  const safeDailyAllowance = remainingBudget > 0 ? Math.round(remainingBudget / daysRemaining) : 0;

  const priorMonthBaseline = 18450.0; // Benchmark comparison
  const deltaVsPrior = ((totalSpent - priorMonthBaseline) / priorMonthBaseline) * 100;

  // Category breakdown aggregation
  const categoryData = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    expenses.forEach((exp) => {
      const cat = exp.category || 'Others';
      if (!map[cat]) map[cat] = { total: 0, count: 0 };
      map[cat].total += exp.amount;
      map[cat].count += 1;
    });

    return Object.entries(map)
      .map(([name, val]) => ({
        name,
        value: Math.round(val.total),
        count: val.count,
        percentage: totalSpent > 0 ? Math.round((val.total / totalSpent) * 100) : 0,
        color: CATEGORY_COLORS[name] || '#8D99AE',
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, totalSpent]);

  // Spending Rhythm Timeline (Aggregated by day)
  const rhythmData = useMemo(() => {
    const dateMap: Record<string, number> = {};
    expenses.forEach((exp) => {
      const dateKey = exp.date || 'Undated';
      dateMap[dateKey] = (dateMap[dateKey] || 0) + exp.amount;
    });

    return Object.entries(dateMap)
      .map(([rawDate, amount]) => {
        // Format for clean display: e.g. "Nov 2"
        let displayDate = rawDate;
        try {
          const d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
        } catch {
          // ignore
        }
        return {
          rawDate,
          date: displayDate,
          amount: Math.round(amount),
        };
      })
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate));
  }, [expenses]);

  // Dynamic spending story insight strictly grounded in transaction facts
  const dynamicStoryInsight = useMemo(() => {
    if (expenses.length === 0) {
      return 'No transactions recorded yet. Drop your first receipt above to begin your spending story.';
    }

    const topCategory = categoryData[0];
    const topCatName = topCategory ? topCategory.name : 'Expenses';
    const topCatPercent = topCategory ? topCategory.percentage : 0;
    const topCatCount = topCategory ? topCategory.count : 0;

    const avgTransaction = Math.round(totalSpent / expenses.length);

    const upiCount = expenses.filter((e) => e.paymentMethod === 'UPI').length;
    const upiShare = Math.round((upiCount / expenses.length) * 100);

    let insight = `${topCatName} is your largest spending category right now (${topCatPercent}% of total, ₹${topCategory.value.toLocaleString()}), driven by ${topCatCount} recorded payment${topCatCount > 1 ? 's' : ''}. `;

    if (upiShare > 50) {
      insight += `UPI dominates your payment rhythm, powering ${upiShare}% of your daily purchases. `;
    }

    insight += `Your average spend per transaction sits at ₹${avgTransaction.toLocaleString()}.`;

    return insight;
  }, [expenses, categoryData, totalSpent]);

  // Filtered transactions for recent activity ledger
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch =
        searchQuery === '' ||
        exp.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exp.notes && exp.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        exp.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'all' || exp.category === selectedCategory;

      const matchesPay =
        selectedPaymentMethod === 'all' || exp.paymentMethod === selectedPaymentMethod;

      return matchesSearch && matchesCat && matchesPay;
    });
  }, [expenses, searchQuery, selectedCategory, selectedPaymentMethod]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Merchant', 'Date', 'Time', 'Amount', 'Currency', 'Tax', 'Category', 'Payment Method', 'Items Count', 'Notes'];
    const rows = expenses.map((e) => [
      `"${e.merchant.replace(/"/g, '""')}"`,
      `"${e.date}"`,
      `"${e.time || ''}"`,
      e.amount,
      `"${e.currency}"`,
      e.tax || 0,
      `"${e.category}"`,
      `"${e.paymentMethod}"`,
      e.items.length,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KharchaKatha_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10 space-y-8">
      {/* Dynamic Spending Story Banner (Connecting Confirmed Expense to Discovery) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2D2B2A] to-[#1E1E1E] text-white p-6 sm:p-8 shadow-md">
        {/* Subtle decorative ledger lines */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#E07A5F]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#2A9D8F]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2 text-[#E07A5F] text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Living Spending Story</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 leading-snug">
              Every payment tells your narrative.
            </h2>
            <p className="text-sm sm:text-base text-[#D5CEBF] leading-relaxed">
              {dynamicStoryInsight}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={onNavigateToCapture}
              className="px-4 py-2.5 bg-[#E07A5F] hover:bg-[#C85A17] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Another Slip</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm rounded-xl transition-colors border border-white/10 flex items-center gap-1.5"
              title="Export Ledger as CSV"
            >
              <Download className="w-4 h-4 text-[#F4A261]" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Spending Budget Goal & Runway Progress Bar */}
      <div className="bg-[#FFFFFF] border border-[#E0D7C6] rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Subtle top indicator bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 transition-colors ${
            isOverBudget ? 'bg-[#E76F51]' : rawBudgetPercentage >= 80 ? 'bg-[#E07A5F]' : 'bg-[#2A9D8F]'
          }`}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isOverBudget
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : rawBudgetPercentage >= 80
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base sm:text-lg font-bold text-[#1E1E1E]">
                  Monthly Spending Budget Goal
                </h3>
                <span className="text-[11px] font-semibold text-[#7D7565]">
                  · {currentMonthName} Cap
                </span>
              </div>
              <p className="text-xs text-[#7D7565]">
                {isOverBudget
                  ? `Goal exceeded by ₹${Math.abs(remainingBudget).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
                  : `₹${remainingBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 })} remaining (${daysRemaining} day${daysRemaining > 1 ? 's' : ''} left in ${currentMonthName})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditingBudget ? (
              <button
                type="button"
                onClick={() => {
                  setBudgetInput(monthlyBudget.toString());
                  setIsEditingBudget(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5C5549] hover:text-[#1E1E1E] bg-[#F5F1E9] hover:bg-[#EBE4D7] rounded-lg border border-[#D5CCBC] transition-all active:scale-[0.98]"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Adjust Goal</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Quick Edit Mode Form */}
        {isEditingBudget && (
          <div className="mb-5 p-4 rounded-xl bg-[#FDFBF7] border border-[#E5DFD4] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5C5549] uppercase tracking-wider">
                Set Target Monthly Limit
              </span>
              <span className="text-[11px] text-[#7D7565]">
                Changes apply instantly across your ledger
              </span>
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#7D7565] mr-1">Presets:</span>
              {[5000, 8000, 10000, 15000, 20000, 30000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSaveBudget(preset)}
                  className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md border transition-all ${
                    monthlyBudget === preset
                      ? 'bg-[#2D2B2A] text-white border-[#2D2B2A]'
                      : 'bg-white text-[#5C5549] border-[#DDD5C5] hover:bg-[#F5F1E9]'
                  }`}
                >
                  ₹{preset.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-[#7D7565]">
                  ₹
                </span>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="e.g. 12000"
                  className="w-full pl-7 pr-3 py-1.5 text-sm font-mono font-bold text-[#1E1E1E] bg-white border border-[#D5CCBC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveBudget()}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#2D2B2A] hover:bg-[#1E1E1E] rounded-lg transition-colors flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5 text-[#2A9D8F]" />
                  <span>Save Goal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingBudget(false)}
                  className="px-3 py-1.5 text-xs font-medium text-[#7D7565] hover:bg-[#EFEAE1] rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* The Progress Bar Container */}
        <div className="space-y-2">
          {/* Progress Bar Headings & Value Indicators */}
          <div className="flex items-end justify-between text-xs">
            <div>
              <span className="font-mono text-base font-extrabold text-[#1E1E1E] tabular-nums">
                ₹{totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
              <span className="text-[#7D7565] ml-1.5 font-medium">
                spent of ₹{monthlyBudget.toLocaleString('en-IN')} goal
              </span>
            </div>

            <div className="text-right">
              <span
                className={`font-mono font-bold text-sm tabular-nums ${
                  isOverBudget
                    ? 'text-red-700'
                    : rawBudgetPercentage >= 80
                    ? 'text-[#C85A17]'
                    : 'text-[#2A9D8F]'
                }`}
              >
                {Math.round(rawBudgetPercentage)}%
              </span>
              <span className="text-[#7D7565] text-[11px] ml-1">
                {isOverBudget ? 'exceeded' : 'utilized'}
              </span>
            </div>
          </div>

          {/* Graphical Progress Bar Track */}
          <div className="h-4 sm:h-5 w-full bg-[#EFEAE1] rounded-full overflow-hidden border border-[#E0D7C6] p-0.5 relative shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 relative ${
                isOverBudget
                  ? 'bg-gradient-to-r from-[#E07A5F] to-[#E76F51]'
                  : rawBudgetPercentage >= 80
                  ? 'bg-[#E07A5F]'
                  : 'bg-[#2A9D8F]'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />

            {/* Visual Milestone Markers at 50% and 75% */}
            <div
              className="absolute top-0 bottom-0 w-[1px] bg-[#DDD5C5] pointer-events-none"
              style={{ left: '50%' }}
              title="50% Milestone"
            />
            <div
              className="absolute top-0 bottom-0 w-[1px] bg-[#DDD5C5] pointer-events-none"
              style={{ left: '75%' }}
              title="75% Milestone"
            />
          </div>

          {/* Sub-Metric Runway Details */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#5C5549] border-t border-[#F5F1E9] mt-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#7D7565]">Available Balance:</span>
              <span
                className={`font-mono font-semibold tabular-nums ${
                  isOverBudget ? 'text-red-700' : 'text-[#1E1E1E]'
                }`}
              >
                {isOverBudget ? `-₹${Math.abs(remainingBudget).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : `₹${remainingBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:justify-center">
              <span className="text-[#7D7565]">Daily Runway Pace:</span>
              <span className="font-mono font-semibold text-[#1E1E1E] tabular-nums">
                {isOverBudget ? '₹0 / day' : `~₹${safeDailyAllowance.toLocaleString()} / day`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:justify-end">
              <span className="text-[#7D7565]">Pacing Status:</span>
              <span
                className={`font-semibold ${
                  isOverBudget
                    ? 'text-red-700'
                    : rawBudgetPercentage >= 80
                    ? 'text-[#C85A17]'
                    : 'text-[#2A9D8F]'
                }`}
              >
                {isOverBudget
                  ? 'Over Budget'
                  : rawBudgetPercentage >= 80
                  ? 'High Consumption'
                  : 'On Track'}
              </span>
            </div>
          </div>
        </div>

        {/* Warning Callout if Over Budget */}
        {isOverBudget && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              You have exceeded your monthly goal by ₹{Math.abs(remainingBudget).toLocaleString('en-IN', { maximumFractionDigits: 0 })}.
              Consider reviewing discretionary dining or increasing your target goal.
            </span>
          </div>
        )}
      </div>

      {/* KPI Ledger Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: This Month Total */}
        <div className="bg-[#FFFFFF] border border-[#E0D7C6] rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#7D7565] block mb-1">
            Total Spent this Period
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#1E1E1E] tabular-nums">
            ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] text-[#5C5549] flex items-center gap-1 font-medium">
            <span className="text-[#2A9D8F] font-semibold">Active Ledger</span>
            <span>·</span>
            <span>{expenses.length} payments recorded</span>
          </div>
        </div>

        {/* Metric 2: Top Category */}
        <div className="bg-[#FFFFFF] border border-[#E0D7C6] rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#7D7565] block mb-1">
            Top Spending Pillar
          </span>
          <div className="font-heading text-xl sm:text-2xl font-bold text-[#1E1E1E] truncate">
            {categoryData[0]?.name || 'None'}
          </div>
          <div className="mt-2 text-[11px] text-[#5C5549] flex items-center gap-1">
            <span className="font-mono font-semibold text-[#1E1E1E]">
              ₹{(categoryData[0]?.value || 0).toLocaleString()}
            </span>
            <span>({categoryData[0]?.percentage || 0}% of all spend)</span>
          </div>
        </div>

        {/* Metric 3: Average Transaction */}
        <div className="bg-[#FFFFFF] border border-[#E0D7C6] rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#7D7565] block mb-1">
            Average Ticket Size
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#1E1E1E] tabular-nums">
            ₹{expenses.length > 0 ? Math.round(totalSpent / expenses.length).toLocaleString() : 0}
          </div>
          <div className="mt-2 text-[11px] text-[#7D7565]">
            Per store bill / UPI transfer
          </div>
        </div>

        {/* Metric 4: Receipts with Photos */}
        <div className="bg-[#FFFFFF] border border-[#E0D7C6] rounded-2xl p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#7D7565] block mb-1">
            Visual Proof Stored
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#1E1E1E] tabular-nums">
            {expenses.filter((e) => e.sourceImage).length} / {expenses.length}
          </div>
          <div className="mt-2 text-[11px] text-[#2A9D8F] font-medium flex items-center gap-1">
            <Receipt className="w-3.5 h-3.5" />
            <span>Auditable original slips</span>
          </div>
        </div>
      </div>

      {/* Visualizations Grid: Where It Went (Category) + Spending Rhythm (Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Category Breakdown Donut + Accessible Table */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E0D7C6] rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EFEAE1]">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1E1E1E]">
                Where It Went
              </h3>
              <p className="text-xs text-[#7D7565]">
                Category distribution with exact values and percentages
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-[#7D7565]">
              {categoryData.length} active categories
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Chart */}
            <div className="sm:col-span-5 h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [
                      `₹${Number(val || 0).toLocaleString()}`,
                      'Spent',
                    ]}
                    contentStyle={{
                      backgroundColor: '#2D2B2A',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Accessible Text Breakdown List */}
            <div className="sm:col-span-7 space-y-2.5">
              {categoryData.map((cat) => (
                <div key={cat.name} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[#1E1E1E] flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                    </span>
                    <span className="font-mono text-[#5C5549] tabular-nums">
                      ₹{cat.value.toLocaleString()} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#EFEAE1] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spending Rhythm (Daily pulse) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E0D7C6] rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EFEAE1]">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1E1E1E]">
                Spending Rhythm
              </h3>
              <p className="text-xs text-[#7D7565]">
                Daily transaction volume and payment pulses
              </p>
            </div>
            <Clock className="w-4 h-4 text-[#7D7565]" />
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rhythmData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEAE1" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#7D7565' }}
                  axisLine={{ stroke: '#DDD5C5' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#7D7565' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  formatter={(val: any) => [
                    `₹${Number(val || 0).toLocaleString()}`,
                    'Daily Total',
                  ]}
                  contentStyle={{
                    backgroundColor: '#2D2B2A',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="amount" fill="#E07A5F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EFEAE1] text-[11px] text-[#7D7565] flex items-center justify-between">
            <span>Aggregated by confirmed date</span>
            <span className="font-mono text-[#1E1E1E]">
              {rhythmData.length} payment day{rhythmData.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity: Searchable & Filterable Pocket Ledger */}
      <div className="bg-[#FFFFFF] border border-[#E0D7C6] rounded-2xl shadow-xs overflow-hidden">
        {/* Ledger Header & Search Controls */}
        <div className="p-4 sm:p-6 border-b border-[#E8E2D5] bg-[#FDFBF7] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-lg font-bold text-[#1E1E1E]">
                Recent Activity Ledger
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#EFEAE1] text-[#5C5549]">
                {filteredExpenses.length} of {expenses.length}
              </span>
            </div>
            <p className="text-xs text-[#7D7565]">
              Every confirmed payment with merchant, items, payment channel, and audit slip
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7D7565]" />
              <input
                type="text"
                placeholder="Search merchant, item, note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#D5CCBC] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E07A5F]"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-[#FFFFFF] border border-[#D5CCBC] rounded-lg px-2.5 py-1.5 text-[#5C5549] focus:outline-none focus:ring-1 focus:ring-[#E07A5F]"
            >
              <option value="all">All Categories</option>
              {Object.keys(CATEGORY_COLORS).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Payment Method Filter */}
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="text-xs bg-[#FFFFFF] border border-[#D5CCBC] rounded-lg px-2.5 py-1.5 text-[#5C5549] focus:outline-none focus:ring-1 focus:ring-[#E07A5F]"
            >
              <option value="all">All Channels</option>
              <option value="UPI">UPI</option>
              <option value="Credit/Debit Card">Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        {/* Ledger Entries List */}
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#7D7565]">
            <Receipt className="w-8 h-8 mx-auto mb-2 text-[#C5BBA7]" />
            <p className="font-semibold text-[#1E1E1E] text-sm">No expenses matched your filter</p>
            <p className="mt-1">Try clearing your search query or selecting All Categories.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#EFEAE1]">
            {filteredExpenses.map((exp) => {
              const isNewlyAdded = exp.id === latestConfirmedId;

              return (
                <div
                  key={exp.id}
                  className={`p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FDFBF7] transition-colors ${
                    isNewlyAdded ? 'bg-amber-50/70 border-l-4 border-[#E07A5F]' : ''
                  }`}
                >
                  {/* Left: Merchant & Info */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[exp.category] || '#8D99AE'}15`,
                        color: CATEGORY_COLORS[exp.category] || '#8D99AE',
                      }}
                    >
                      <Receipt className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading text-sm sm:text-base font-bold text-[#1E1E1E]">
                          {exp.merchant}
                        </h4>
                        {isNewlyAdded && (
                          <span className="text-[10px] font-bold bg-[#E07A5F] text-white px-2 py-0.5 rounded-full animate-pulse">
                            Just Confirmed
                          </span>
                        )}
                        {exp.isEdited && (
                          <span className="text-[10px] text-[#7D7565] border border-[#DDD5C5] px-1.5 py-0.2 rounded">
                            Verified & Edited
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#7D7565] mt-0.5">
                        <span className="font-medium text-[#1E1E1E]">{exp.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#A89F91]" />
                          <span>{exp.date}</span>
                          {exp.time && <span>({exp.time})</span>}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-[#A89F91]" />
                          <span>{exp.paymentMethod}</span>
                        </span>
                        {exp.items && exp.items.length > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{exp.items.length} item{exp.items.length > 1 ? 's' : ''}</span>
                          </>
                        )}
                      </div>

                      {exp.notes && (
                        <p className="text-[11px] text-[#5C5549] mt-1 italic">
                          "{exp.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F5F1E9]">
                    <div className="text-right">
                      <div className="font-mono text-base sm:text-lg font-bold text-[#1E1E1E] tabular-nums">
                        {exp.currency}
                        {exp.amount.toFixed(2)}
                      </div>
                      {exp.tax && exp.tax > 0 ? (
                        <div className="text-[10px] text-[#7D7565]">
                          incl. {exp.currency}{exp.tax.toFixed(2)} tax
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenReceiptModal(exp)}
                        className="p-2 rounded-lg bg-[#F5F1E9] hover:bg-[#EBE4D7] text-[#2D2B2A] transition-colors"
                        title="View Original Slip & Audit Breakdown"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteExpense(exp.id)}
                        className="p-2 rounded-lg text-[#A89F91] hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
