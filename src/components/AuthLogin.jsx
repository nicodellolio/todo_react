import { useState, useEffect, useRef } from 'react'

function AuthLogin({ setShowTodoApp }) {
    const [formData, setFormData] = useState({ username: '', email: '' })
    const [takenUsernames, setTakenUsernames] = useState(['gino', 'franco', 'michele', 'gianluca'])
    // eslint-disable-next-line no-unused-vars
    const [takenEmails, setTakenEmails] = useState(['gino@gmail.com', 'franco@gmail.com', 'michele@gmail.com', 'gianluca@gmail.com',])
    const [usernameStatus, setUsernameStatus] = useState('idle')
    const [loadingForm, setLoadingForm] = useState(false)
    const [showSubmitMessage, setShowSubmitMessage] = useState(false)
    const [showTakenUsernames, setShowTakenUsernames] = useState(false)
    const [isValid, setIsValid] = useState(false);

    const inputRefUsername = useRef(null)
    const inputRefEmail = useRef(null)

    const disabled = !formData.username.trim() || !isValid

    const handleFormKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }

    useEffect(() => {
        const username = formData.username.trim()
        const hasMinLength = username.length >= 3

        if (!hasMinLength) {
            return
        }

        const timer = setTimeout(() => {
            const isTaken = takenUsernames.includes(username.toLowerCase())
            setUsernameStatus(isTaken ? 'taken' : 'available')
        }, 500)

        return () => clearTimeout(timer)
    }, [formData.username, takenUsernames])

    const usernameMessages = {
        idle: { text: '', color: '' },
        checking: { text: 'Controllo disponibilità...', color: 'skyblue' },
        available: { text: 'Username disponibile', color: 'lime' },
        taken: { text: 'Username già preso', color: 'red' },
    }

    const { text: usernameText, color: usernameColor } = usernameMessages[usernameStatus]

    const hasMinLength = formData.username.length >= 3

    const handleUsernameChange = (e) => {
        const typedUsername = e.target.value
        const trimmed = typedUsername.trim()
        setFormData(prev => ({ ...prev, username: typedUsername }))

        if (trimmed.length < 3) {
            setUsernameStatus('idle')
        } else {
            setUsernameStatus('checking')
        }

    }

    const handleEmailChange = (e) => {
        const validEmail = inputRefEmail.current.checkValidity();
        setIsValid(validEmail);
        setFormData({ ...formData, email: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (hasMinLength && isValid) {

            setTakenUsernames((prev) => [...prev, formData.username.toLowerCase().trim()])
            setTakenEmails((prev) => [...prev, formData.email.toLowerCase().trim()])

            setLoadingForm(true)
            setFormData({ username: '', email: '' })
            setShowTakenUsernames(false)

            setTimeout(() => {
                setLoadingForm(false)
                setShowSubmitMessage(true)
                setUsernameStatus('idle')
            }, 1000);
        }
    }



    useEffect(() => {
        inputRefUsername.current.focus();
    }, [])

    return (
        loadingForm ? (
            <div className="flex items-center justify-center mr-2" >
                <div
                    className="w-[100px] h-[100px] rounded-full border-2 border-transparent animate-spin"
                    style={{
                        borderTopColor: usernameColor || '#6366f1',
                        borderRightColor: usernameColor || '#6366f1',
                        animationDuration: '0.6s'
                    }
                    }
                />
            </div >
        )
            : showSubmitMessage ?
                <SubmitSuccess setShowTodoApp={setShowTodoApp} />
                :
                (
                    <div style={{ backgroundColor: "#1544ff30" }} className="space-y-4 p-5 rounded-xl shadow-xl max-w-md mx-auto mt-10 ">
                        <h1 className="mb-10 text-[2rem] font-bold">Registrati per usare l'app</h1>
                        <form
                            className="space-y-4 p-5"
                            onSubmit={handleSubmit}
                            onKeyDown={handleFormKeyDown}

                        >
                            <div>
                                <label htmlFor="username" className="">Username</label>
                                <div className="flex flex-row">
                                    {usernameStatus == 'checking' &&
                                        <div className="flex items-center justify-center mr-2">
                                            <div
                                                className="w-4 h-4 rounded-full border-2 border-transparent animate-spin"
                                                style={{
                                                    borderTopColor: usernameColor || '#6366f1',
                                                    borderRightColor: usernameColor || '#6366f1',
                                                    animationDuration: '0.6s'
                                                }}
                                            />
                                        </div>
                                    }
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        min='3'
                                        value={formData.username}
                                        onChange={handleUsernameChange}
                                        ref={inputRefUsername}
                                        style={{ borderColor: usernameColor }}
                                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <>
                                    {usernameStatus != 'checking' && usernameText &&
                                        <h2 className="inline me-2" style={{ color: usernameColor }}>{usernameText}</h2>}
                                    {usernameStatus == 'taken' && !showTakenUsernames &&
                                        <button type="button" onClick={() => setShowTakenUsernames(!showTakenUsernames)} className="text-sm inline animate-bounce">👁️</button>}
                                </>
                                {showTakenUsernames && (
                                    <div className="takenUsernames">
                                        <div className={`bg-blue-900 p-2 mt-3 rounded-md grid text-left relative ${takenUsernames.length > 5 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                            {takenUsernames.map((tU, idx) => (
                                                <div key={idx} className="text-[12px]">{tU}</div>
                                            ))}
                                            <button type="button" onClick={() => setShowTakenUsernames(false)} className="absolute right-3 top-0 h-[10px] w-[10px] rounded-full opacity-75">ｘ</button>
                                        </div>
                                    </div>
                                )}
                            </div>


                            <div>
                                <label htmlFor="email" className="">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleEmailChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div style={{ backgroundColor: "#ffffff06" }} className="space-y-4 rounded-xl shadow-xl max-w-md mx-auto mt-2">
                                <li className="block text-[1.3rem] ">
                                    <button
                                        type="submit"
                                        disabled={disabled}
                                        ref={inputRefEmail}
                                        style={{ backgroundColor: disabled ? 'gray' : '' }}
                                        className={`rounded rounded-full w-full pb-[5px] bg-green-500 text-[#404040]`}
                                    >
                                        Invia
                                    </button>
                                </li>
                            </div>
                        </form>
                    </div>
                ))
}

function SubmitSuccess({ setShowTodoApp }) {
    return (
        <div className="bg-[#404040] rounded-sm p-5">
            <h1
                style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: "700",
                    lineHeight: 1,
                    color: "lime"
                }}
                className="text-[2rem] animate-pulse"
            >
                Registrazione effettuata con successo!
            </h1>

            <button className="bg-lime-500 p-2 rounded-full mt-3" onClick={() => setShowTodoApp(true)} type="button">Vai all'applicazione</button>
        </div>
    )
}

export default AuthLogin;
