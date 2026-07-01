export async function GET(req: Request) {
    const {searchParams} = new URL(req.url)
    const nickname = searchParams.get("nickname")

    if (nickname === null) return Response.json({error: "nickname is required"}, {status: 400})

    const response = await fetch(`https://open.faceit.com/data/v4/players?nickname=${nickname}`, 
    {
        headers: {
            Authorization: `Bearer ${process.env.FACEIT_API_KEY}`
        }
    })

    if (!response.ok) return Response.json({error: "failed to fetch player"}, {status: 404})

    const data = await response.json()  
    if (!data.player_id) return Response.json({error:"player not found"}, {status: 404})

    return Response.json(data)
    
}