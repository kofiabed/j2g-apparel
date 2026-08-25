-- =========================================================
-- J2G APPAREL BOUTIQUE — SUPABASE POSTGRESQL SCHEMA & SEED
-- Run this script in your Supabase Project -> SQL Editor
-- =========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create User Table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "role" TEXT DEFAULT 'CUSTOMER',
  "phone" TEXT,
  "addresses" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Category Table
CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "image" TEXT
);

-- 4. Create Product Table
CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "description" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "discountedPrice" DOUBLE PRECISION,
  "sku" TEXT UNIQUE NOT NULL,
  "stock" INTEGER DEFAULT 0,
  "categoryId" TEXT NOT NULL REFERENCES "Category"("id") ON DELETE CASCADE,
  "images" TEXT NOT NULL DEFAULT '[]',
  "sizes" TEXT DEFAULT '[]',
  "colors" TEXT DEFAULT '[]',
  "brand" TEXT DEFAULT 'J2G Apparel',
  "material" TEXT,
  "isFeatured" BOOLEAN DEFAULT FALSE,
  "isNewArrival" BOOLEAN DEFAULT FALSE,
  "isBestSeller" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Order Table
CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "totalAmount" DOUBLE PRECISION NOT NULL,
  "status" TEXT DEFAULT 'Pending',
  "paymentStatus" TEXT DEFAULT 'Unpaid',
  "shippingAddress" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create OrderItem Table
CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "quantity" INTEGER NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "size" TEXT,
  "color" TEXT
);

