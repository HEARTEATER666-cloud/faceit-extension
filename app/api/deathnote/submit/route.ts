import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    const data = await req.json()
    if (!data.player_id || !data.nickname || !data.reason) return Response.json({status: 400})
    try {
    const createSubmission = await prisma.deathnoteSubmission.create({
        data: {
            player_id: data.player_id,
            nickname: data.nickname,
            country: data.country,
            avatar: data.avatar,
            submitted_by: data.submittedBy,
            reason: data.reason,
            clip_url: data.clipUrl
        }
    })
    return Response.json(createSubmission)
    } catch(error)  {
        return Response.json("Server is not working",{status: 500})
    } 
}

