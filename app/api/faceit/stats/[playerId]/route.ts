export async function GET(req: Request, { params }: { params: Promise<{ playerId: string }> }) {
    const { playerId } = await params
    console.log("DATABASE_URL raw:", JSON.stringify(process.env.DATABASE_URL))
    if (!playerId) return Response.json({ error: "playerId is required" }, { status: 400 })

    if (!process.env.FACEIT_API_KEY) {
        return Response.json({ error: "server misconfigured" }, { status: 500 })
    }

    try {
        const response = await fetch(
            `https://open.faceit.com/data/v4/players/${playerId}/history?game=cs2&limit=30`,
            { headers: { Authorization: `Bearer ${process.env.FACEIT_API_KEY}` } }
        )

        if (!response.ok) {
            return Response.json({ error: "faceit api error" }, { status: response.status })
        }

        const data = await response.json()
        return Response.json(data)
    } catch (error) {
        return Response.json({ error: "failed to fetch stats" }, { status: 500 })
    }
}