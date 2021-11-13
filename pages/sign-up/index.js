
import { MultiPass } from '../../components/forms/MultiPass';
import ResponsiveLayout from '../../components/responsive-layout/Responsive';




export default function SignUp() {

    return (
        <ResponsiveLayout viewData={{ SignUp: { Element: MultiPass, props: 'signUp' }, display: 'single' }} />
    )
}