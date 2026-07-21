import { cookies } from "next/headers"

export async function GET(req: Request) {
    const cookieStore = await cookies()

    cookieStore.delete("admin_session")

    return Response.json({
        success: true
    })
}