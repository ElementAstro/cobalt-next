import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

// In a real application, you would use a database to store favorites
let favorites: { [userId: string]: number[] } = {}

export async function GET() {
  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.email as string
  return NextResponse.json(favorites[userId] || [])
}

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.email as string
  const { objectId } = await request.json()

  if (!favorites[userId]) {
    favorites[userId] = []
  }

  if (!favorites[userId].includes(objectId)) {
    favorites[userId].push(objectId)
  }

  return NextResponse.json(favorites[userId])
}

export async function DELETE(request: Request) {
  const session = await getServerSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.email as string
  const { objectId } = await request.json()

  if (favorites[userId]) {
    favorites[userId] = favorites[userId].filter(id => id !== objectId)
  }

  return NextResponse.json(favorites[userId])
}

