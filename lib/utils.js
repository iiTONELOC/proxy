import { RiErrorWarningFill } from 'react-icons/ri';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { TiWarning } from 'react-icons/ti';
import { MdDangerous } from 'react-icons/md';
const colors = [
    'bg-gray-900',
    'bg-red-500',
    'bg-yellow-600',
    'bg-green-500',
    'bg-blue-400',
    'bg-indigo-500',
]
export function formatTime_hh_mm_ss(time) {
    return new Date(parseFloat(time)).toLocaleTimeString()
};
export function randomNumber(num) {
    return Math.floor(Math.random() * num)
};
export function generateRandomTwBgColor() {
    const num = randomNumber(colors.length - 1);
    return colors[num]
};
export function calculateHeight() {
    const navHeight = 65;
    return window.innerHeight - navHeight;
};
export function genTailwindColorEquiv(style) {
    switch (style) {
        case 'danger':
            return 'rgba(220, 38, 38, 1)';
        case 'success':
            return 'rgba(52, 211, 153, 1)'
        case 'warning':
            return 'rgba(245, 158, 11, 1)'
        case 'info':
            return 'rgba(96, 165, 250, 1)'
        default:
            break;
    }
};
export function variantColor(type) {

    switch (type) {
        case 'danger':
            return `red-500`
        case 'success':
            return `green-400`
        case 'warning':
            return `yellow-400`
        case 'info':
            return `blue-400`
        case 'custom':
            return `${type.customBg}`
        default:
            return generateRandomTwBgColor()
    }
};
const iconStyle = (variant) => {
    return { color: genTailwindColorEquiv(variant) }
}
export function variantIcon(Type, iconSize) {
    const variant = Type?.type || Type;
    switch (variant) {
        case 'danger':
            return <MdDangerous style={iconStyle(variant)} size={iconSize} />
        case 'success':
            return <BsFillCheckCircleFill style={iconStyle(variant)} size={iconSize} />
        case 'warning':
            return <TiWarning style={iconStyle(variant)} size={iconSize} />
        case 'info':
            return <RiErrorWarningFill style={iconStyle(variant)} size={iconSize} />
        case 'custom':
            return <Type.CustomIcon />
        default:
            break;
    }
};
export function statusColor(status) {
    // ['active', 'busy', 'away', 'do not disturb']
    switch (status) {
        case 'active':
            return variantColor('success')
        case 'busy':
            return 'gray-400'
        case 'away':
            return variantColor('warning')
        case 'do not disturb':
            return variantColor('danger')
        default:
            return 'gray-400'
    }
};
export function browserGetLocation() {
    if (!navigator.geolocation) {
        return console.log('Geolocation is not supported by your browser');
    } else {
        return navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const locationData = {
                latitude: `${latitude}`,
                longitude: `${longitude}`
            }
            return locationData
        }, (e) => {
            return console.log('Unable to retrieve location', e);
        });
    };
};
export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
export function validateMessage(message) {
    const regEx = /([a - zA - Z0 - 9])$/
    return regEx.test(message.trimEnd());
};
export function characterCountColor(count) {
    const length = count;
    if (length <= 84) return 'green';
    if (length >= 85 && length <= 139) return 'yellow';
    if (length >= 140 && length <= 274) return 'orange'
    if (length >= 275) return 'red'
};
