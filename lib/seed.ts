import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-admin'

async function seed() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db('ecommerce-admin')

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await db.collection('admins').deleteMany({})
    await db.collection('admins').insertOne({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      createdAt: new Date(),
    })

    // Reset products collection:
    // This removes any previously seeded default products so the
    // dashboard starts with an empty product list. Manage products
    // through the application UI instead.
    await db.collection('products').deleteMany({})

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await client.close()
  }
}

seed()
