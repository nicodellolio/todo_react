import { useState, useEffect } from 'react'
import './App.css'

import TodoApp from './components/TodoApp';
import AuthLogin from './components/AuthLogin'



function App() {
  const [showTodoApp, setShowTodoApp] = useState(true)

  useEffect(()=>{
    console.log(showTodoApp);
  },[showTodoApp])

  return (
    <>
      {showTodoApp ?
        <TodoApp setShowTodoApp={setShowTodoApp} />
        :
        <AuthLogin setShowTodoApp={setShowTodoApp} />
      }
    </>
  )
}

export default App
