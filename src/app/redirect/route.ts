import { NextRequest, NextResponse } from "next/server";

/**
 * Перенаправление на активатор бота
 */
export function GET() {
  return NextResponse.redirect(new URL("/bot-activator", 
    // Используем динамический URL, чтобы редирект работал как в продакшн, так и в разработке
    process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
  ));
} 