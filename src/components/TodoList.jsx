// eslint-disable-next-line no-unused-vars
import react from 'react'
import TodoItem from './TodoItem'

function TodoList({ filter, todoItems, completedTodo }) {
    return (
        <ul style={{ backgroundColor: "#ffffff06" }} className="space-y-4 p-6 rounded-xl shadow-xl max-w-md mx-auto mt-2">
            {todoItems.length > 0 ?
                filter == 'completed' ? (
                    todoItems.map(todoItem => (
                        todoItem.completed && (
                            <TodoItem key={todoItem.id} item={todoItem} completedTodo={completedTodo} />
                        )))
                ) :
                    filter == 'pending' ? (
                        todoItems.map(todoItem => (
                            !todoItem.completed && (
                                <TodoItem key={todoItem.id} item={todoItem} completedTodo={completedTodo} />
                            )))
                    ) :
                        todoItems.map(todoItem => (
                            <TodoItem key={todoItem.id} item={todoItem} completedTodo={completedTodo} />
                        ))
                : (
                    <h1 className="text-[#707070]">Nessun attività per oggi</h1>
                )}
        </ul>
    )
}

export default TodoList;