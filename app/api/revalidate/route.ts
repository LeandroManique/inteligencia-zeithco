// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { secret } = await req.json()

  if (secret !== process.env.VERCEL_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Revalidar homepage PT e todos os idiomas
  revalidatePath('/')
  revalidatePath('/en')
  revalidatePath('/es')
  revalidatePath('/zh')
  revalidatePath('/arquivo')

  return NextResponse.json({ revalidated: true, date: new Date().toISOString() })
}
