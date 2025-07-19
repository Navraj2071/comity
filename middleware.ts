import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/api/user"];

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isProtectedRoute = protectedRoutes.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !accessToken) {
    if (refreshToken) {
      try {
        const response = await fetch(
          new URL("/api/auth/refresh", request.url),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const newAccessToken = response.headers
            .getSetCookie()
            .find((cookie) => cookie.startsWith("accessToken"))
            ?.split(";")[0]
            .split("=")[1];

          if (newAccessToken) {
            const newRequest = request.clone();
            const response = NextResponse.next({ request: newRequest });
            response.cookies.set("accessToken", newAccessToken);
            return response;
          }
        }
      } catch (refreshError) {
        console.error("Failed to refresh token in middleware:", refreshError);
      }
    }
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      );
    } catch (error) {
      console.error("Access token verification failed:", error);
      const response = isProtectedRoute
        ? NextResponse.redirect(new URL("/login", request.url))
        : NextResponse.next();

      response.cookies.delete("accessToken");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
};
