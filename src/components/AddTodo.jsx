// eslint-disable-next-line no-unused-vars
import react from 'react'
import LogoutButton from './LogoutButton'
import { useState } from "react";

function AddTodo({ onAddTodo, openStats, setOpenStats, setShowTodoApp }) {
    const [activityInput, setActivityInput] = useState("")
    const labelStyle = "block text-md text-left text-blue-300 font-bold"
    const [addingItem, setAddingItem] = useState(false)
    return (

        addingItem ? (
            <div style={{ backgroundColor: "#1544ff30" }} className="space-y-4 p-6 rounded-xl shadow-xl max-w-md mx-auto mt-10">
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        const form = e.target
                        const formData = new FormData(form)
                        const data = Object.fromEntries(formData.entries())
                        if (data.activity != "") {
                            onAddTodo(data)
                        }
                        form.reset()
                        setAddingItem(false)
                        setActivityInput("")
                    }}
                >
                    <div>
                        <label htmlFor="activity" className={labelStyle}>Attività</label>
                        <input
                            type="text"
                            id="activity"
                            name="activity"
                            placeholder="Inserisci l'attività"
                            value={activityInput}
                            onChange={(e) => setActivityInput(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="deadline" className={labelStyle}>Scadenza</label>
                        <input
                            type="time"
                            id="deadline"
                            name="deadline"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="priority" className={labelStyle}>Priorità</label>
                        <select
                            id="priority"
                            name="priority"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Seleziona priorità</option>
                            <option value="bassa">Bassa</option>
                            <option value="media">Media</option>
                            <option value="alta">Alta</option>
                        </select>
                    </div>

                    <div style={{ backgroundColor: "#ffffff06" }} className="space-y-4 px-1 py-2 rounded-xl shadow-xl max-w-md mx-auto mt-2">
                        <li className="block text-[2.3rem] ">
                            <button
                                type="submit"
                                className={`rounded rounded-full ${activityInput.trim() == "" ? "px-[1.2rem]" : "px-[0.7rem]"} pb-[5px] bg-green-500 text-[#404040]`}
                            >
                                {activityInput.trim() == "" ? "ⅹ" : "✔️"}
                            </button>
                        </li>
                    </div>
                </form>
            </div>
        ) : (
            <div style={{ backgroundColor: "#ffffff06" }} className="space-y-4 px-1 py-2 rounded-xl shadow-xl max-w-md mx-auto mt-10">
                <li className="block text-[2.3rem] px-1 flex flex-row justify-between items-center">
                    <div className="space-x-3 px-3 py-1.5 bg-[#404040] rounded-xl">
                        <button className="rounded rounded-full px-[1.1rem] pb-[5px] bg-green-500 text-[#404040]" style={{ maxHeight: "62px" }}
                            onClick={() => {
                                setAddingItem(!addingItem)
                                setOpenStats(false)
                            }}>
                            +
                        </button>
                        <button style={openStats ? { borderWidth: "5px", borderColor: "yellow", maxHeight: "62px" } : {}} className="rounded rounded-full px-[0.8rem] pb-[5px] bg-[#1151A5]"
                            onClick={() => {
                                setOpenStats(!openStats)
                            }}>
                            📊
                        </button>
                    </div>
                    <LogoutButton setShowTodoApp={setShowTodoApp} />
                </li>
            </div>
        )
    )
}

export default AddTodo;