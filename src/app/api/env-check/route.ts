import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    database_url_exists: !!process.env.DATABASE_URL,
    database_url_start: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : null,
    node_env: process.env.NODE_ENV
  });
} 