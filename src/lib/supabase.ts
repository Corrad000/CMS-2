import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type CompanySettings = {
  id: string;
  company_name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  license_number?: string;
  bank_name?: string;
  bank_account?: string;
  bank_swift?: string;
  bank_iban?: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  product_code: string;
  product_name: string;
  product_type?: string;
  department?: string;
  sku?: string;
  unit: string;
  price: number;
  cost: number;
  vat_rate: number;
  supplier_id?: string;
  size?: string;
  volume?: string;
  weight?: string;
  packing?: string;
  ean_code?: string;
  qr_code?: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type Inventory = {
  id: string;
  product_id: string;
  quantity: number;
  reorder_level: number;
  location?: string;
  last_restocked?: string;
  updated_at: string;
};

export type Customer = {
  id: string;
  customer_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  created_at: string;
};

export type Supplier = {
  id: string;
  supplier_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  created_at: string;
};

export type Invoice = {
  id: string;
  invoice_number: string;
  customer_id: string;
  issue_date: string;
  due_date?: string;
  subtotal: number;
  tax_amount: number;
  duty_amount: number;
  total_amount: number;
  incoterms?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  product_id: string;
  product_code: string;
  product_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  vat_rate: number;
  line_total: number;
};

export type PurchaseOrder = {
  id: string;
  order_number: string;
  supplier_id: string;
  order_date: string;
  delivery_date?: string;
  subtotal: number;
  tax_amount: number;
  duty_amount: number;
  total_amount: number;
  incoterms?: string;
  ship_from?: string;
  ship_to?: string;
  delivery_address?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type PurchaseOrderItem = {
  id: string;
  purchase_order_id: string;
  product_id: string;
  product_code: string;
  product_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  vat_rate: number;
  line_total: number;
};
