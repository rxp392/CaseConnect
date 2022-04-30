import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req });

  if (!token && !!process.env.TEST_MODE) {
    return new Response(
      JSON.stringify({ error: { message: "Unauthenticated" } }),
      { status: 401 }
    );
  }

  return NextResponse.next();
}
