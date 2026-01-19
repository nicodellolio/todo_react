// eslint-disable-next-line no-unused-vars
import { react, useEffect } from "react";

function LogoutButton({ setShowTodoApp }) {

    return (
            <button className="rounded rounded-full h-[50px] text-[1.5rem] px-[0.75rem] bg-[#ff0055]"
                onClick={() => {
                    setShowTodoApp(false)
                }}>
                ⏻️
            </button>
    )
}

export default LogoutButton