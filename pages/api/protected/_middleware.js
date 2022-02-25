import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req });

  if (!token) {
    return new Response(
      JSON.stringify({ error: { message: "Unauthenticated" } }),
      { status: 401 }
    );
  }

  let res = NextResponse.next();

  if (!req.cookies["case-id"]) {
    res.cookie("case-id", token.user.caseID, { httpOnly: true });
  }

  return res;
}
