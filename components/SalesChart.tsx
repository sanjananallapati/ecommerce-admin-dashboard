'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SalesChartProps {
  products: any[]
}

// Build histogram data: each product vs its stock
function buildHistogramData(products: any[]) {
  return products.map((p) => ({
    name: (p.name || '').substring(0, 12) || 'Unnamed',
    stock: Number(p.stock) || 0,
  }))
}

export default function SalesChart({ products }: SalesChartProps) {
  const data = buildHistogramData(products)

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Products vs Stock</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="stock" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
