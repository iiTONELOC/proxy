import { useEffect, useState } from 'react';
import Client from '../Providers/Client';
import DesktopLayout from "./Desktop";
import MobileLayout from './Mobile';
import Landing from '../Home';


export default function ResponsiveLayout({ viewData }) {
    const [mounted, setMounted] = useState(false)
    const [height, setHeight] = useState(false);
    const [view, setView] = useState(false);
    const navHeight = 65;
    function handleView(width, setView) {
        if (width <= 781) {
            setView('mobile');
        } else if (width > 781) {
            setView('desktop');
        }
    }
    useEffect(() => {
        setMounted(true);
        if (mounted) {
            const currentHeight = window.innerHeight;
            const width = window.innerWidth
            setHeight(currentHeight - navHeight);
            handleView(width, setView)
            window.addEventListener('resize', () => {
                const reHeight = window.innerHeight
                const reWidth = window.innerWidth
                setHeight(reHeight - navHeight);
                handleView(reWidth, setView)
            });
        }
        return () => setMounted(false)
    }, [mounted]);

    return (
        <Client>
            <section className="bg-gray-700  w-full" style={{ height: height ? `${height}px` : '93vh', }}>
                {
                    viewData.Landing ? <Landing /> :
                        view === 'mobile' ? <MobileLayout {...viewData} /> :
                            <DesktopLayout {...viewData} />
                }
            </section>
        </Client>

    )
}