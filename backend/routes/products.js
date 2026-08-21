const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Helper: generate slug from name
function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    
    let where = {};
    
    if (category) {
      where.category = { slug: category };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy = {};
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else orderBy = { createdAt: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: { 
        category: true,
        reviews: {
          include: { user: { select: { name: true } } }
        }
      }
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by id, slug, or sku
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id },
          { sku: id }
        ]
      },
      include: { 
        category: true, 
        reviews: { 
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        } 
      }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a product (Admin only)
router.post('/', async (req, res) => {
  try {
    const { name, description, price, discountPrice, sku, stock, categoryId, category, images, sizes, colors, brand, material, isFeatured, isNewArrival, isBestSeller, slug } = req.body;
    
    let resolvedCategoryId = categoryId;
    if (category && !resolvedCategoryId) {
      let cat = await prisma.category.findFirst({ where: { name: category } });
      if (!cat) {
        cat = await prisma.category.create({
          data: {
            name: category,
            slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          }
        });
      }
      resolvedCategoryId = cat.id;
    }

    // Auto-generate slug from name if not provided
    let productSlug = slug || generateSlug(name);
    // Ensure unique slug
    const existingSlug = await prisma.product.findFirst({ where: { slug: productSlug } });
    if (existingSlug) {
      productSlug = productSlug + '-' + Date.now().toString().slice(-4);
    }
    
    const product = await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        description: description || name,
        price: parseFloat(price),
        discountedPrice: discountPrice ? parseFloat(discountPrice) : null,
        sku,
        stock: parseInt(stock),
        categoryId: resolvedCategoryId,
        images: JSON.stringify(images || []),
        sizes: JSON.stringify(sizes || []),
        colors: JSON.stringify(colors || []),
        brand: brand || null,
        material: material || null,
        isFeatured: isFeatured || false,
        isNewArrival: isNewArrival || false,
        isBestSeller: isBestSeller || false
      },
      include: { category: true }
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a product (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, discountPrice, sku, stock, categoryId, category, images, sizes, colors, brand, material, isFeatured, isNewArrival, isBestSeller } = req.body;
    
    const data = {};
    if (name !== undefined) {
      data.name = name;
      // Auto-update slug if name changes
      data.slug = generateSlug(name);
      const existingSlug = await prisma.product.findFirst({ where: { slug: data.slug, NOT: { id: id } } });
      if (existingSlug) data.slug = data.slug + '-' + Date.now().toString().slice(-4);
    }
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = parseFloat(price);
    if (discountPrice !== undefined) data.discountedPrice = discountPrice ? parseFloat(discountPrice) : null;
    if (sku !== undefined) data.sku = sku;
    if (stock !== undefined) data.stock = parseInt(stock);
    
    let resolvedCategoryId = categoryId;
    if (category && !resolvedCategoryId) {
      let cat = await prisma.category.findFirst({ where: { name: category } });
      if (!cat) {
        cat = await prisma.category.create({
          data: {
            name: category,
            slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          }
        });
      }
      resolvedCategoryId = cat.id;
    }
    if (resolvedCategoryId !== undefined) data.categoryId = resolvedCategoryId;
    if (images !== undefined) data.images = JSON.stringify(images);
    if (sizes !== undefined) data.sizes = JSON.stringify(sizes);
    if (colors !== undefined) data.colors = JSON.stringify(colors);
    if (brand !== undefined) data.brand = brand || null;
    if (material !== undefined) data.material = material || null;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;
    if (isNewArrival !== undefined) data.isNewArrival = isNewArrival;
    if (isBestSeller !== undefined) data.isBestSeller = isBestSeller;

    const product = await prisma.product.update({
      where: { id: id },
      data,
      include: { category: true }
    });
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a product (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: id }
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
