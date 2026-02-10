'use client';

import { useEffect, useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Settings } from 'lucide-react';
import {
  getDailySafeToSpend,
  getAccounts,
  getTotalBalance,
  getRecentTransactions,
  getCurrentBudget,
  getMonthlyExpenses,
} from '@/lib/actions/finance';
import { formatCurrency } from '@/lib/utils';
import { AddTransactionModal } from '@/components/finance/add-transaction-modal';
import { AddAccountModal } from '@/components/finance/add-account-modal';
import { BudgetSettingsModal } from '@/components/finance/budget-settings-modal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function FinancePage() {
  const [dailySafe, setDailySafe] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [budget, setBudget] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [safe, balance, expenses, budgetData, accountsData, transactionsData] = await Promise.all([
        getDailySafeToSpend(),
        getTotalBalance(),
        getMonthlyExpenses(),
        getCurrentBudget(),
        getAccounts(),
        getRecentTransactions(10),
      ]);

      setDailySafe(safe);
      setTotalBalance(balance);
      setMonthlyExpenses(expenses);
      setBudget(budgetData);
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calcular días restantes del mes
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const daysRemaining = daysInMonth - currentDay + 1;

  // Calcular progreso del presupuesto
  const budgetProgress = budget ? (monthlyExpenses / budget.monthly_limit) * 100 : 0;

  const handleModalClose = () => {
    setShowTransactionModal(false);
    setShowAccountModal(false);
    setShowBudgetModal(false);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finance</h1>
          <p className="text-muted-foreground">Gestión financiera personal</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAccountModal(true)}
            className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
          >
            <Wallet size={18} />
            <span>Nueva Cuenta</span>
          </button>
          <button
            onClick={() => setShowTransactionModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Nueva Transacción</span>
          </button>
        </div>
      </div>

      {/* Daily Safe to Spend Card */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Puedes gastar hoy</p>
            <h2 className="text-4xl font-bold">{formatCurrency(dailySafe)}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBudgetModal(true)}
              className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
              title="Configurar Presupuesto"
            >
              <Settings size={18} />
            </button>
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <TrendingUp className="text-primary" size={32} />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {budget && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Gastado: {formatCurrency(monthlyExpenses)}
              </span>
              <span className="text-muted-foreground">
                Límite: {formatCurrency(budget.monthly_limit)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  budgetProgress > 90
                    ? 'bg-destructive'
                    : budgetProgress > 70
                    ? 'bg-yellow-500'
                    : 'bg-primary'
                }`}
                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {daysRemaining} días restantes este mes
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Balance Total</p>
            <Wallet className="text-primary" size={20} />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
          <p className="text-xs text-muted-foreground mt-1">{accounts.length} cuentas</p>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Gastos del Mes</p>
            <TrendingDown className="text-destructive" size={20} />
          </div>
          <p className="text-2xl font-bold text-destructive">
            {formatCurrency(monthlyExpenses)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {budget ? `${budgetProgress.toFixed(0)}% del presupuesto` : 'Sin presupuesto'}
          </p>
        </div>

        {/* Savings Goal */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Meta de Ahorro</p>
            <TrendingUp className="text-primary" size={20} />
          </div>
          <p className="text-2xl font-bold">
            {budget ? formatCurrency(budget.savings_goal) : formatCurrency(0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Objetivo mensual</p>
        </div>
      </div>

      {/* Accounts List */}
      {accounts.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Cuentas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="bg-background border border-border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{account.name}</p>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {account.type}
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(account.balance, account.currency)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Transacciones Recientes</h3>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No hay transacciones registradas
          </p>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction: any) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-background border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.is_expense
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {transaction.is_expense ? (
                      <ArrowDownRight size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.finance_accounts?.name} •{' '}
                      {format(new Date(transaction.date), 'dd MMM yyyy', { locale: es })}
                    </p>
                    {transaction.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {transaction.description}
                      </p>
                    )}
                  </div>
                </div>
                <p
                  className={`text-lg font-bold ${
                    transaction.is_expense ? 'text-destructive' : 'text-primary'
                  }`}
                >
                  {transaction.is_expense ? '-' : '+'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={showTransactionModal}
        onClose={handleModalClose}
        accounts={accounts}
      />
      <AddAccountModal isOpen={showAccountModal} onClose={handleModalClose} />
      <BudgetSettingsModal isOpen={showBudgetModal} onClose={handleModalClose} />
    </div>
  );
}
