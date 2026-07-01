export async function GET(req: Request, {params}) {
    const playerId = params.player_id

    if (playerId === null) return Response.json({error:"playerId = null"},{status: 400})

    const response = await fetch(
  `https://open.faceit.com/data/v4/players/${playerId}/history?game=cs2&limit=30`,
  {
    headers: {
      Authorization: `Bearer ${process.env.FACEIT_API_KEY}`
    }
  }
)

    if (!response.ok) return Response.json({error:"no response"},{status: 400})
    const data = await response.json()
}