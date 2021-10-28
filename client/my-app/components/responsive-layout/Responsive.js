import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { calculateHeight } from '../../utilities/utils';
import OnlyOnClient from '../Providers/Client';
import DesktopLayout from "./Desktop";
import MobileLayout from './Mobile';


export default function ResponsiveLayout({ viewData }) {
    const [mounted, setMounted] = useState(false);
    const [height, setHeight] = useState(false);
    const state = useSelector(state => state);
    const [view, setView] = useState(false);
    const { modal, toast } = state;

    const navHeight = 65;

    function handleView(width, setView) {
        if (width <= 781) {
            setView('mobile');
        } else if (width > 781) {
            setView('desktop');
        };
    };
    useEffect(() => {
        setMounted(true);
        let currentView = view === 'desktop';
        if (mounted) {
            const currentHeight = window.innerHeight;
            const width = window.innerWidth;
            setHeight(calculateHeight(currentHeight, navHeight, currentView));
            handleView(width, setView);
            window.addEventListener('resize', () => {
                const reHeight = window.innerHeight;
                const reWidth = window.innerWidth;
                setHeight(calculateHeight(reHeight, navHeight, currentView));
                handleView(reWidth, setView);
            });
        }
        return () => setMounted(false);
    }, [mounted]);

    const viewController = (view, viewData) => {
        switch (view) {
            case 'mobile':
                return <MobileLayout modal={modal} toast={toast} {...viewData} />;
            case 'desktop':
                return <DesktopLayout modal={modal} toast={toast} {...viewData} />;
            default:
                return <DesktopLayout modal={modal} toast={toast} {...viewData} />
        };
    };

    return (
        <OnlyOnClient>
            <section className="bg-gray-700  w-full" style={{ height: height ? `${height}px` : '93vh', }} >

                {viewController(view, viewData)}
            </section>
        </OnlyOnClient>
    );
};

