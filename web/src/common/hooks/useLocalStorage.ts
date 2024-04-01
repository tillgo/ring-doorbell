import { useState, useEffect } from 'react'

export function useLocalStorage(key: string) {
    const [value, setValue] = useState(() => {
        // Get initial value from localStorage or use default
        const storedValue = localStorage.getItem(key)
        if (storedValue) {
            return storedValue
        }
        return null
    })

    useEffect(() => {
        // Function to update state based on localStorage change
        const storageChangeHandler = (event: StorageEvent) => {
            console.log(
                '>>>>> storageChangeHandler',
                event.storageArea,
                event.key,
                key,
                event.newValue
            )
            if (event.storageArea === localStorage && event.key === key) {
                setValue(event.newValue)
            }
        }

        // Add event listener for storage changes
        window.addEventListener('storage', storageChangeHandler)

        // Cleanup function to remove event listener on unmount
        return () => {
            window.removeEventListener('storage', storageChangeHandler)
        }
    }, [key]) // Re-run effect if `key` changes

    // Periodic check for changes (handles deletions)
    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentLocalStorageValue = window.localStorage.getItem(key)
            setValue(currentLocalStorageValue)
        }, 1000) // Check every 1 second

        return () => clearInterval(intervalId)
    }, [key])

    return value
}

export default useLocalStorage
