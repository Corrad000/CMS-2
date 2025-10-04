# Company Management System

A comprehensive business management application with inventory tracking, invoicing, and purchase order management.

## Features

### Dashboard
- Real-time business metrics overview
- Total products and inventory value tracking
- Low stock alerts
- Recent invoices summary
- Pending purchase orders count

### Products Management
- Complete product catalog with detailed information
- Product codes, SKU, pricing, and cost tracking
- VAT rates and supplier associations
- Product dimensions (size, volume, weight)
- EAN and QR code support
- Barcode and product descriptions

### Inventory Management
- Real-time stock level tracking
- Reorder level alerts
- Storage location management
- Low stock warnings
- Quantity adjustments

### Invoice Management
- Professional invoice creation
- Customer information integration
- Line item management with discounts
- VAT and duty calculations
- Multiple status tracking (draft, sent, paid, overdue)
- Incoterms support
- Invoice preview and printing
- Automatic invoice numbering

### Purchase Order System
- Create and manage purchase orders
- Supplier information integration
- Delivery tracking
- Ship from/to details
- Delivery address management
- Multiple status tracking (draft, sent, confirmed, received)
- PO preview and printing
- Automatic order numbering

### Customer Management
- Complete customer database
- Contact person tracking
- Full address information
- Tax ID management
- Email and phone records

### Supplier Management
- Supplier database
- Contact details
- Address management
- Tax information
- Quick supplier selection in products and purchase orders

### Settings & Customization
- Company branding customization
- Logo URL configuration
- Primary and secondary color themes
- Live preview of branding changes
- Company contact information
- Bank details for invoices and POs
- Business license number
- Reset to default settings

## Database Setup

1. Go to your Supabase project's SQL Editor
2. Copy the contents of `database-schema.sql`
3. Run the SQL script to create all tables and policies
4. The application will automatically initialize with default settings

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your Supabase database using the SQL schema provided

3. Configure environment variables (already set up in `.env`)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Features Overview

### Professional Design
- Modern SaaS-inspired interface
- Clean blue/slate color scheme
- Responsive layout for all devices
- Intuitive sidebar navigation
- Professional data tables
- Modal-based forms

### Business Functionality
- Multi-currency support (decimal precision)
- Discount calculations
- Tax and duty management
- Document status tracking
- Automatic numbering systems
- Print-ready invoices and POs

### Data Management
- Comprehensive foreign key relationships
- Cascade delete protection for critical data
- Automatic timestamp tracking
- Unique constraints for document numbers
- Row-level security enabled

## Application Structure

```
src/
├── components/
│   ├── Layout.tsx              # Main layout with sidebar
│   ├── Dashboard.tsx           # Dashboard with metrics
│   ├── Products.tsx            # Product management
│   ├── Inventory.tsx           # Stock tracking
│   ├── Invoices.tsx            # Invoice list
│   ├── InvoiceForm.tsx         # Invoice creation/editing
│   ├── InvoicePreview.tsx      # Invoice preview & print
│   ├── PurchaseOrders.tsx      # Purchase order list
│   ├── PurchaseOrderForm.tsx   # PO creation/editing
│   ├── PurchaseOrderPreview.tsx# PO preview & print
│   ├── Customers.tsx           # Customer management
│   ├── Suppliers.tsx           # Supplier management
│   └── Settings.tsx            # Company settings
├── lib/
│   ├── supabase.ts            # Supabase client & types
│   └── initDatabase.ts        # Database initialization
└── App.tsx                    # Main application

```

## Usage Tips

1. **Start with Setup**: Configure your company information in Settings first
2. **Add Suppliers**: Add suppliers before creating products
3. **Create Products**: Set up your product catalog with all details
4. **Add Customers**: Register your customers before creating invoices
5. **Manage Inventory**: Track stock levels and set reorder points
6. **Create Documents**: Generate invoices and purchase orders as needed
7. **Monitor Dashboard**: Keep track of key metrics and alerts

## Printing Documents

Both invoices and purchase orders support printing:
1. Open the preview of any document
2. Click the "Print" button
3. Use your browser's print dialog to save as PDF or print

## Color Customization

Customize your brand colors in Settings:
- Primary Color: Used for headings and buttons
- Secondary Color: Used for secondary text and elements
- Live preview shows changes in real-time
- Colors are applied to invoices and purchase orders

## Security

- Row Level Security (RLS) enabled on all tables
- Policies configured for data access control
- No hardcoded credentials
- Environment variables for configuration
