'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">
            E-commerce Admin
          </Link>

          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="text-gray-700 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/products/new" 
              className="text-gray-700 hover:text-gray-900"
            >
              Add Product
            </Link>
            <Link 
              href="/dashboard/admins" 
              className="text-gray-700 hover:text-gray-900"
            >
              Add Admin
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
