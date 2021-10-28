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
export function calculateHeight(winHeight, navHeight, desktop) {
    const height = winHeight - navHeight;
    // if (desktop && height < 490) return 490;
    return height;
};
export function genTailWindColorEquiv(style) {
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
}
