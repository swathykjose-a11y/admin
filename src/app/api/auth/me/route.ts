import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(
        Buffer.from(parts[1], "base64url").toString("utf-8"),
      );
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return NextResponse.json(
          { authenticated: false, message: "Token expired" },
          { status: 401 },
        );
      }
      return NextResponse.json({
        authenticated: true,
        admin: {
          id: payload.adminId,
          email: payload.email,
          role: payload.role,
        },
      });
    }
  } catch {
    // ignore decoding errors
  }

  return NextResponse.json({ authenticated: true });
}
