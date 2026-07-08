export async function GET(req: Request, {params}: {params: {playerId: string}}) {
    const playerId = params.playerId
    if (playerId === null) return Response.json({error:"playerId = null"},{status: 400})

    console.log("API KEY:", process.env.FACEIT_API_KEY)
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

    return Response.json(data)
}