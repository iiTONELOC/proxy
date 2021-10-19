export function Redirect() {
    setTimeout(() => {
        window.location.replace('/sign-in')
    }, 3500)
    return (
        `You must be logged in! you will be redirected automagically!`
    )
}