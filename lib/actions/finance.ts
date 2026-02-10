'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Transaction {
  id: string;
  account_id: string;
  amount: number;
  category: string;
  description: string | null;
  is_expense: boolean;
  date: string;
  created_at: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

export interface Budget {
  id: string;
  monthly_limit: number;
  savings_goal: number;
  month: string;
}

// Obtener gasto diario seguro
export async function getDailySafeToSpend() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.rpc('get_daily_safe_to_spend');
  
  if (error) {
    console.error('Error getting daily safe to spend:', error);
    return 0;
  }
  
  return Number(data) || 0;
}

// Obtener todas las cuentas
export async function getAccounts() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('finance_accounts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
  
  return data as Account[];
}

// Obtener balance total
export async function getTotalBalance() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('finance_accounts')
    .select('balance');
  
  if (error) {
    console.error('Error getting total balance:', error);
    return 0;
  }
  
  const total = data.reduce((sum, account) => sum + Number(account.balance), 0);
  return total;
}

// Obtener últimas transacciones
export async function getRecentTransactions(limit = 10) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('finance_transactions')
    .select(`
      *,
      finance_accounts (
        name,
        type
      )
    `)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
  
  return data;
}

// Obtener presupuesto actual
export async function getCurrentBudget() {
  const supabase = await createClient();
  
  const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
  
  const { data, error } = await supabase
    .from('finance_budgets')
    .select('*')
    .eq('month', currentMonth)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error getting budget:', error);
    return null;
  }
  
  return data as Budget | null;
}

// Crear transacción
export async function createTransaction(formData: {
  account_id: string;
  amount: number;
  category: string;
  description?: string;
  is_expense: boolean;
  date: string;
}) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('finance_transactions')
    .insert([formData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Error al crear la transacción');
  }
  
  revalidatePath('/dashboard/finance');
  return data;
}

// Crear cuenta
export async function createAccount(formData: {
  name: string;
  type: string;
  balance: number;
  currency: string;
}) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('finance_accounts')
    .insert([formData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating account:', error);
    throw new Error('Error al crear la cuenta');
  }
  
  revalidatePath('/dashboard/finance');
  return data;
}

// Crear o actualizar presupuesto
export async function upsertBudget(formData: {
  monthly_limit: number;
  savings_goal: number;
}) {
  const supabase = await createClient();
  
  const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
  
  const { data, error } = await supabase
    .from('finance_budgets')
    .upsert([
      {
        ...formData,
        month: currentMonth,
      },
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting budget:', error);
    throw new Error('Error al guardar el presupuesto');
  }
  
  revalidatePath('/dashboard/finance');
  return data;
}

// Obtener gastos del mes actual
export async function getMonthlyExpenses() {
  const supabase = await createClient();
  
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('finance_transactions')
    .select('amount')
    .eq('is_expense', true)
    .gte('date', startOfMonth.toISOString().split('T')[0]);
  
  if (error) {
    console.error('Error getting monthly expenses:', error);
    return 0;
  }
  
  const total = data.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  return total;
}
