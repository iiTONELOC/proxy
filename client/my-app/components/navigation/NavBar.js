import NavLink from "./NavLink"
import { useEffect, useState } from 'react';
export default function NavBar() {
    const [mounted, setMounted] = useState(false);
    const destinations = [
        { name: 'Home', location: '/' },
        { name: 'Playground', location: '/playground' },
        { name: 'Sign In', location: '/sign-in' },
        { name: 'Sign Up', location: '/sign-up' },
        { name: 'Logout', },
    ]
    useEffect(() => {
        console.log(`NavBar is mounting`);
        setMounted(true);
        return () => setMounted(false)
    }, [])
    if (!mounted) return null
    return (
        <>
            <header className="bg-gray-800 flex flex-row justify-between p-2 items-center border-t-2 border-green-400" style={{ height: '65px' }}>
                <div className="bg-gray-400 rounded-full h-12 w-12 flex items-center justify-center">Proxy</div>
                <nav className=" flex  flex-row w-4/5 justify-end text-white">
                    <ul className="flex flex-wrap justify-end w-full ">
                        {destinations.map(dest => (<NavLink key={dest.name} {...dest} />))}
                    </ul>
                </nav>
            </header>
        </>
    )
}