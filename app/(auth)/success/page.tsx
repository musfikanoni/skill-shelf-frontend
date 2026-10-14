import Success from '@/feature/auth/Success';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Success',
} 

function SuccessPage() {
    return (
        <div>
            <Success />
        </div>
    )
}

export default SuccessPage