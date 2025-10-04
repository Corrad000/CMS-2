import { useEffect, useState } from 'react';
import { Package, Warehouse, FileText, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

type DashboardStats = {
  totalProducts: number;
  lowStockItems: number;
  totalInvoices: number;
  pendingOrders: number;
  totalInventoryValue: number;
  recentInvoices: Array<{ invoice_number: string; customer_name: string; total_amount: number; status: string }>;
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockItems: 0,
    totalInvoices: 0,
    pendingOrders: 0,
    totalInventoryValue: 0,
    recentInvoices: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [productsRes, inventoryRes, invoicesRes, ordersRes, recentInvoicesRes] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('inventory').select('quantity, reorder_level, product_id(price)'),
        supabase.from('invoices').select('*', { count: 'exact', head: true }),
        supabase.from('purchase_orders').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase
          .from('invoices')
          .select('invoice_number, total_amount, status, customer_id(customer_name)')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      const lowStock = inventoryRes.data?.filter((item: any) => item.quantity <= item.reorder_level).length || 0;

      const inventoryValue = inventoryRes.data?.reduce((sum: number, item: any) => {
        const price = item.product_id?.price || 0;
        return sum + (item.quantity * price);
      }, 0) || 0;

      const recentInvoices = recentInvoicesRes.data?.map((inv: any) => ({
        invoice_number: inv.invoice_number,
        customer_name: inv.customer_id?.customer_name || 'N/A',
        total_amount: inv.total_amount,
        status: inv.status,
      })) || [];

      setStats({
        totalProducts: productsRes.count || 0,
        lowStockItems: lowStock,
        totalInvoices: invoicesRes.count || 0,
        pendingOrders: ordersRes.count || 0,
        totalInventoryValue: inventoryValue,
        recentInvoices,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-slate-600">Loading dashboard...</div>;
  }

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'blue' },
    { label: 'Low Stock Items', value: stats.lowStockItems, icon: TrendingDown, color: 'red' },
    { label: 'Total Invoices', value: stats.totalInvoices, icon: FileText, color: 'green' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: ShoppingCart, color: 'yellow' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-600 mt-2">Overview of your business metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                  <Icon className={`text-${stat.color}-600`} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Warehouse className="text-blue-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Inventory Value</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">${stats.totalInventoryValue.toFixed(2)}</p>
          <p className="text-sm text-slate-600 mt-2">Total value of stock on hand</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <FileText className="text-green-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Recent Invoices</h3>
          </div>
          <div className="space-y-3">
            {stats.recentInvoices.length === 0 ? (
              <p className="text-sm text-slate-500">No invoices yet</p>
            ) : (
              stats.recentInvoices.map((invoice) => (
                <div key={invoice.invoice_number} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{invoice.invoice_number}</p>
                    <p className="text-xs text-slate-500">{invoice.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">${invoice.total_amount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                      invoice.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
