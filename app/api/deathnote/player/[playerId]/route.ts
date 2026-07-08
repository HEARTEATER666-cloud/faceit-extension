import { prisma } from "@/lib/prisma"

export async function GET(req: Request, {params}: {params: {playerId: string}}) {
    const playerId = params.playerId
    if (playerId === null) return Response.json({error:"playerId = null"}, {status: 400})

        try {
        const count = await prisma.deathnoteSubmission.count({
            where: {
                player_id: playerId
            },
})
        const memeScore = Math.min(count * 15, 100)
        return Response.json({count, memeScore})
} catch(error) {
    return Response.json("we got a problem", {status: 500})
}
}