'use server'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, email, password } = await req.json()

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
  }

  const { db } = await connectToDatabase()

  const existing = await db.collection('admins').findOne({ email })
  if (existing) {
    return NextResponse.json({ error: 'Admin with this email already exists' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.collection('admins').insertOne({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    createdAt: new Date(),
  })

  return NextResponse.json({ message: 'Admin created' }, { status: 201 })
}

