import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

function getRedirectPath(request) {
  return `${request.nextUrl.pathname}${request.nextUrl.search}`;
}

function redirectToSignIn(request) {
  const signInUrl = new URL("/auth/signin", request.url);
  signInUrl.searchParams.set("redirect", getRedirectPath(request));

  return NextResponse.redirect(signInUrl);
}

function redirectByRole(request, user) {
  if (user?.role === "admin") {
    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  }

  if (user?.role === "recruiter") {
    return NextResponse.redirect(new URL("/dashboard/recruiter", request.url));
  }

  return NextResponse.redirect(new URL("/dashboard/seeker/applications", request.url));
}

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const user = session?.user;

  if (!user) {
    return redirectToSignIn(request);
  }

  if (pathname.startsWith("/dashboard/admin") && user.role !== "admin") {
    return redirectByRole(request, user);
  }

  if (pathname.startsWith("/dashboard/recruiter") && user.role !== "recruiter") {
    return redirectByRole(request, user);
  }

  if (pathname.startsWith("/dashboard/seeker") && user.role !== "seeker") {
    return redirectByRole(request, user);
  }

  if (pathname.includes("/apply") && user.role !== "seeker") {
    return redirectByRole(request, user);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/job/:id/apply",
    "/plans/success",
  ],
};
