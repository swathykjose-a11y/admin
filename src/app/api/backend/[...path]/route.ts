import { NextRequest, NextResponse } from "next/server";

// Pure server-side environment variables (never exposed via NEXT_PUBLIC)
const SERVER_BASE_URL =
  process.env.SERVER_URL || process.env.API_URL || "http://localhost:8787";
const ADMIN_API_KEY =
  process.env.ADMIN_KEY ||
  process.env.ADMIN_API_KEY ||
  "dd_admin_secret_key_change_me";

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
    headers.set("x-admin-key", ADMIN_API_KEY);

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
