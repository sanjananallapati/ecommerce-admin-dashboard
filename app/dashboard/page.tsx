import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ProductsTable from '@/components/ProductsTable'
import SalesChart from '@/components/SalesChart'
import StatsCards from '@/components/StatsCards'
import StockOverviewChart from '@/components/StockOverviewChart'
import { connectToDatabase } from '@/lib/mongodb'
import Link from 'next/link'

async function getProducts() {
  try {
    const { db } = await connectToDatabase()
    const products = await db.collection('products').find({}).toArray()
    return JSON.parse(JSON.stringify(products))
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

async function getStats() {
  try {
    const { db } = await connectToDatabase()
    const totalProducts = await db.collection('products').countDocuments()
    const products = await db.collection('products').find({}).toArray()

    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock || 0), 0)
    const lowStockCount = products.filter(p => p.stock < 10).length

    return { totalProducts, totalStock, totalValue, lowStockCount }
  } catch (error) {
    return { totalProducts: 0, totalStock: 0, totalValue: 0, lowStockCount: 0 }
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const products = await getProducts()
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {session?.user?.email}</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Product
        </Link>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesChart products={products} />
        <StockOverviewChart products={products} />
      </div>

      <ProductsTable products={products} />
    </div>
  )
}
