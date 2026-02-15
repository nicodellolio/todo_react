// eslint-disable-next-line no-unused-vars
import react from 'react'
import { Fragment } from 'react'

function TodoItem({ item, completedTodo }) {
    const { id, completed, activity, deadline, priority } = item
    const priorityColor = priority == "bassa" ? "green" : priority == "media" ? "#cec70eff" : "red"
    const priorityLetter = priority == "bassa" ? "B" : priority == "media" ? "M" : "A"

    function handleCompletedTodo(id) {
        completedTodo(id)
    }

    return (
        <li className={
            "block text-left p-3 border-b border-gray-100 hover:bg-[#333] transition-colors font-semibold flex flex-row gap-2 justify-between flex-wrap" + (completed ? " line-through text-[#404040]" : "")} >
            <div style={{ lineHeight: 1 }} className="text-[2rem] w-full flex flex-row justify-between">
                <span>{activity}</span>
                <button onClick={() => handleCompletedTodo(id)} className="text-[1.5rem] mt-1">Ⓧ</button>
            </div>
            <div className="flex justify-between flex-row w-full items-center">
                <div className="text-md">
                    Scadenza: {deadline}
                </div>
                {priority && (
                    <div style={{ backgroundColor: priorityColor }} className="text-sm rounded-full px-[12px] py-[7px]">
                        {priorityLetter}
                    </div>)}
            </div>
        </li >
    )
}

export default TodoItem;    