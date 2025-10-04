import { useEffect, useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { supabase, CompanySettings } from '../lib/supabase';

export default function Settings() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [formData, setFormData] = useState({
    company_name: '',
    logo_url: '',
    primary_color: '#3b82f6',
    secondary_color: '#64748b',
    address: '',
    phone: '',
    email: '',
    website: '',
    license_number: '',
    bank_name: '',
    bank_account: '',
    bank_swift: '',
    bank_iban: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data } = await supabase.from('company_settings').select('*').limit(1).maybeSingle();

    if (data) {
      setSettings(data);
      setFormData({
        company_name: data.company_name,
        logo_url: data.logo_url || '',
        primary_color: data.primary_color,
        secondary_color: data.secondary_color,
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        website: data.website || '',
        license_number: data.license_number || '',
        bank_name: data.bank_name || '',
        bank_account: data.bank_account || '',
        bank_swift: data.bank_swift || '',
        bank_iban: data.bank_iban || '',
      });
    } else {
      await supabase.from('company_settings').insert({
        company_name: 'My Company',
        primary_color: '#3b82f6',
        secondary_color: '#64748b',
      });
      loadSettings();
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (settings) {
      await supabase
        .from('company_settings')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', settings.id);
    } else {
      await supabase.from('company_settings').insert(formData);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    loadSettings();
  }

  async function handleReset() {
    const defaultSettings = {
      company_name: 'My Company',
      logo_url: '',
      primary_color: '#3b82f6',
      secondary_color: '#64748b',
      address: '',
      phone: '',
      email: '',
      website: '',
      license_number: '',
      bank_name: '',
      bank_account: '',
      bank_swift: '',
      bank_iban: '',
    };

    if (settings) {
      await supabase
        .from('company_settings')
        .update({ ...defaultSettings, updated_at: new Date().toISOString() })
        .eq('id', settings.id);
    }

    setFormData(defaultSettings);
    loadSettings();
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-600 mt-2">Customize your company information and branding</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Company Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="h-10 w-16 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Secondary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="h-10 w-16 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">License Number</label>
                  <input
                    type="text"
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Bank Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={formData.bank_account}
                  onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SWIFT Code</label>
                  <input
                    type="text"
                    value={formData.bank_swift}
                    onChange={(e) => setFormData({ ...formData, bank_swift: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">IBAN</label>
                  <input
                    type="text"
                    value={formData.bank_iban}
                    onChange={(e) => setFormData({ ...formData, bank_iban: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={18} />
                Save Settings
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <RotateCcw size={18} />
                Reset to Default
              </button>
            </div>

            {saved && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
                Settings saved successfully!
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Live Preview</h3>

            <div className="border-2 border-slate-200 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="text-2xl font-bold" style={{ color: formData.primary_color }}>
                  {formData.company_name || 'Company Name'}
                </h4>
                <p className="text-sm mt-1" style={{ color: formData.secondary_color }}>
                  Business Solutions
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 text-sm space-y-1" style={{ color: formData.secondary_color }}>
                {formData.address && <p>{formData.address}</p>}
                {formData.phone && <p>Phone: {formData.phone}</p>}
                {formData.email && <p>Email: {formData.email}</p>}
                {formData.website && <p>Website: {formData.website}</p>}
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  className="w-full py-2 rounded-lg text-white font-medium transition-colors"
                  style={{ backgroundColor: formData.primary_color }}
                >
                  Sample Button
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
                This preview shows how your company branding will appear on invoices and documents.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
