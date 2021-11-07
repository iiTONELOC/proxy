import { useEffect, useState } from "react"

export function Redirect() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (mounted) {

        setTimeout(() => {
            window.location.replace('/sign-in')
        }, [3500])
    }
    return (
        `You must be logged in! you will be redirected automagically!`
    )
}