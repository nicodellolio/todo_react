import { useState, useEffect } from 'react'

function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        if (typeof window === 'undefined') return initialValue
        try {
            const stored = window.localStorage.getItem(key)
            if (stored === null) return initialValue
            return JSON.parse(stored)
        } catch {
            return initialValue
        }
    })

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue]
}

export default useLocalStorage