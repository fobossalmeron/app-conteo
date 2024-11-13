generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}

model Producto {
  id          Int         @id @default(autoincrement())
  sku         String      @unique
  nombre      String
  descripcion String?
  inventarios InventarioProducto[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Inventario {
  id              Int       @id @default(autoincrement())
  nombre          String
  fecha           DateTime
  estado          EstadoInventario @default(PENDIENTE)
  productos       InventarioProducto[]
  creadoPor       Usuario   @relation("inventariosCreados", fields: [creadoPorId], references: [id])
  creadoPorId     Int
  confirmadoPor   Usuario?  @relation("inventariosConfirmados", fields: [confirmadoPorId], references: [id])
  confirmadoPorId Int?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([estado])
  @@index([fecha])
}

model InventarioProducto {
  id          Int       @id @default(autoincrement())
  inventario  Inventario @relation(fields: [inventarioId], references: [id])
  inventarioId Int
  producto    Producto  @relation(fields: [productoId], references: [id])
  productoId  Int
  cantidadERP Int      // Cantidad en el sistema ERP
  conteos     Conteo[]
  estado      EstadoConteo @default(PENDIENTE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([inventarioId, productoId])
  @@index([estado])
}

model Conteo {
  id                  Int               @id @default(autoincrement())
  inventarioProducto  InventarioProducto @relation(fields: [inventarioProductoId], references: [id])
  inventarioProductoId Int
  cantidadAnaquel     Int
  cantidadExcedente   Int
  cantidadTotal       Int              // Calculado: anaquel + excedente
  diferencia          Int              // Calculado: total - cantidadERP
  numeroConteo        Int              // 1 para primer conteo, 2+ para reconteos
  estado              EstadoConteo
  contadoPor         Usuario          @relation(fields: [contadoPorId], references: [id])
  contadoPorId       Int
  createdAt          DateTime         @default(now())
  updatedAt          DateTime         @updatedAt

  @@index([estado])
  @@index([numeroConteo])
}

model Usuario {
  id                      Int         @id @default(autoincrement())
  email                   String      @unique
  nombre                  String
  rol                     RolUsuario
  inventariosCreados     Inventario[] @relation("inventariosCreados")
  inventariosConfirmados Inventario[] @relation("inventariosConfirmados")
  conteos                Conteo[]
  createdAt              DateTime    @default(now())
  updatedAt              DateTime    @updatedAt
}

enum RolUsuario {
  ADMIN
  CONTADOR
}

enum EstadoInventario {
  PENDIENTE
  EN_PROCESO
  COMPLETADO
  CANCELADO
}

enum EstadoConteo {
  PENDIENTE
  CORRECTO
  INCORRECTO
  REQUIERE_RECONTEO
}