import { PrismaClient, UserRole, InventoryStatus, CountStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpiar la base de datos
  await prisma.$transaction([
    prisma.count.deleteMany(),
    prisma.productInventory.deleteMany(),
    prisma.inventory.deleteMany(),
    prisma.product.deleteMany(),
    prisma.user.deleteMany(),
  ])

  // Crear usuarios
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ejemplo.com',
      name: 'Administrador',
      role: UserRole.ADMIN,
    },
  })

  const counter = await prisma.user.create({
    data: {
      email: 'counter@ejemplo.com',
      name: 'Contador',
      role: UserRole.COUNTER,
    },
  })

  // Crear productos
  const products = [
    {
      sku: 'KIT90-079',
      description: 'Kit X-Pression "R" CCO Smile System',
    },
    {
      sku: 'KIT90-089',
      description: 'Kit X-Pression "C" CCO Smile System c/secuencia metálica',
    },
    {
      sku: '90-085-01',
      description: 'Juego de brackets X-pression "C" CCO c/g.345 .022',
    },
    {
      sku: '90-069-01',
      description: 'X-pression R Roth Mini',
    },
  ]

  const createdProducts = await Promise.all(
    products.map(product =>
      prisma.product.create({
        data: product,
      })
    )
  )

  // Crear inventario
  const inventory = await prisma.inventory.create({
    data: {
      name: 'Inventario semanal de producto terminado',
      date: new Date('2024-10-10'),
      status: InventoryStatus.PENDING,
      createdById: admin.id,
      products: {
        create: createdProducts.map(product => ({
          productId: product.id,
          erpQuantity: Math.floor(Math.random() * 50) + 1,
          status: CountStatus.PENDING,
        })),
      },
    },
    include: {
      products: true,
    },
  })

  console.log('Seed completado:', {
    users: [admin, counter],
    products: createdProducts,
    inventory,
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 