'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface StockOverviewChartProps {
  products: any[]
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6']

// Prepare data: total stock per category
function buildCategoryData(products: any[]) {
  const totals: Record<string, number> = {}

  products.forEach((p) => {
    const category = p.category || 'Uncategorized'
    const stock = Number(p.stock) || 0
    totals[category] = (totals[category] || 0) + stock
  })

  return Object.entries(totals).map(([name, value]) => ({
    name,
    value,
  }))
}

export default function StockOverviewChart({ products }: StockOverviewChartProps) {
  const data = buildCategoryData(products)

  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center text-gray-500">
        No stock data available yet.
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Stock Overview (by Category)</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Total Stock" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}


