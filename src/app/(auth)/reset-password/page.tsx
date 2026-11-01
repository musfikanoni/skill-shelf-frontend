
import ResetPasswordPage from '@/feature/auth/ResetPasswordPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reset Password',
}


const page = () => {
    return (
        <div>
            <ResetPasswordPage />
        </div>
    );
};

export default page;