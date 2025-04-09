import { NextRequest, NextResponse } from "next/server";

/**
 * Перенаправление с корневой страницы на активатор бота
 */
export function GET() {
  return NextResponse.redirect(new URL("/bot-activator", "https://example.com"));
} 