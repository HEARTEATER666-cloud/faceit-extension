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

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault()
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
	const response = await fetch(`/api/deathnote/player/${playerId}`)
	if (!response.ok) return 
	const data = await response.json()
    console.log(data)
	setDeathnoteData(data)
        
    }

    const deathnoteDataLastReport = deathnoteData?.lastReport.map((report) => {
        return (
        <div 
        key={`${report.submitted_by}-${report.createdAt}`}
        className="border-2 border-orange-500 rounded-2xl p-2 mt-2 space-y-2">{report.reason}
        <p>Submitted by :{report.submitted_by}</p>
        <p>Created at: {new Date(report.createdAt).toLocaleDateString()}</p>
        </div>
    )
    })

    function scoreBadge(score: number) {     
            if (score >= 100) {
                return "bg-black"
            } else if (score >= 80) {
                return "bg-red-500"
        } else if (score >= 60) {
            return "bg-orange-500"
        } else if (score >= 40) {
            return "bg-yellow-500"
        } else if (score >= 20) {
            return "bg-green-500"
        }
    }


    return <div className="max-w-md mx-auto bg-[#060606] p-6 rounded-2xl">
        <div className="h-full  bg-[#2e2e2e] rounded-2xl p-4">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <h1 className="text-center text-xl text-orange-600">🏴‍☠️ FACEIT DEATHNOTE</h1>
        <form className="flex flex-col items-center p-2" onSubmit={handleSearch}>
        <input className="rounded-xl w-full p-2 mt-1" value={nickname} onChange={((e) => setNickname(e.target.value))}
        />
        <button 
        className="mt-2 border-2 w-full border-orange-500 rounded-2xl p-2 hover:bg-orange-800 transition bg-orange-500 text-white font-semibold" 
        onClick={handleSearch} disabled={loading}>Search</button>
        </form>

        <article className="">
            {player && deathnoteData && (
            <div className="flex flex-col items-center mt-4">
            <img className="w-16 h-16 rounded-full object-cover" src={player.avatar} alt={player.nickname}/>
            <header className="flex flex-col items-center">
            <h2 className="mt-2 text-3xl font-bold text-orange-500">{player.nickname}</h2>
            <p className="text-gray-400">{player.country}</p>
            </header>

            <section className="mt-6 w-full space-y-2 font-bold">
            <p className="text-orange-500 text-center">Faggot Score: {deathnoteData.memeScore}</p>
            <div className="bg-gray-600 h-3 rounded-full" 
            style={{width: 100 + "%"}}>
                <div className={`${scoreBadge(deathnoteData.memeScore)} h-3 rounded-full transition-all duration-500`}
                style={{width: deathnoteData.memeScore.toString() + "%"}}></div>
            </div>
            <p className="text-orange-500 text-center font-bold">Subsmissions: {deathnoteData.count}</p>
            </section>

            <section className="flex flex-col items-center mt-2 p-2 rounded-2xl text-orange-500">
                <p className="text-2xl mb-2 text-orange-500 font-bold">Last Reports</p> {deathnoteDataLastReport}</section>
            <footer className="mt-2">
            <button 
            className="mt-2 p-2 w-full rounded-lg bg-orange-600 py-2 font-semibold text-white hover:bg-orange-800 transition" 
            onClick={() => setShowForm(true)}>Submit to Deathnote</button>
            </footer>
            </div>
            )}
        </article>
        
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