-- 7. Create Review Table
CREATE TABLE IF NOT EXISTS "Review" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create Wishlist Table
CREATE TABLE IF NOT EXISTS "Wishlist" (
  "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Allows public read access & authenticated write operations
-- =========================================================
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Wishlist" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on Category" ON "Category" FOR SELECT USING (true);
CREATE POLICY "Allow public write on Category" ON "Category" FOR ALL USING (true);

CREATE POLICY "Allow public read on Product" ON "Product" FOR SELECT USING (true);
CREATE POLICY "Allow public write on Product" ON "Product" FOR ALL USING (true);

CREATE POLICY "Allow public read on User" ON "User" FOR SELECT USING (true);
CREATE POLICY "Allow public write on User" ON "User" FOR ALL USING (true);

CREATE POLICY "Allow public read on Review" ON "Review" FOR SELECT USING (true);
CREATE POLICY "Allow public write on Review" ON "Review" FOR ALL USING (true);

CREATE POLICY "Allow public read on Order" ON "Order" FOR SELECT USING (true);
CREATE POLICY "Allow public write on Order" ON "Order" FOR ALL USING (true);

CREATE POLICY "Allow public read on OrderItem" ON "OrderItem" FOR SELECT USING (true);
CREATE POLICY "Allow public write on OrderItem" ON "OrderItem" FOR ALL USING (true);

CREATE POLICY "Allow public read on Wishlist" ON "Wishlist" FOR SELECT USING (true);
CREATE POLICY "Allow public write on Wishlist" ON "Wishlist" FOR ALL USING (true);

-- =========================================================
-- INITIAL SEED DATA
-- =========================================================

-- Insert Admin User (Password: admin123)
INSERT INTO "User" ("id", "name", "email", "password", "role")
VALUES (
  'admin-user-id-001',
  'Admin User',
  'admin@boutique.com',
  '$2b$10$epdaF21l3N1W9dF4bI2N9eYJzF4N3Zq9vE8.jH5Vq8p8K7X6g6nC2',
  'ADMIN'
) ON CONFLICT ("email") DO NOTHING;

-- Insert Categories
INSERT INTO "Category" ("id", "name", "slug") VALUES
  ('cat-001', 'Women''s Fashion', 'womens-fashion'),
  ('cat-002', 'Men''s Fashion', 'mens-fashion'),
  ('cat-003', 'Dresses', 'dresses'),
  ('cat-004', 'Shirts & Tops', 'shirts-tops'),
  ('cat-005', 'Shoes', 'shoes'),
  ('cat-006', 'Bags', 'bags'),
  ('cat-007', 'Jewelry', 'jewelry'),
  ('cat-008', 'Accessories', 'accessories')
ON CONFLICT ("slug") DO NOTHING;

-- Insert Boutique Products
INSERT INTO "Product" ("name", "slug", "description", "price", "discountedPrice", "sku", "stock", "categoryId", "images", "sizes", "colors", "brand", "material", "isFeatured", "isNewArrival", "isBestSeller")
VALUES
  (
    'Lilac Charm Structured Handbag',
    'lilac-charm-structured-handbag',
    'Chic pastel lilac structured top-handle handbag featuring lustrous gold-tone hardware, a signature plush grey faux-fur pom-pom charm, and a detachable adjustable crossbody strap.',
    380.0,
    320.0,
    'BAG-LIL-007',
    18,
    'cat-006',
    '["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"]',
    '["Standard Handle","Crossbody Attached"]',
    '["Lilac Purple","Pastel Pink","Noir Black"]',
    'J2G Luxe',
    'Structured Saffiano Leather & Gold Hardware',
    TRUE,
    TRUE,
    TRUE
  ),
  (
    'Two-Tone Rosette Lapel Midi Dress',
    'two-tone-rosette-lapel-midi-dress',
    'Stunning two-tone beige and camel brown structured sheath dress featuring an exquisite sculpted 3D rose flower shoulder lapel, tailored long sleeves, front slit, and accent buttons.',
    480.0,
    420.0,
    'DRS-ROS-008',
    14,
    'cat-003',
    '["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-156616098393ce0d222db2769?auto=format&fit=crop&w=800&q=80"]',
    '["S (4-6)","M (8-10)","L (12-14)","XL (16-18)","XXL (20)"]',
    '["Caramel & Cream","Blush & Burgundy","Black & Ivory"]',
    'J2G Couture',
    'Premium Tailored Crepe & Spandex',
    TRUE,
    TRUE,
    TRUE
  ),
  (
    '18k Gold Love Knot Jewelry Set',
    '18k-gold-love-knot-jewelry-set',
    'Timeless 3-piece 18k gold-plated jewelry collection including a love knot pendant necklace, matching stud earrings, and coordinated adjustable knot ring presented in a luxury navy velvet gift box.',
    650.0,
    580.0,
    'JWL-KNT-009',
    22,
    'cat-007',
    '["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"]',
    '["18 inch Chain + Adjustable Ring"]',
    '["18k Yellow Gold","Rose Gold","White Gold"]',
    'J2G Gems',
    '18k Solid Gold Dip & Sterling Silver Base',
    TRUE,
    TRUE,
    TRUE
  ),
  (
    'Royal Blossom Crystal Gold Jewelry Suite',
    'royal-blossom-crystal-gold-jewelry-suite',
    'Opulent floral gala jewelry suite featuring handcrafted textured gold flower petals and brilliant pavé crystal cluster accents. Complete with cascade necklace, floral drop earrings, matching statement ring, and wrist cuff.',
    850.0,
    750.0,
    'JWL-FLR-010',
    10,
    'cat-007',
    '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80"]',
    '["Full 4-Piece Suite"]',
    '["Lustrous Gold","Silver Platinum"]',
    'J2G Gems',
    '24k Gold Overlay & Pavé Austrian Crystals',
    TRUE,
    FALSE,
    TRUE
  ),
  (
    'Executive Navy Dual-Tone Leather Tote',
    'executive-navy-dual-tone-leather-tote',
    'Architectural dual-tone navy blue and midnight black structured tote bag with polished gold-tone hardware, double structured top handles, signature interlocking heart charm, and spacious multi-compartment interior.',
    420.0,
    360.0,
    'BAG-NVY-011',
    16,
    'cat-006',
    '["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80"]',
    '["Executive Large (14\\" x 10\\" x 5\\")"]',
    '["Navy Blue & Black","Wine Red & Black","All Black"]',
    'J2G Luxe',
    'Scratch-Resistant Saffiano & Smooth Calf Leather',
    TRUE,
    TRUE,
    FALSE
  ),
  (
    'Elegant Evening Gown',
    'elegant-evening-gown',
    'A stunning floor-length gown with intricate beadwork, perfect for galas and formal events. Features a concealed back zipper, luxurious lining, and elegant drape tailored to silhouette every curve with poise.',
    450.0,
    NULL,
    'DRS-002',
    15,
    'cat-003',
    '["https://images.unsplash.com/photo-156616098393ce0d222db2769?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1572804013309-8c98e25e1152?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"]',
    '["XS","S","M","L","XL"]',
    '["Emerald Green","Midnight Blue","Black"]',
    'J2G Couture',
    'Silk Chiffon',
    TRUE,
    TRUE,
    FALSE
  ),
  (
    'Classic Silk Blouse',
    'classic-silk-blouse',
    '100% pure mulberry silk blouse with a tailored fit. Ideal for both office boardroom attire and stylish evening outings.',
    120.0,
    NULL,
    'W-TOP-001',
    40,
    'cat-004',
    '["https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1589810635657-232948472d98?auto=format&fit=crop&w=800&q=80"]',
    '["S","M","L","XL"]',
    '["Pearl White","Champagne","Blush Pink"]',
    'J2G Essentials',
    '100% Mulberry Silk',
    FALSE,
    TRUE,
    TRUE
  ),
  (
    'Men''s Tailored Wool Suit',
    'mens-tailored-wool-suit',
    'A premium two-piece wool suit offering a sharp, modern silhouette. Masterfully structured shoulders and premium breathable interior lining.',
    850.0,
    750.0,
    'M-SUT-001',
    20,
    'cat-002',
    '["https://images.unsplash.com/photo-1594938298596-70f594f62bce?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"]',
    '["38R","40R","42R","44R"]',
    '["Charcoal","Navy Blue"]',
    'J2G Tailored',
    '100% Super 120s Wool',
    TRUE,
    FALSE,
    TRUE
  ),
  (
    'Suede Ankle Boots',
    'suede-ankle-boots',
    'Comfortable and stylish block-heel suede boots with cushioned memory foam insole and side zipper ease.',
    185.0,
    NULL,
    'SHO-001',
    50,
    'cat-005',
    '["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"]',
    '["36","37","38","39","40","41","42","43","44"]',
    '["Camel","Black","Taupe"]',
    'J2G Steps',
    'Premium Suede Leather',
    FALSE,
    TRUE,
    FALSE
  ),
  (
    'Men''s Cashmere Sweater',
    'mens-cashmere-sweater',
    'Ultra-soft pure Grade-A Mongolian cashmere crewneck sweater, meticulously woven for warmth and enduring sophistication.',
    220.0,
    190.0,
    'M-SWT-001',
    35,
    'cat-002',
    '["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80"]',
    '["S","M","L","XL","XXL"]',
    '["Heather Grey","Navy","Oatmeal"]',
    'J2G Essentials',
    '100% Mongolian Cashmere',
    FALSE,
    FALSE,
    FALSE
  ),
  (
    'Pleated Midi Skirt',
    'pleated-midi-skirt',
    'Flowy accordion-pleated skirt with elasticated waistband that transitions effortlessly from day to night.',
    95.0,
    NULL,
    'W-SKT-001',
    60,
    'cat-001',
    '["https://images.unsplash.com/photo-1583496997341-f8816a5ecf05?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"]',
    '["XS","S","M","L"]',
    '["Rose","Mint","Black"]',
    'J2G Essentials',
    'Pleated Chiffon & Satin',
    FALSE,
    TRUE,
    FALSE
  ),
  (
    'Aviator Sunglasses',
    'aviator-sunglasses',
    'Classic lightweight metal-frame aviators with polarized anti-glare lenses and UV400 maximum radiation protection.',
    150.0,
    NULL,
    'ACC-001',
    40,
    'cat-008',
    '["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"]',
    '["Standard"]',
    '["Gold/Green","Silver/Grey","Black/Black"]',
    'J2G Optics',
    'Titanium Alloy & Polarized Glass',
    TRUE,
    FALSE,
    TRUE
  ),
  (
    'Floral Summer Maxi Dress',
    'floral-summer-maxi-dress',
    'Lightweight chiffon maxi dress with a vibrant floral botanical print, adjustable spaghetti straps, and elegant high slit.',
    135.0,
    NULL,
    'DRS-003',
    45,
    'cat-003',
    '["https://images.unsplash.com/photo-1572804013309-8c98e25e1152?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80"]',
    '["XS","S","M","L"]',
    '["Floral Mix","Blue Motif"]',
    'J2G Couture',
    'Chiffon & Soft Cotton Lining',
    TRUE,
    TRUE,
    FALSE
  )
ON CONFLICT ("sku") DO NOTHING;
