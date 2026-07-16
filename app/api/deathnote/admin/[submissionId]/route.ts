import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, {params}: {params: Promise<{submissionId: string}>}) {
    const rawData = await req.json()
    const status = rawData.status
    const {submissionId} = await params
    const adminKey = req.headers.get("x-admin-key")
    const ADMIN_SECRET = process.env.ADMIN_SECRET

    
    if (adminKey !== ADMIN_SECRET) return Response.json({error: "no admin"},{status: 401})
     
    try {
    if (status === "APPROVED" || status === "REJECTED") {
        const submissionUpdate = await prisma.deathnoteSubmission.update({
            where: {id: submissionId},
            data: {status: status}
    })
    return Response.json(submissionUpdate)
    } else {
        return Response.json({error: 'Some error'}, {status: 400})
    }} catch(error) {
        return Response.json({error},{status: 500})
    }

}