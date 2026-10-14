import { Metadata } from 'next';
import SignUnPage from '@/feature/auth/SignUnPage';

export const metadata: Metadata = {
    title: 'Sign Up',
}

const page = () => {
    return (
        <div>
            <SignUnPage />
        </div>
    );
};

export default page;