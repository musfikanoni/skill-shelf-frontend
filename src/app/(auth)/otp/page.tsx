
import OtpVerification from '@/feature/auth/OtpVerification';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'OTP',
}


const page = () => {
    return (
        <div>
            <OtpVerification />
        </div>
    );
};

export default page;