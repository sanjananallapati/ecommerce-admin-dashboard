interface StatsCardsProps {
  stats: {
    totalProducts: number
    totalStock: number
    totalValue: number
    lowStockCount: number
  }
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      color: 'bg-blue-500',
    },
    {
      title: 'Total Stock',
      value: stats.totalStock,
      icon: '📊',
      color: 'bg-green-500',
    },
    {
      title: 'Total Value',
      value: `$${stats.totalValue.toFixed(2)}`,
      icon: '💰',
      color: 'bg-purple-500',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockCount,
      icon: '⚠️',
      color: 'bg-red-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className={`${card.color} text-white text-3xl p-3 rounded-lg`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
