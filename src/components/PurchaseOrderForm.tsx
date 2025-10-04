import { useEffect, useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type PurchaseOrderFormProps = {
  orderId: string | null;
  onClose: () => void;
};

type LineItem = {
  id: string;
  product_id: string;
  product_code: string;
  product_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  vat_rate: number;
  line_total: number;
};

export default function PurchaseOrderForm({ orderId, onClose }: PurchaseOrderFormProps) {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    order_number: '',
    supplier_id: '',
    order_date: new Date().toISOString().split('T')[0],
    delivery_date: '',
    incoterms: '',
    ship_from: '',
    ship_to: '',
    delivery_address: '',
    duty_amount: 0,
    status: 'draft',
    notes: '',
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  useEffect(() => {
    loadData();
    if (orderId) {
      loadPurchaseOrder();
    } else {
      generateOrderNumber();
    }
  }, [orderId]);

  async function loadData() {
    const [suppliersRes, productsRes] = await Promise.all([
      supabase.from('suppliers').select('*').order('supplier_name'),
      supabase.from('products').select('*').order('product_name'),
    ]);

    if (suppliersRes.data) setSuppliers(suppliersRes.data);
    if (productsRes.data) setProducts(productsRes.data);
  }

  async function generateOrderNumber() {
    const { data } = await supabase
      .from('purchase_orders')
      .select('order_number')
      .order('created_at', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      const lastNumber = parseInt(data[0].order_number.replace(/\D/g, '')) || 0;
      setFormData((prev) => ({ ...prev, order_number: `PO-${String(lastNumber + 1).padStart(5, '0')}` }));
    } else {
      setFormData((prev) => ({ ...prev, order_number: 'PO-00001' }));
    }
  }

  async function loadPurchaseOrder() {
    const { data: order } = await supabase
      .from('purchase_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (order) {
      setFormData({
        order_number: order.order_number,
        supplier_id: order.supplier_id,
        order_date: order.order_date,
        delivery_date: order.delivery_date || '',
        incoterms: order.incoterms || '',
        ship_from: order.ship_from || '',
        ship_to: order.ship_to || '',
        delivery_address: order.delivery_address || '',
        duty_amount: order.duty_amount,
        status: order.status,
        notes: order.notes || '',
      });

      const { data: items } = await supabase
        .from('purchase_order_items')
        .select('*')
        .eq('purchase_order_id', orderId);

      if (items) setLineItems(items as LineItem[]);
    }
  }

  function addLineItem() {
    setLineItems([
      ...lineItems,
      {
        id: crypto.randomUUID(),
        product_id: '',
        product_code: '',
        product_name: '',
        description: '',
        quantity: 1,
        unit_price: 0,
        discount_percent: 0,
        vat_rate: 0,
        line_total: 0,
      },
    ]);
  }

  function removeLineItem(id: string) {
    setLineItems(lineItems.filter((item) => item.id !== id));
  }

  function updateLineItem(id: string, field: string, value: any) {
    setLineItems(
      lineItems.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        if (field === 'product_id') {
          const product = products.find((p) => p.id === value);
          if (product) {
            updated.product_code = product.product_code;
            updated.product_name = product.product_name;
            updated.description = product.description || '';
            updated.unit_price = product.cost;
            updated.vat_rate = product.vat_rate;
          }
        }

        const subtotal = updated.quantity * updated.unit_price;
        const discount = subtotal * (updated.discount_percent / 100);
        updated.line_total = subtotal - discount;

        return updated;
      })
    );
  }

  function calculateTotals() {
    const subtotal = lineItems.reduce((sum, item) => sum + item.line_total, 0);
    const taxAmount = lineItems.reduce((sum, item) => {
      const itemTax = item.line_total * (item.vat_rate / 100);
      return sum + itemTax;
    }, 0);
    const total = subtotal + taxAmount + formData.duty_amount;
    return { subtotal, taxAmount, total };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { subtotal, taxAmount, total } = calculateTotals();

    const orderData = {
      ...formData,
      subtotal,
      tax_amount: taxAmount,
      total_amount: total,
    };

    if (orderId) {
      await supabase.from('purchase_orders').update(orderData).eq('id', orderId);
      await supabase.from('purchase_order_items').delete().eq('purchase_order_id', orderId);

      const itemsToInsert = lineItems.map(({ id, ...item }) => ({
        ...item,
        purchase_order_id: orderId,
      }));
      await supabase.from('purchase_order_items').insert(itemsToInsert);
    } else {
      const { data: newOrder } = await supabase
        .from('purchase_orders')
        .insert(orderData)
        .select()
        .single();

      if (newOrder) {
        const itemsToInsert = lineItems.map(({ id, ...item }) => ({
          ...item,
          purchase_order_id: newOrder.id,
        }));
        await supabase.from('purchase_order_items').insert(itemsToInsert);
      }
    }

    onClose();
  }

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">
            {orderId ? 'Edit Purchase Order' : 'Create Purchase Order'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Order Number *</label>
              <input
                type="text"
                required
                value={formData.order_number}
                onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Supplier *</label>
              <select
                required
                value={formData.supplier_id}
                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.supplier_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="confirmed">Confirmed</option>
                <option value="received">Received</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Order Date *</label>
              <input
                type="date"
                required
                value={formData.order_date}
                onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Date</label>
              <input
                type="date"
                value={formData.delivery_date}
                onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Incoterms</label>
              <input
                type="text"
                value={formData.incoterms}
                onChange={(e) => setFormData({ ...formData, incoterms: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., FOB, CIF, EXW"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ship From</label>
              <input
                type="text"
                value={formData.ship_from}
                onChange={(e) => setFormData({ ...formData, ship_from: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ship To</label>
              <input
                type="text"
                value={formData.ship_to}
                onChange={(e) => setFormData({ ...formData, ship_to: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
              <input
                type="text"
                value={formData.delivery_address}
                onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-slate-900">Line Items</h4>
              <button
                type="button"
                onClick={addLineItem}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {lineItems.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Product</label>
                      <select
                        value={item.product_id}
                        onChange={(e) => updateLineItem(item.id, 'product_id', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.product_code} - {product.product_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Unit Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateLineItem(item.id, 'unit_price', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Discount %</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.discount_percent}
                        onChange={(e) => updateLineItem(item.id, 'discount_percent', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeLineItem(item.id)}
                        className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={16} className="mx-auto" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>

                  <div className="mt-2 text-right text-sm font-semibold text-slate-900">
                    Line Total: ${item.line_total.toFixed(2)} (VAT: {item.vat_rate}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-3">Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">VAT:</span>
                  <span className="font-medium">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Duty:</span>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.duty_amount}
                      onChange={(e) => setFormData({ ...formData, duty_amount: parseFloat(e.target.value) })}
                      className="w-24 px-2 py-1 border border-slate-300 rounded text-right"
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-300">
                  <span className="font-semibold text-slate-900">Total:</span>
                  <span className="font-bold text-lg text-slate-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {orderId ? 'Update Purchase Order' : 'Create Purchase Order'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
