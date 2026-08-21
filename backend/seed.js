const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with boutique products...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@boutique.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@boutique.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create Categories
  const categoriesData = [
    { name: "Women's Fashion", slug: 'womens-fashion' },
    { name: "Men's Fashion", slug: 'mens-fashion' },
    { name: "Dresses", slug: 'dresses' },
    { name: "Shirts & Tops", slug: 'shirts-tops' },
    { name: "Shoes", slug: 'shoes' },
    { name: "Bags", slug: 'bags' },
    { name: "Jewelry", slug: 'jewelry' },
    { name: "Accessories", slug: 'accessories' }
  ];

  const categories = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Create Products
  const productsData = [
    {
      name: 'Elegant Evening Gown',
      slug: 'elegant-evening-gown',
      description: 'A stunning floor-length gown with intricate beadwork, perfect for galas and formal events. Features a concealed back zipper, luxurious lining, and elegant drape tailored to silhouette every curve with poise.',
      price: 450.0,
      sku: 'DRS-002',
      stock: 15,
      categoryId: categories['dresses'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-156616098393ce0d222db2769?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1572804013309-8c98e25e1152?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Emerald Green', 'Midnight Blue', 'Black']),
      brand: 'J2G Couture',
      material: 'Silk Chiffon',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
    },
    {
      name: 'Classic Silk Blouse',
      slug: 'classic-silk-blouse',
      description: '100% pure mulberry silk blouse with a tailored fit. Ideal for both office boardroom attire and stylish evening outings.',
      price: 120.0,
      sku: 'W-TOP-001',
      stock: 40,
      categoryId: categories['shirts-tops'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1589810635657-232948472d98?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Pearl White', 'Champagne', 'Blush Pink']),
      brand: 'J2G Essentials',
      material: '100% Mulberry Silk',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: "Men's Tailored Wool Suit",
      slug: 'mens-tailored-wool-suit',
      description: 'A premium two-piece wool suit offering a sharp, modern silhouette. Masterfully structured shoulders and premium breathable interior lining.',
      price: 850.0,
      discountedPrice: 750.0,
      sku: 'M-SUT-001',
      stock: 20,
      categoryId: categories['mens-fashion'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1594938298596-70f594f62bce?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['38R', '40R', '42R', '44R']),
      colors: JSON.stringify(['Charcoal', 'Navy Blue']),
      brand: 'J2G Tailored',
      material: '100% Super 120s Wool',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
    },
    {
      name: 'Leather Crossbody Handbag',
      slug: 'leather-crossbody-handbag',
      description: 'Handcrafted Italian leather bag with gold-tone hardware, magnetic snap closure, and detachable adjustable shoulder strap.',
      price: 295.0,
      sku: 'BAG-001',
      stock: 30,
      categoryId: categories['bags'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['One Size']),
      colors: JSON.stringify(['Tan', 'Black', 'Burgundy']),
      brand: 'J2G Luxe',
      material: 'Genuine Italian Calf Leather',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
    },
    {
      name: 'Diamond Accent Pendant',
      slug: 'diamond-accent-pendant',
      description: '14k solid white gold necklace featuring a brilliant-cut solitaire diamond accent. Includes signature luxury presentation gift box.',
      price: 1200.0,
      sku: 'JWL-001',
      stock: 10,
      categoryId: categories['jewelry'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['16 inch', '18 inch', '20 inch']),
      colors: JSON.stringify(['White Gold', 'Yellow Gold', 'Rose Gold']),
      brand: 'J2G Gems',
      material: '14k Gold & Natural Diamond',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
    },
    {
      name: 'Suede Ankle Boots',
      slug: 'suede-ankle-boots',
      description: 'Comfortable and stylish block-heel suede boots with cushioned memory foam insole and side zipper ease.',
      price: 185.0,
      sku: 'SHO-001',
      stock: 50,
      categoryId: categories['shoes'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['36', '37', '38', '39', '40', '41', '42', '43', '44']),
      colors: JSON.stringify(['Camel', 'Black', 'Taupe']),
      brand: 'J2G Steps',
      material: 'Premium Suede Leather',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
    },
    {
      name: "Men's Cashmere Sweater",
      slug: 'mens-cashmere-sweater',
      description: 'Ultra-soft pure Grade-A Mongolian cashmere crewneck sweater, meticulously woven for warmth and enduring sophistication.',
      price: 220.0,
      discountedPrice: 190.0,
      sku: 'M-SWT-001',
      stock: 35,
      categoryId: categories['mens-fashion'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Heather Grey', 'Navy', 'Oatmeal']),
      brand: 'J2G Essentials',
      material: '100% Mongolian Cashmere',
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
    },
    {
      name: 'Pleated Midi Skirt',
      slug: 'pleated-midi-skirt',
      description: 'Flowy accordion-pleated skirt with elasticated waistband that transitions effortlessly from day to night.',
      price: 95.0,
      sku: 'W-SKT-001',
      stock: 60,
      categoryId: categories['womens-fashion'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583496997341-f8816a5ecf05?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
      colors: JSON.stringify(['Rose', 'Mint', 'Black']),
      brand: 'J2G Essentials',
      material: 'Pleated Chiffon & Satin',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
    },
    {
      name: 'Aviator Sunglasses',
      slug: 'aviator-sunglasses',
      description: 'Classic lightweight metal-frame aviators with polarized anti-glare lenses and UV400 maximum radiation protection.',
      price: 150.0,
      sku: 'ACC-001',
      stock: 40,
      categoryId: categories['accessories'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['Standard']),
      colors: JSON.stringify(['Gold/Green', 'Silver/Grey', 'Black/Black']),
      brand: 'J2G Optics',
      material: 'Titanium Alloy & Polarized Glass',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
    },
    {
      name: 'Floral Summer Maxi Dress',
      slug: 'floral-summer-maxi-dress',
      description: 'Lightweight chiffon maxi dress with a vibrant floral botanical print, adjustable spaghetti straps, and elegant high slit.',
      price: 135.0,
      sku: 'DRS-003',
      stock: 45,
      categoryId: categories['dresses'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1572804013309-8c98e25e1152?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
      colors: JSON.stringify(['Floral Mix', 'Blue Motif']),
      brand: 'J2G Couture',
      material: 'Chiffon & Soft Cotton Lining',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
    },
    {
      name: 'Lilac Charm Structured Handbag',
      slug: 'lilac-charm-structured-handbag',
      description: 'Chic pastel lilac structured top-handle handbag featuring lustrous gold-tone hardware, a signature plush grey faux-fur pom-pom charm, and a detachable adjustable crossbody strap.',
      price: 380.0,
      discountedPrice: 320.0,
      sku: 'BAG-LIL-007',
      stock: 18,
      categoryId: categories['bags'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['Standard Handle', 'Crossbody Attached']),
      colors: JSON.stringify(['Lilac Purple', 'Pastel Pink', 'Noir Black']),
      brand: 'J2G Luxe',
      material: 'Structured Saffiano Leather & Gold Hardware',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: 'Two-Tone Rosette Lapel Midi Dress',
      slug: 'two-tone-rosette-lapel-midi-dress',
      description: 'Stunning two-tone beige and camel brown structured sheath dress featuring an exquisite sculpted 3D rose flower shoulder lapel, tailored long sleeves, front slit, and accent buttons.',
      price: 480.0,
      discountedPrice: 420.0,
      sku: 'DRS-ROS-008',
      stock: 14,
      categoryId: categories['dresses'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-156616098393ce0d222db2769?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['S (4-6)', 'M (8-10)', 'L (12-14)', 'XL (16-18)', 'XXL (20)']),
      colors: JSON.stringify(['Caramel & Cream', 'Blush & Burgundy', 'Black & Ivory']),
      brand: 'J2G Couture',
      material: 'Premium Tailored Crepe & Spandex',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: '18k Gold Love Knot Jewelry Set',
      slug: '18k-gold-love-knot-jewelry-set',
      description: 'Timeless 3-piece 18k gold-plated jewelry collection including a love knot pendant necklace, matching stud earrings, and coordinated adjustable knot ring presented in a luxury navy velvet gift box.',
      price: 650.0,
      discountedPrice: 580.0,
      sku: 'JWL-KNT-009',
      stock: 22,
      categoryId: categories['jewelry'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['18 inch Chain + Adjustable Ring']),
      colors: JSON.stringify(['18k Yellow Gold', 'Rose Gold', 'White Gold']),
      brand: 'J2G Gems',
      material: '18k Solid Gold Dip & Sterling Silver Base',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: 'Royal Blossom Crystal Gold Jewelry Suite',
      slug: 'royal-blossom-crystal-gold-jewelry-suite',
      description: 'Opulent floral gala jewelry suite featuring handcrafted textured gold flower petals and brilliant pavé crystal cluster accents. Complete with cascade necklace, floral drop earrings, matching statement ring, and wrist cuff.',
      price: 850.0,
      discountedPrice: 750.0,
      sku: 'JWL-FLR-010',
      stock: 10,
      categoryId: categories['jewelry'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['Full 4-Piece Suite']),
      colors: JSON.stringify(['Lustrous Gold', 'Silver Platinum']),
      brand: 'J2G Gems',
      material: '24k Gold Overlay & Pavé Austrian Crystals',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
    },
    {
      name: 'Executive Navy Dual-Tone Leather Tote',
      slug: 'executive-navy-dual-tone-leather-tote',
      description: 'Architectural dual-tone navy blue and midnight black structured tote bag with polished gold-tone hardware, double structured top handles, signature interlocking heart charm, and spacious multi-compartment interior.',
      price: 420.0,
      discountedPrice: 360.0,
      sku: 'BAG-NVY-011',
      stock: 16,
      categoryId: categories['bags'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80'
      ]),
      sizes: JSON.stringify(['Executive Large (14" x 10" x 5")']),
      colors: JSON.stringify(['Navy Blue & Black', 'Wine Red & Black', 'All Black']),
      brand: 'J2G Luxe',
      material: 'Scratch-Resistant Saffiano & Smooth Calf Leather',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
    }
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { sku: prod.sku },
      update: prod,
      create: prod,
    });
  }

  console.log('Database seeded with boutique products successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
