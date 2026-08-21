const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixCategories() {
  console.log('Fixing categories in database...');
  
  // Find or create "Bags" category
  let bagsCat = await prisma.category.findFirst({
    where: { OR: [{ slug: 'bags' }, { name: 'Bags' }] }
  });

  if (!bagsCat) {
    bagsCat = await prisma.category.create({
      data: { name: 'Bags', slug: 'bags' }
    });
  }

  // Find "Handbags" category
  const handbagsCat = await prisma.category.findFirst({
    where: { OR: [{ slug: 'handbags' }, { name: 'Handbags' }] }
  });

  if (handbagsCat && handbagsCat.id !== bagsCat.id) {
    // Re-link all products to "Bags" category
    await prisma.product.updateMany({
      where: { categoryId: handbagsCat.id },
      data: { categoryId: bagsCat.id }
    });

    // Delete redundant Handbags category
    await prisma.category.delete({
      where: { id: handbagsCat.id }
    });
  }

  console.log('Successfully reconciled Bags category!');
}

fixCategories()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
