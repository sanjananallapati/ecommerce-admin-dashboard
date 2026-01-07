'use client'

import { useState, useEffect } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

interface ProductFormProps {
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  loading: boolean
}

export default function ProductForm({ initialData, onSubmit, loading }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
  })
  const [customCategory, setCustomCategory] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [errors, setErrors] = useState<any>({})
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (initialData) {
      const predefinedCategories = ['Electronics', 'Clothing', 'Food', 'Books', 'Toys', 'Home']
      const isPredefinedCategory = predefinedCategories.includes(initialData.category)

      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        stock: initialData.stock?.toString() || '',
        category: isPredefinedCategory ? initialData.category : initialData.category ? 'Other' : '',
        imageUrl: initialData.imageUrl || '',
      })

      if (!isPredefinedCategory && initialData.category) {
        setCustomCategory(initialData.category)
      }
    }
  }, [initialData])

  const validateStep = (currentStep: number) => {
    const newErrors: any = {}

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required'
      else if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters'

      if (!formData.description.trim()) newErrors.description = 'Description is required'
      else if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters'
    }

    if (currentStep === 2) {
      if (!formData.price) newErrors.price = 'Price is required'
      else if (parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0'

      if (!formData.stock) newErrors.stock = 'Stock is required'
      else if (parseInt(formData.stock) < 0) newErrors.stock = 'Stock cannot be negative'

      if (!formData.category.trim()) {
        newErrors.category = 'Category is required'
      } else if (formData.category === 'Other' && !customCategory.trim()) {
        newErrors.category = 'Please enter a custom category'
      }
    }

    if (currentStep === 3) {
      if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Only allow form submission on step 3
    if (step !== 3) {
      return
    }

    if (!validateStep(step)) return

    const finalCategory = formData.category === 'Other' ? customCategory.trim() : formData.category

    const data = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: finalCategory,
    }

    await onSubmit(data)
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setUploadError('')

    if (!file) return

    // Allow any image type (jpg, png, webp, etc.)
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (jpg, png, etc.)')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setFormData((prev) => ({ ...prev, imageUrl: result }))
      setErrors((prev: any) => ({ ...prev, imageUrl: undefined }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <form onSubmit={handleFormSubmit} className="bg-white shadow rounded-lg p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s === step
                    ? 'bg-blue-600 text-white'
                    : s < step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-gray-600 font-medium">
          {step === 1 && 'Basic Information'}
          {step === 2 && 'Pricing & Inventory'}
          {step === 3 && 'Product Image'}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Enter product name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Enter product description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="0.00"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="0"
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                const value = e.target.value
                setFormData({ ...formData, category: value })
                if (value !== 'Other') {
                  setCustomCategory('')
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food">Food</option>
              <option value="Books">Books</option>
              <option value="Toys">Toys</option>
              <option value="Home">Home</option>
              <option value="Other">Other</option>
            </select>

            {formData.category === 'Other' && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Enter custom category"
              />
            )}

            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image *
            </label>

            {formData.imageUrl ? (
              <div className="space-y-4">
                <div className="relative w-full h-64 border border-gray-300 rounded-md overflow-hidden">
                  <Image
                    src={formData.imageUrl}
                    alt="Product"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: '' })}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                <p className="text-gray-600 mb-4">Add an image via URL or upload a JPG</p>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter image URL"
                  />
                  <div className="text-gray-500 text-sm">or upload JPG from your device</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-gray-700"
                  />
                  {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                </div>
              </div>
            )}
            {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={(e) => handleNext(e)}
            className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
          </button>
        )}
      </div>
    </form>
  )
}
