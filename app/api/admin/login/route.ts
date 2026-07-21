import { cookies } from "next/headers"

export async function POST(req: Request) {
    const body = await req.json()
    const login = body.login
    const password = body.password
    const cookieStore = await cookies()
    

    const adminLogin = process.env.ADMIN_LOGIN
    const adminPassword = process.env.ADMIN_PASSWORD


    if (adminLogin === login && adminPassword === password) { 
    cookieStore.set({
    name: "admin_session",
    value: "authenticated", // пока оставь так
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 5,
    path: "/"
  })
  return Response.json(
    { success: true }, 
  ); 
} else { 
  return Response.json(
    { error: "Wrong credentials" }, 
    { status: 401 }
  ); 
}}