import { useEffect, useState } from 'react';
import { Plus, Eye, CreditCard as Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';

type InvoiceWithCustomer = {
  id: string;
  invoice_number: string;
  customer_id: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  status: string;
  customers: { customer_name: string };
};

export default function Invoices() {
  const [invoices, setInvoices] = useState<InvoiceWithCustomer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    const { data } = await supabase
      .from('invoices')
      .select('*, customers(customer_name)')
      .order('created_at', { ascending: false });

    if (data) setInvoices(data as any);
  }

  function handleCreate() {
    setEditingInvoice(null);
    setShowForm(true);
  }

  function handleEdit(id: string) {
    setEditingInvoice(id);
    setShowForm(true);
  }

  function handlePreview(id: string) {
    setSelectedInvoice(id);
    setShowPreview(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingInvoice(null);
    loadInvoices();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Invoices</h2>
          <p className="text-slate-600 mt-2">Create and manage invoices</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create Invoice
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No invoices yet. Click "Create Invoice" to get started.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{invoice.invoice_number}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{invoice.customers.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(invoice.issue_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">${invoice.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePreview(invoice.id)}
                          className="text-slate-600 hover:text-slate-700"
                          title="Preview"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(invoice.id)}
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
        <InvoiceForm
          invoiceId={editingInvoice}
          onClose={handleFormClose}
        />
      )}

      {showPreview && selectedInvoice && (
        <InvoicePreview
          invoiceId={selectedInvoice}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
