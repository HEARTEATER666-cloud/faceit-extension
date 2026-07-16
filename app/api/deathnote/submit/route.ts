import { prisma } from "@/lib/prisma"
import { z } from "zod"

const submitPayloadSchema = z.object({
    player_id: z.string().min(1),
    nickname: z.string().min(1),
    country: z.string().min(1),
    avatar: z.string().min(1),
    reason: z.string().min(1),
    submittedBy: z.string().optional(),
    clipUrl: z.string().url().optional().or(z.literal("")),
})

export async function POST(req: Request) {
    const rawData = await req.json()
    const result = submitPayloadSchema.safeParse(rawData)

    if (!result.success) {
        return Response.json({ error: result.error.issues }, { status: 400 })
    }

    const data = result.data

    try {
        const createSubmission = await prisma.deathnoteSubmission.create({
            data: {
                player_id: data.player_id.trim(),
                nickname: data.nickname.trim(),
                country: data.country,
                avatar: data.avatar,
                submitted_by: data.submittedBy?.trim() || null,
                reason: data.reason.trim(),
                clip_url: data.clipUrl || null,
            }
        })
        return Response.json(createSubmission, { status: 201 })
    } catch (error) {
        return Response.json({ error: "Server is not working" }, { status: 500 })
    }
}