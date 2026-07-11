"use client"
import { useState } from "react"


type Player = {
    player_id: string;
    nickname: string;
    country: string;
    avatar: string;
}

type lastReport = {
    reason: string,
    submitted_by: string,
    createdAt: number
}

type deathnoteInfo = {
    count: number;
    memeScore: number;
    lastReport: lastReport[]
}

export default function FaceitSearch() {

const [nickname,setNickname] = useState("")
const [player,setPlayer] = useState<Player | null>(null)
const [loading,setLoading] = useState(false)
const [error,setError] = useState<string | null>(null)

const [showForm,setShowForm] = useState(false)
const [deathnoteData, setDeathnoteData] = useState<deathnoteInfo | null>(null)

const [reason,setReason] = useState("")
const [submittedBy,setSubmittedBy] = useState("")
const [clipUrl,setClipUrl] = useState("")

    async function handleSearch() {
        setError(null)
        setPlayer(null)

        try {
        if (!nickname.trim()) {
            setError("nickname is required")
            return  
        } 
        setLoading(true)
        const response = await fetch(`/api/faceit/player?nickname=${nickname}`)
        if (!response.ok) return setError("bad request")

        //Распарс json
        const data = await response.json()
        if (!data.player_id) return setError("didn`t find player")
        setPlayer(data)
        await deathnoteInfo(data.player_id)
        } catch (error){
        console.error(error)
        setError("Something went wrong")
        } finally {
        setLoading(false)
        }}

    async function handleSubmit() {
        if (!player) return
        try {
            if(!reason.trim()) {
                setError("reason is required") 
                return
            }
        setLoading(true)
        const response = await fetch("/api/deathnote/submit", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                ...player,
                reason,
                submittedBy,
                clipUrl
        })
        })
        if(!response.ok) return setError("failed to submit")
        //иначе
        setShowForm(false)
        setReason("")
        setSubmittedBy("")
        setClipUrl("")
        } catch (error) {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
}

    async function deathnoteInfo(playerId: string) {
    console.log("deathnote called", playerId)
	const response = await fetch(`/api/deathnote/player/${playerId}`)
	
	if (!response.ok) return 

	const data = await response.json()
    console.log(data)
	setDeathnoteData(data)
        
    }

    const deathnoteDataLastReport = deathnoteData?.lastReport.map((report) => {
        return (
        <div>{report.reason}
        <p>Submitted by :{report.submitted_by}</p>
        <p>Created at: {report.createdAt}</p>
        </div>
    )
    })

    return <div className="max-w-md mx-auto bg-[#060606] text-orange-600 p-6 rounded-2xl">
        <div className="h-full  bg-[#2e2e2e]">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <input className="" value={nickname} onChange={((e) => setNickname(e.target.value))}
        />
        <button className="" onClick={handleSearch} disabled={loading}>Search</button>

        <div className="">
            {player && deathnoteData && (
            <div className="flex flex-col items-center">
            <img className="w-32 h-32 rounded-full object-cover" src={player.avatar} alt={player.nickname}/>
           
            <p className="mt-4 text-3xl font-bold">{player.nickname}</p>
            <p className="text-gray-400">{player.country}</p>
            <div className="mt-6 space-y-2">
            <p>{player.player_id}</p>
            <p>Meme Score:{deathnoteData.memeScore}</p>
            <p>Subsmissions: {deathnoteData.count}</p>
            </div>
            <div className="mt-6">{deathnoteDataLastReport}</div>
            <button 
            className="mt-6 w-full rounded-lg bg-orange-600 py-2 font-semibold text-white hover:bg-orange-700 transition" 
            onClick={() => setShowForm(true)}>Submit to Deathnote</button>
            </div>
            )}
        </div>
        
        <div>
            {player && showForm && deathnoteData &&(
                <div>
                    <textarea placeholder="reason" value={reason} onChange={((e) => setReason(e.target.value))}>Reason</textarea>
                    <input placeholder="Your faceit nickname" value={submittedBy} onChange={((e) => setSubmittedBy(e.target.value))}/>
                    <input placeholder="It would be more fun with a clip " value={clipUrl} onChange={((e) => setClipUrl(e.target.value))}/>
                    <br/>
                    <button onClick={handleSubmit}>Submit to Deathnote</button>
                </div>
            )}
            
        </div>
        </div>
    </div>
}