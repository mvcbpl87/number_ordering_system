import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./supabase/middleware";
import { createClient } from "./supabase/server";
import path from "./lib/path";

export async function middleware(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = request.nextUrl;
  if (url.pathname === "/")
    return NextResponse.redirect(new URL(path.login, process.env.BASE_URL!));

  // if (url.pathname.startsWith("/dashboard")) {
  //   if (!session)
  //     return NextResponse.redirect(new URL(path.login, process.env.BASE_URL!));
  // }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
