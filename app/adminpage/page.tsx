"use client"
import { useState } from "react"

type Submission = {
    id: string,
    reason: string,
    submitted_by: string | null,
    clip_url: string | null
}

export default function AdminPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [searchFind,setSearchFind] = useState("")
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [login,setLogin] = useState("")
    const [password,setPassword] = useState("")
    const [LoginError,setLoginError] = useState("")

    async function adminData() {
        setError(false)
        try {
            setLoading(true)
            const params = new URLSearchParams();
            const searchTerm = searchFind.trim();
            if (searchTerm) {
             params.set('nickname', searchTerm);
            }
            const queryString = params.toString();
            const url = queryString 
            ? `/api/deathnote/admin?${queryString}` 
            : "/api/deathnote/admin";

            const response = await fetch(url)
            if (!response.ok)  {
                throw new Error (`HTTP error Status: ${response.status}`)
            }
            const data = await response.json()
            console.log(data);
            console.log(data.submissions)
            setSubmissions(data.submissions)
        } catch (error) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    async function approveRejectedFunc(id: string, status: string) {

        try {
        const response = await fetch(`/api/deathnote/admin/${id}`, {
            method: "PATCH",
            headers: {
                    "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                status
            })
        })
        if (!response.ok) {
            return "response is not okey"
        }
        setSubmissions(submissions.filter((submission) => submission.id !== id))
        } catch(error) {
            return "approverejected func slomana"
        }
    }

    

    function submissionMap() {
        if (loading) return <p>Loading Submissions....</p>
        if (error) return <p>Error or no Pending submissions</p>
        if (submissions.length === 0) return <p>No pendind submissions</p>
        
        
        else {
            return (
            <div className="flex p-6 flex-wrap gap-6 ">
                {submissions.map(submission => (
                    <section 
                    className="flex flex-col justify-center gap-2 border-2 
                    rounded-xl p-4 border-dotted"
                    key={submission.id}>
                        <header className="">Reason: <br />{submission.reason}</header>
                        <section>Submitted By: {submission.submitted_by}</section>
                        <footer>Clip: {submission.clip_url}</footer>
                        <button onClick={() => approveRejectedFunc(submission.id, "APPROVED")} 
                        className="text-center bg-green-200 p-1 rounded-lg shadow-xs hover:bg-green-400 transition duration-300"
                        >Approved</button>
                        <button onClick={() => approveRejectedFunc(submission.id, "REJECTED")}
                        className="text-center bg-red-200 p-1 rounded-lg shadow-xs hover:bg-red-400 transition duration-300"
                        >Reject</button>
                        </section>
                ))}
            </div>
        )}
    }


    async function adminLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const response = await fetch(`/api/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    login,
                    password
                })
            })
        if (!response.ok) {return setLoginError("Wrong login or password")}
        setIsAuthorized(true)
        } catch (error) {
            return console.error(error);
        } 
    }


    async function adminLogout() {
    try {
        const response = await fetch('/api/admin/logout', {
            method: 'POST', 
            credentials: 'include'
        });
        
        if (response.ok) {
            setIsAuthorized(false);
        }
    } catch (error) {
        console.error('Ошибка выхода:', error);
    }
}


    if (!isAuthorized) return (
        <form className="flex flex-col justify-center text-center mt-20" onSubmit={adminLogin}>
            <label>Login: </label>
            <input className="text-center" onChange={(e) => setLogin(e.target.value)} placeholder="Login"/>
            <label>Password: </label>
            <input className="text-center" 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password"
            type="password"
            />
            <button>Log in</button>
        </form>
    )


    return <div>
        <header className="text-red-500 text-center">
            Admin Panel<br></br>
            <button className="p-2" onClick={() => adminLogout()}>Logout</button>
        </header>
        <section className="flex flex-col justify-center">
            <input onChange={(e) => setSearchFind(e.target.value)} placeholder="Search nickname"/>
            <button onClick={() => adminData()}>Search</button>
        </section>
        <p className="text-center">Pending submissions: {submissions.length}</p>
        <section className="">
            {submissionMap()}
        </section>
    </div>
}