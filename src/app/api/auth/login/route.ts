import { NextRequest, NextResponse } from "next/server";

const SERVER_BASE_URL =
  process.env.SERVER_URL || process.env.API_URL || "http://localhost:8787";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: { message: "Email and password are required" } },
        { status: 400 },
      );
    }

    const backendRes = await fetch(
      `${SERVER_BASE_URL.replace(/\/+$/, "")}/api/admin/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success || !data.token) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || { message: "Invalid email or password" },
        },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      admin: data.admin,
    });

    // Set secure httpOnly cookie
    response.cookies.set({
      name: "admin_token",
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Authentication service error", details: String(error) },
      },
      { status: 500 },
    );
  }
}
