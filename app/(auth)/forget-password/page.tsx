
import ForgetPassPage from '@/feature/auth/ForgetPassPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Forget Password',
}


const page = () => {
    return (
        <div>
            <ForgetPassPage />
        </div>
    );
};

export default page;