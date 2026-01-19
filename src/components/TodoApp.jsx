// eslint-disable-next-line no-unused-vars
import react from 'react'
import { useState } from 'react'
import TodoList from './TodoList'
import AddTodo from './AddToDo'
import TodoStats from './TodoStats'
import LogoutButton from './LogoutButton'
import useLocalStorage from './custom_hooks/useLocalStorage.js'

function TodoApp({setShowTodoApp}) {
    const [todoItems, setTodoItems] = useLocalStorage("todoItems", [])
    const [openStats, setOpenStats] = useState(false)
    const oggi = new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
    const handleAddTodo = (newTodo) => {
        setTodoItems((prevItems) => [
            ...prevItems,
            {
                id: prevItems.length ? prevItems[prevItems.length - 1].id + 1 : 1,
                completed: false,
                ...newTodo,
            },
        ])
    }
    const [filter, setFilter] = useState('all') //all, completed, pending

    const completedTodo = (id) => {
        // const newCompletedItem = todoItems.find((item) => item.id == id) //ignoriamoli per ora
        // setCompletedTodo(prev => [...prev, newCompletedItem]) //ignoriamoli per ora
        setTodoItems((prevItems) =>
            prevItems.map((prevItem) => {
                return prevItem.id == id
                    ? { ...prevItem, completed: true }
                    : prevItem
            })
        )
    }

    const handleSetFilter = (e) => {
        setFilter(e.target.value);
    }

    const deleteCompleted = () => {
        setTodoItems((prevItems) =>
            prevItems.filter((prevItem) => !prevItem.completed)
        )
    }



    return (
        <>
            <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "900", lineHeight: 1 }} className="text-[4rem]">Cose da fare oggi:</h1>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "900", fontSize: "1.25rem", textAlign: "left", fontStyle: "italic", marginLeft: "5px", lineHeight: 1 }}>{oggi}</h2>
            <TodoStats openStats={openStats} todoItems={todoItems} />
            <AddTodo openStats={openStats} setOpenStats={setOpenStats}
                onAddTodo={handleAddTodo} setShowTodoApp={setShowTodoApp} />

            <div style={{ backgroundColor: "#1544ff30" }} className="p-6 rounded-xl shadow-xl max-w-md mx-auto mt-2">
                <div className='filters'>
                    <button onClick={handleSetFilter} value="all" className="bg-gray-500 px-2 mx-1 rounded-full">All</button>
                    <button onClick={handleSetFilter} value="completed" className="bg-gray-500 px-2 mx-1 rounded-full">Completed</button>
                    <button onClick={handleSetFilter} value="pending" className="bg-gray-500 px-2 mx-1 rounded-full">Pending</button>
                </div>
                {filter == 'completed' &&
                    <button onClick={deleteCompleted} className="deleteCompleted mt-3 px-2 mx-1 bg-red-500 rounded-full
                px-2 mx-1 rounded-full">Svuota attività completate</button>
                }
                {/* ⚠️⚠️⚠️ aggiungere tasto per eliminare le todo completate */}
            </div>
            <div className="container">
                <TodoList filter={filter} completedTodo={completedTodo} todoItems={todoItems} />
            </div>
        </>
    )
}

export default TodoApp;