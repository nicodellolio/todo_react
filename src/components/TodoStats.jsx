// eslint-disable-next-line no-unused-vars
import { react, useEffect } from "react";

function TodoStats({ openStats, todoItems }) {

    const highPriority = todoItems.filter(todoItem => todoItem.priority == "alta").length
    const mediumPriority = todoItems.filter(todoItem => todoItem.priority == "media").length
    const lowPriority = todoItems.filter(todoItem => todoItem.priority == "bassa").length
    
    return (
        openStats && (
            <div className="bg-yellow-500 mt-5 rounded-[10px] p-2">
                <h1>Conteggio Attività: <strong>{todoItems.length}</strong></h1>
                <h1>Alta priorità: <strong>{highPriority}</strong></h1>
                <h1>Media priorità: <strong>{mediumPriority}</strong></h1>
                <h1>Bassa priorità: <strong>{lowPriority}</strong></h1>
            </div>
        )
    )
}

export default TodoStats