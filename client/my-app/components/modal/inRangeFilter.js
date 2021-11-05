import Button from "../Button/Button";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { _REDUX_SET_MODAL, _REDUX_SET_RANGE } from "../../utilities/redux/actions";

function textColor(value) {
    if (value >= 0 && value <= 30) { return 'text-green-500' }
    else if (value >= 31 && value <= 60) { return 'text-green-700 ' }
    else if (value >= 61 && value <= 90) { return 'text-yellow-300' }
    else if (value >= 91 && value <= 150) { return 'text-yellow-500' }
    else if (value >= 151) { return 'text-red-500' }
}

export default function InRangeFilter({ currentRange }) {
    const [isMounted, setMounted] = useState(false);
    const [range, setRange] = useState(currentRange);
    const [newValue, setNewValue] = useState(null)
    const dispatch = useDispatch();
    function handleSelect(e) {
        setRange(e.target.value);
        setNewValue(e.target.value);
    };
    function updateRangeFilter(e, range) {
        e.preventDefault();
        dispatch({
            type: _REDUX_SET_RANGE,
            range: range
        });
        dispatch({ type: _REDUX_SET_MODAL, toggle: 'true' });
    };

    const pageButtons = [
        {
            color: { color: 'gray-500', hover: 'green-700' },
            radius: 'rounded-md',
            class: 'text-white text-center p-2 ml-2',
            action: {
                onClick: (e) => { updateRangeFilter(e, range) }
            },
            name: 'Apply'
        },
        {
            color: { color: 'gray-500', hover: 'red-700' },
            radius: 'rounded-md',
            class: `text-white text-center p-2 ml-2`,
            action: {
                onClick: (e) => { setRange(currentRange); setNewValue(0); }
            },
            name: `Reset`
        },
    ];

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    if (isMounted === false) return null;

    return (
        <span className='w-full flex flex-col justify-start gap-3 items-center text-gray-300 bg-gray-800 rounded-md p-2'>
            <h1>Currently viewing all users within <span className={`${textColor(currentRange)}  w-24 text-center`}>{currentRange} miles</span></h1>
            <label className=''> Select a new range: </label>
            <span className='h-8'>{newValue > 0 && <p className={`${textColor(newValue)}`}>{newValue} miles</p>} </span>
            <input
                type="range"
                name="range"
                value={range}
                min='0'
                max='250'
                onChange={handleSelect}
            />
            <span>
                {pageButtons.map((button, index) => {
                    return (
                        <Button key={button.name} {...button}>
                            {button.name}
                        </Button>
                    )
                })}
            </span>
        </span>
    );
};


