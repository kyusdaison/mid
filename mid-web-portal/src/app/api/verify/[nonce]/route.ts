import { NextResponse } from 'next/server';

// Temporary in-memory store for verification statuses
// In a production environment, this would be a Redis or database layer
const verificationStore: Record<string, { status: 'pending' | 'verified', fcdid?: string, timestamp: number }> = {};

export async function GET(request: Request, { params }: { params: { nonce: string } }) {
  const nonce = params.nonce;

  if (!nonce) {
    return NextResponse.json({ error: 'Nonce is required' }, { status: 400 });
  }

  const record = verificationStore[nonce];

  if (!record) {
    // If not found, assume it's a new request and it's pending
    return NextResponse.json({ status: 'pending' });
  }

  return NextResponse.json(record);
}

export async function POST(request: Request, { params }: { params: { nonce: string } }) {
  const nonce = params.nonce;

  if (!nonce) {
    return NextResponse.json({ error: 'Nonce is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { fcdid, status } = body;

    if (status === 'verified') {
      verificationStore[nonce] = {
        status: 'verified',
        fcdid: fcdid,
        timestamp: Date.now(),
      };
      return NextResponse.json({ success: true, message: 'Verification successful' });
    }

    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
