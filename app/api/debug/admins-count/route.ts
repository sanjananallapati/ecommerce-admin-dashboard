export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const count = await db.collection('admins').countDocuments()
    return NextResponse.json({ count, nextauthUrl: process.env.NEXTAUTH_URL || null })
  } catch (err: any) {
    return NextResponse.json({ error: 'DB_CONNECTION_FAILED', details: err?.message }, { status: 500 })
  }
}
