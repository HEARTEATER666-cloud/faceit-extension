"use client"
import { useState } from "react"

type Player = {
    player_id: string;
    nickname: string;
    country: string;
    avatar: string;
}

export default function FaceitSearch() {

const [nickname,setNickname] = useState("")
const [player,setPlayer] = useState<Player | null>(null)
const [loading,setLoading] = useState(false)
const [error,setError] = useState<string | null>(null)

const [showForm,setShowForm] = useState(false)

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
        } catch (error){
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

    return <div>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <input value={nickname} onChange={((e) => setNickname(e.target.value))}
        />
        <button className="" onClick={handleSearch} disabled={loading}>Search</button>

        <div>
            {player && (
            <div>
            <img src={player.avatar} alt={player.nickname}/>
            <p>{player.nickname}</p>
            <p>{player.country}</p>
            <p>{player.player_id}</p>
            <button onClick={() => setShowForm(true)}>Submit to Deathnote</button>
            </div>
            )}
        </div>
        
        <div>
            {player && showForm && (
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
}