import { NextRequest, NextResponse } from "next/server";

// Pure server-side environment variables (never exposed via NEXT_PUBLIC)
const SERVER_BASE_URL =
  process.env.SERVER_URL || "https://api.daintydazzle.store";
const ADMIN_API_KEY =
  process.env.ADMIN_API_KEY ||
  "903a76bc612bbe5746ead5eb9a1d986ae039591ebb9f820920f40e3a72d239aa";

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams?.path || [];
    const targetPath = "/" + pathSegments.join("/");
    const search = request.nextUrl.search;
    const targetUrl = `${SERVER_BASE_URL.replace(/\/+$/, "")}${targetPath}${search}`;

    const headers = new Headers();
    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers.set("content-type", contentType);
    } else {
      headers.set("content-type", "application/json");
    }
    headers.set("accept", "application/json");

    // Always forward trusted system admin key for guaranteed server-to-server authorization
    headers.set("x-admin-key", ADMIN_API_KEY);

    // Also forward httpOnly cookie JWT token if available for audit context
    const adminToken = request.cookies.get("admin_token")?.value;
    if (adminToken) {
      headers.set("authorization", `Bearer ${adminToken}`);
    }

    const body = ["GET", "HEAD"].includes(request.method)
      ? undefined
      : await request.text();

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "content-type":
          response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Backend server unreachable or offline", details: String(error) },
      { status: 502 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
