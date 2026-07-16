import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url)
    const nickname = searchParams.get("nickname")
    const adminKey = req.headers.get("x-admin-key")
    const ADMIN_SECRET = process.env.ADMIN_SECRET

    if (adminKey !== ADMIN_SECRET) return Response.json({error: "error"}, {status: 401})

    const where = {
        status: "PENDING" as const,
        ...(nickname ? {nickname} : {})
    }

    try {
    const submissions = await prisma.deathnoteSubmission.findMany({
        where,
        select: {
            reason: true,
            submitted_by: true,
            id: true,
            clip_url: true
        }
    })
    return Response.json({submissions}, {status: 200})
} catch (error) {
    return Response.json({error:"admin not working"}, {status: 500})
}
}