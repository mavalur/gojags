import { useNavigate } from 'react-router-dom';
import { useFinance } from '../contexts/FinanceContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { CATEGORY_LABELS } from '../services/finance.service';
import type { Category } from '../types';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import TransactionList from '../components/TransactionList';
import './Dashboard.css';

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function catLabel(key: string): string {
  return CATEGORY_LABELS[key as Category] ?? key;
}

export default function Dashboard() {
  const { summary, expenseBreakdown, incomeBreakdown, transactions } = useFinance();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isEditor = currentUser?.role === 'editor';
  const isDark = theme === 'dark';

  const monthlyData = getMonthlyData(transactions);

  const chartStyle = {
    grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    tick: isDark ? '#9ca3af' : '#6b7280',
    tooltipBg: isDark ? '#1c1c2e' : '#ffffff',
    tooltipBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    tooltipColor: isDark ? '#f1f1f7' : '#1a1a2e',
  };

  return (
    <div className="dashboard">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-header">
            <span className="summary-card-label">Total Balance</span>
            <div className="summary-card-icon balance">
              <Wallet size={20} />
            </div>
          </div>
          <div
            className={`summary-card-amount ${
              summary.balance >= 0 ? 'positive' : 'negative'
            }`}
          >
            {formatCurrency(summary.balance)}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-header">
            <span className="summary-card-label">Total Income</span>
            <div className="summary-card-icon income">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="summary-card-amount positive">
            {formatCurrency(summary.totalIncome)}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-header">
            <span className="summary-card-label">Total Expenses</span>
            <div className="summary-card-icon expense">
              <TrendingDown size={20} />
            </div>
          </div>
          <div className="summary-card-amount negative">
            {formatCurrency(summary.totalExpense)}
          </div>
        </div>
      </div>

      {/* Charts */}
      {transactions.length > 0 ? (
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-card-title">Monthly Overview</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.grid} />
                <XAxis dataKey="month" tick={{ fill: chartStyle.tick, fontSize: 12 }} />
                <YAxis tick={{ fill: chartStyle.tick, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: chartStyle.tooltipBg,
                    border: `1px solid ${chartStyle.tooltipBorder}`,
                    borderRadius: 8,
                    color: chartStyle.tooltipColor,
                  }}
                />
                <Bar dataKey="income" fill="#34d399" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-card-title">Expense Breakdown</div>
            {expenseBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="amount"
                    nameKey="category"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {expenseBreakdown.map((entry) => (
                      <Cell key={entry.category} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: chartStyle.tooltipBg,
                      border: `1px solid ${chartStyle.tooltipBorder}`,
                      borderRadius: 8,
                      color: chartStyle.tooltipColor,
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      catLabel(name),
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p className="empty-state-text">No expenses yet</p>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Category Bars */}
      {expenseBreakdown.length > 0 && (
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-card-title">Expenses by Category</div>
            <div className="category-bars">
              {expenseBreakdown.map((cat) => (
                <div className="category-bar-item" key={cat.category}>
                  <div className="category-bar-header">
                    <span className="category-bar-name">
                      <span
                        className="category-dot"
                        style={{ backgroundColor: cat.color }}
                      />
                      {catLabel(cat.category)}
                    </span>
                    <span className="category-bar-amount">
                      {formatCurrency(cat.amount)} ({cat.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="category-bar-track">
                    <div
                      className="category-bar-fill"
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

          {incomeBreakdown.length > 0 && (
            <div className="chart-card">
              <div className="chart-card-title">Income by Category</div>
              <div className="category-bars">
                {incomeBreakdown.map((cat) => (
                  <div className="category-bar-item" key={cat.category}>
                    <div className="category-bar-header">
                      <span className="category-bar-name">
                        <span
                          className="category-dot"
                          style={{ backgroundColor: cat.color }}
                        />
                        {catLabel(cat.category)}
                      </span>
                      <span className="category-bar-amount">
                        {formatCurrency(cat.amount)} ({cat.percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="category-bar-track">
                      <div
                        className="category-bar-fill"
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
          )}
        </div>
      )}

      {/* Recent Transactions */}
      <div className="recent-section">
        <div className="recent-header">
          <span className="recent-title">Recent Transactions</span>
          {transactions.length > 0 && (
            <span className="recent-link" onClick={() => navigate('/transactions')}>
              View all <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
            </span>
          )}
        </div>
        {transactions.length > 0 ? (
          <TransactionList transactions={transactions.slice(0, 5)} compact />
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <BarChart3 size={48} />
            </div>
            <p className="empty-state-text">No transactions yet</p>
            <p className="empty-state-hint">
              {isEditor
                ? 'Start by adding your first income or expense!'
                : 'An editor on your team needs to add transactions.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getMonthlyData(transactions: any[]) {
  const months = new Map<string, { income: number; expense: number }>();

  for (const t of transactions) {
    const d = new Date(t.date);
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    const existing = months.get(key) ?? { income: 0, expense: 0 };
    if (t.type === 'income') existing.income += t.amount;
    else existing.expense += t.amount;
    months.set(key, existing);
  }

  return Array.from(months.entries())
    .map(([month, data]) => ({ month, ...data }))
    .slice(-6);
}
