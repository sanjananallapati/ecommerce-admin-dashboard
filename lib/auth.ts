import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const { db } = await connectToDatabase()
          // Bootstrap default admin on first deploy if collection is empty
          const adminsCount = await db.collection('admins').countDocuments()
          if (adminsCount === 0) {
            const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase()
            const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
            const adminName = process.env.ADMIN_NAME || 'Admin User'

            const hashed = await bcrypt.hash(adminPassword, 10)
            await db.collection('admins').insertOne({
              email: adminEmail,
              password: hashed,
              name: adminName,
              createdAt: new Date(),
            })
          }

          const user = await db.collection('admins').findOne({
            email: credentials.email.toLowerCase()
          })

          if (!user) return null

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) return null

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
