import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { calculateHeight } from '../../utilities/utils';
import OnlyOnClient from '../Providers/Client';
import DesktopLayout from "./Desktop";
import MobileLayout from './Mobile';


export default function ResponsiveLayout({ viewData }) {
    const [mounted, setMounted] = useState(false);
    const [height, setHeight] = useState(null);
    const state = useSelector(state => state);
    const [view, setView] = useState(null);
    const { modal, toast } = state;


    function handleView(width, setView) {
        if (width <= 781) {
            setView('mobile');
        } else if (width > 781) {
            setView('desktop');
        };
    };
    useEffect(() => {
        setMounted(true);
        if (mounted) {
            setHeight(calculateHeight());
            handleView(window.innerWidth, setView);
            window.addEventListener('resize', () => {
                setHeight(calculateHeight());
                handleView(window.innerWidth, setView);
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

