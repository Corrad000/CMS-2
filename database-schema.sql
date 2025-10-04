-- Company Management System Database Schema
-- Run this SQL in your Supabase SQL Editor to create all tables

-- Company Settings Table
CREATE TABLE IF NOT EXISTS company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'My Company',
  logo_url text,
  primary_color text DEFAULT '#3b82f6',
  secondary_color text DEFAULT '#64748b',
  address text,
  phone text,
  email text,
  website text,
  license_number text,
  bank_name text,
  bank_account text,
  bank_swift text,
  bank_iban text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_name text NOT NULL,
  contact_person text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  postal_code text,
  country text,
  tax_id text,
  created_at timestamptz DEFAULT now()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code text UNIQUE NOT NULL,
  product_name text NOT NULL,
  product_type text,
  department text,
  sku text,
  unit text DEFAULT 'pcs',
  price decimal(10, 2) DEFAULT 0,
  cost decimal(10, 2) DEFAULT 0,
  vat_rate decimal(5, 2) DEFAULT 0,
  supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  size text,
  volume text,
  weight text,
  packing text,
  ean_code text,
  qr_code text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 0,
  reorder_level integer DEFAULT 10,
  location text,
  last_restocked timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id)
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  contact_person text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  postal_code text,
  country text,
  tax_id text,
  created_at timestamptz DEFAULT now()
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE RESTRICT,
  issue_date date DEFAULT CURRENT_DATE,
  due_date date,
  subtotal decimal(12, 2) DEFAULT 0,
  tax_amount decimal(12, 2) DEFAULT 0,
  duty_amount decimal(12, 2) DEFAULT 0,
  total_amount decimal(12, 2) DEFAULT 0,
  incoterms text,
  status text DEFAULT 'draft',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoice Items Table
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE RESTRICT,
  product_code text,
  product_name text,
  description text,
  quantity integer DEFAULT 1,
  unit_price decimal(10, 2) DEFAULT 0,
  discount_percent decimal(5, 2) DEFAULT 0,
  vat_rate decimal(5, 2) DEFAULT 0,
  line_total decimal(12, 2) DEFAULT 0
);

-- Purchase Orders Table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  supplier_id uuid REFERENCES suppliers(id) ON DELETE RESTRICT,
  order_date date DEFAULT CURRENT_DATE,
  delivery_date date,
  subtotal decimal(12, 2) DEFAULT 0,
  tax_amount decimal(12, 2) DEFAULT 0,
  duty_amount decimal(12, 2) DEFAULT 0,
  total_amount decimal(12, 2) DEFAULT 0,
  incoterms text,
  ship_from text,
  ship_to text,
  delivery_address text,
  status text DEFAULT 'draft',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Purchase Order Items Table
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE RESTRICT,
  product_code text,
  product_name text,
  description text,
  quantity integer DEFAULT 1,
  unit_price decimal(10, 2) DEFAULT 0,
  discount_percent decimal(5, 2) DEFAULT 0,
  vat_rate decimal(5, 2) DEFAULT 0,
  line_total decimal(12, 2) DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow all operations for now - adjust based on your auth requirements)
CREATE POLICY "Allow all operations on company_settings" ON company_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on suppliers" ON suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on inventory" ON inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on invoice_items" ON invoice_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on purchase_orders" ON purchase_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on purchase_order_items" ON purchase_order_items FOR ALL USING (true) WITH CHECK (true);

-- Insert default company settings
INSERT INTO company_settings (company_name, primary_color, secondary_color)
VALUES ('My Company', '#3b82f6', '#64748b')
ON CONFLICT DO NOTHING;
