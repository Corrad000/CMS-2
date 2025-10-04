import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';

type PurchaseOrderPreviewProps = {
  orderId: string;
  onClose: () => void;
};

export default function PurchaseOrderPreview({ orderId, onClose }: PurchaseOrderPreviewProps) {
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  async function loadOrderData() {
    const [orderRes, itemsRes, companyRes] = await Promise.all([
      supabase.from('purchase_orders').select('*, suppliers(*)').eq('id', orderId).single(),
      supabase.from('purchase_order_items').select('*').eq('purchase_order_id', orderId),
      supabase.from('company_settings').select('*').limit(1).single(),
    ]);

    if (orderRes.data) setOrder(orderRes.data);
    if (itemsRes.data) setItems(itemsRes.data);
    if (companyRes.data) setCompany(companyRes.data);
  }

  if (!order || !company) {
    return null;
  }

  const supplier = order.suppliers;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Purchase Order Preview</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              Print
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: company.primary_color }}>
                {company.company_name}
              </h1>
              <div className="mt-2 text-sm text-slate-600 space-y-1">
                {company.address && <p>{company.address}</p>}
                {company.phone && <p>Phone: {company.phone}</p>}
                {company.email && <p>Email: {company.email}</p>}
                {company.website && <p>Website: {company.website}</p>}
                {company.license_number && <p>License: {company.license_number}</p>}
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-slate-900">PURCHASE ORDER</h2>
              <p className="text-lg font-semibold text-slate-700 mt-1">{order.order_number}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">SUPPLIER:</h3>
              <div className="text-sm text-slate-900">
                <p className="font-semibold">{supplier.supplier_name}</p>
                {supplier.contact_person && <p>{supplier.contact_person}</p>}
                {supplier.address && <p>{supplier.address}</p>}
                {supplier.city && supplier.state && (
                  <p>{supplier.city}, {supplier.state} {supplier.postal_code}</p>
                )}
                {supplier.country && <p>{supplier.country}</p>}
                {supplier.email && <p>Email: {supplier.email}</p>}
                {supplier.phone && <p>Phone: {supplier.phone}</p>}
                {supplier.tax_id && <p>Tax ID: {supplier.tax_id}</p>}
              </div>
            </div>

            <div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Order Date:</span>
                  <span className="font-medium">{new Date(order.order_date).toLocaleDateString()}</span>
                </div>
                {order.delivery_date && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Delivery Date:</span>
                    <span className="font-medium">{new Date(order.delivery_date).toLocaleDateString()}</span>
                  </div>
                )}
                {order.incoterms && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Incoterms:</span>
                    <span className="font-medium">{order.incoterms}</span>
                  </div>
                )}
                {order.ship_from && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ship From:</span>
                    <span className="font-medium">{order.ship_from}</span>
                  </div>
                )}
                {order.ship_to && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ship To:</span>
                    <span className="font-medium">{order.ship_to}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {order.delivery_address && (
            <div className="mb-8 p-4 bg-slate-50 rounded-lg">
              <h3 className="text-sm font-semibold text-slate-700 mb-1">DELIVERY ADDRESS:</h3>
              <p className="text-sm text-slate-900">{order.delivery_address}</p>
            </div>
          )}

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-3 text-sm font-semibold text-slate-700">Product Code</th>
                <th className="text-left py-3 text-sm font-semibold text-slate-700">Description</th>
                <th className="text-right py-3 text-sm font-semibold text-slate-700">Qty</th>
                <th className="text-right py-3 text-sm font-semibold text-slate-700">Unit Price</th>
                <th className="text-right py-3 text-sm font-semibold text-slate-700">Discount</th>
                <th className="text-right py-3 text-sm font-semibold text-slate-700">VAT</th>
                <th className="text-right py-3 text-sm font-semibold text-slate-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="py-3 text-sm">{item.product_code}</td>
                  <td className="py-3 text-sm">
                    <div className="font-medium">{item.product_name}</div>
                    {item.description && <div className="text-slate-600 text-xs">{item.description}</div>}
                  </td>
                  <td className="py-3 text-sm text-right">{item.quantity}</td>
                  <td className="py-3 text-sm text-right">${item.unit_price.toFixed(2)}</td>
                  <td className="py-3 text-sm text-right">{item.discount_percent}%</td>
                  <td className="py-3 text-sm text-right">{item.vat_rate}%</td>
                  <td className="py-3 text-sm text-right font-medium">${item.line_total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-8">
            <div className="w-72 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">VAT:</span>
                <span className="font-medium">${order.tax_amount.toFixed(2)}</span>
              </div>
              {order.duty_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Duty:</span>
                  <span className="font-medium">${order.duty_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t-2 border-slate-300">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg" style={{ color: company.primary_color }}>
                  ${order.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {(company.bank_name || order.notes) && (
            <div className="border-t border-slate-200 pt-6">
              {company.bank_name && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">BANK INFORMATION:</h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>Bank: {company.bank_name}</p>
                    {company.bank_account && <p>Account: {company.bank_account}</p>}
                    {company.bank_iban && <p>IBAN: {company.bank_iban}</p>}
                    {company.bank_swift && <p>SWIFT: {company.bank_swift}</p>}
                  </div>
                </div>
              )}

              {order.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">NOTES:</h3>
                  <p className="text-sm text-slate-600">{order.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
