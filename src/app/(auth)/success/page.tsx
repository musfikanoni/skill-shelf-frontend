import Success from '@/feature/auth/Success';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Payment Successful',
} 

function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-slate-600">Verifying payment...</div>}>
            <Success />
        </Suspense>
    )
}

export default SuccessPage
