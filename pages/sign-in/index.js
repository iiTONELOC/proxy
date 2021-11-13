import { MultiPass } from '../../components/forms/MultiPass';
import ResponsiveLayout from '../../components/responsive-layout/Responsive';

export default function SignIn() {
    return (
        <ResponsiveLayout viewData={{ Login: { Element: MultiPass, props: 'login' }, display: 'single' }} />
    )
}