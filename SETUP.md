# Setup Instructions

## Quick Start

Follow these steps to get your Company Management System up and running:

### 1. Database Setup

Your Supabase database is already connected. You need to create the database tables:

**Option A: Using Supabase SQL Editor (Recommended)**
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Open the `database-schema.sql` file from this project
4. Copy and paste the entire SQL script
5. Click "Run" to execute the script
6. All tables, policies, and default data will be created automatically

**Option B: The app will attempt to initialize automatically**
- The application includes auto-initialization code
- On first load, it will try to insert default company settings
- However, tables must exist first, so Option A is recommended

### 2. Verify Database Setup

After running the SQL script, verify that these tables were created:
- company_settings
- suppliers
- products
- inventory
- customers
- invoices
- invoice_items
- purchase_orders
- purchase_order_items

You can check this in Supabase Dashboard → Table Editor

### 3. Start Using the Application

The application is now ready! Here's the recommended workflow:

#### First Time Setup
1. **Configure Settings** (Settings page)
   - Set your company name
   - Add company address and contact details
   - Customize brand colors
   - Add bank information for invoices/POs

2. **Add Suppliers** (Suppliers page)
   - Add your suppliers with full contact information
   - These will be available when creating products and purchase orders

3. **Add Customers** (Customers page)
   - Add your customers with billing information
   - These will be available when creating invoices

4. **Create Products** (Products page)
   - Add your product catalog
   - Include all product details (codes, prices, VAT rates, etc.)
   - Link products to suppliers
   - Inventory entries are automatically created

5. **Manage Inventory** (Inventory page)
   - Update stock quantities
   - Set reorder levels
   - Add storage locations

6. **Create Invoices** (Invoices page)
   - Select customer
   - Add line items from your product catalog
   - Set payment terms and due dates
   - Preview and print

7. **Create Purchase Orders** (Purchase Orders page)
   - Select supplier
   - Add products to order
   - Set delivery details
   - Preview and print

#### Daily Operations
- Monitor dashboard for low stock alerts
- Create invoices for customers
- Generate purchase orders for suppliers
- Track inventory levels
- Update order statuses

### 4. Features to Explore

**Dashboard**
- Real-time overview of your business
- Quick metrics at a glance
- Low stock alerts
- Recent invoice activity

**Invoice Features**
- Auto-numbering (INV-00001, INV-00002, etc.)
- Line item discounts
- VAT calculations
- Duty/customs charges
- Incoterms support
- Status tracking (draft → sent → paid)
- Professional print layout

**Purchase Order Features**
- Auto-numbering (PO-00001, PO-00002, etc.)
- Supplier selection
- Delivery tracking
- Ship from/to details
- Status tracking (draft → sent → confirmed → received)
- Professional print layout

**Customization**
- Brand colors applied to all documents
- Company logo support (URL-based)
- Live preview of changes
- Reset to defaults option

### 5. Troubleshooting

**Issue: Tables don't exist**
- Solution: Run the database-schema.sql script in Supabase SQL Editor

**Issue: Can't see data**
- Solution: Check Row Level Security policies are enabled
- The provided SQL script includes permissive policies for testing

**Issue: Invoice/PO numbers not auto-generating**
- Solution: The first invoice will be INV-00001, first PO will be PO-00001
- Subsequent documents increment automatically

**Issue: Can't add products**
- Solution: Add at least one supplier first (optional but recommended)

### 6. Production Deployment

When ready to deploy:

1. **Security Review**
   - Review and tighten RLS policies in Supabase
   - Consider adding authentication
   - Implement user-based data isolation

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Deploy**
   - The `dist` folder contains your production build
   - Deploy to any static hosting service
   - Ensure environment variables are set correctly

### 7. Backup Recommendations

- Regularly backup your Supabase database
- Export important invoices and purchase orders
- Keep a copy of your product catalog
- Back up company settings

## Support

For issues or questions:
- Check the README.md for detailed feature documentation
- Review the database-schema.sql for table structures
- Inspect browser console for any errors
- Verify Supabase connection in the Network tab

## Next Steps

1. Run the database setup SQL
2. Configure your company settings
3. Add your first supplier and customer
4. Create your first product
5. Generate your first invoice or purchase order

Happy managing! 🚀
