export const dynamic = 'force-dynamic';
    
import { getUser } from '@/api/api-server'
import CheckoutPage from '@/app/components/website/Checkout'

import React from 'react'


export default async function page() {
    const user = await getUser()
    return (
        <CheckoutPage user={user} />
    )
}
