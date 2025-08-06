/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    console.log("=== DEBUG AUTH ENDPOINT ===");
    
    // Get headers
    const requestHeaders = await headers();
    console.log("Headers:", Object.fromEntries(requestHeaders.entries()));
    
    // Get cookies
    const cookies = request.cookies.getAll();
    console.log("Cookies:", cookies);
    
    // Try to get session
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });
    
    console.log("Session:", session);
    
    return NextResponse.json({
      success: true,
      session: session,
      user: session?.user || null,
      isAuthenticated: !!session?.user?.id,
      headers: Object.fromEntries(requestHeaders.entries()),
      cookies: cookies,
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Debug auth error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
