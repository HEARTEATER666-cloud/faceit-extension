import { prisma } from "@/lib/prisma"

export async function GET(req: Request, {params}: {params: {playerId: string}}) {
    const playerId = await params.playerId
    if (playerId === null) return Response.json({error:"playerId = null"}, {status: 400})

        try {
        const count = await prisma.deathnoteSubmission.count({
            where: {
                player_id: playerId
            },
})
        const memeScore = Math.min(count * 15, 1000)
        const lastReport = await prisma.deathnoteSubmission.findMany({
        take: 3,
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            reason: true,
            submitted_by: true,
            createdAt: true
        }
})
        return Response.json({count, memeScore,lastReport})
} catch(error) {
    return Response.json("we got a problem", {status: 500})
}
}
