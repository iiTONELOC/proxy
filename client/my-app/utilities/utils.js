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
}