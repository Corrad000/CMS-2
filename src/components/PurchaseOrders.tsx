import { useEffect, useState } from 'react';
import { Plus, Eye, CreditCard as Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PurchaseOrderForm from './PurchaseOrderForm';
import PurchaseOrderPreview from './PurchaseOrderPreview';

type PurchaseOrderWithSupplier = {
  id: string;
  order_number: string;
  supplier_id: string;
  order_date: string;
  delivery_date: string;
  total_amount: number;
  status: string;
  suppliers: { supplier_name: string };
};

export default function PurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrderWithSupplier[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data } = await supabase
      .from('purchase_orders')
      .select('*, suppliers(supplier_name)')
      .order('created_at', { ascending: false });

    if (data) setOrders(data as any);
  }

  function handleCreate() {
    setEditingOrder(null);
    setShowForm(true);
  }

  function handleEdit(id: string) {
    setEditingOrder(id);
    setShowForm(true);
  }

  function handlePreview(id: string) {
    setSelectedOrder(id);
    setShowPreview(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingOrder(null);
    loadOrders();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Purchase Orders</h2>
          <p className="text-slate-600 mt-2">Create and manage purchase orders</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create Purchase Order
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Order Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Delivery Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No purchase orders yet. Click "Create Purchase Order" to get started.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.order_number}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{order.suppliers.supplier_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(order.order_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">${order.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'received' ? 'bg-green-100 text-green-700' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'sent' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePreview(order.id)}
                          className="text-slate-600 hover:text-slate-700"
                          title="Preview"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(order.id)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <PurchaseOrderForm
          orderId={editingOrder}
          onClose={handleFormClose}
        />
      )}

      {showPreview && selectedOrder && (
        <PurchaseOrderPreview
          orderId={selectedOrder}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
