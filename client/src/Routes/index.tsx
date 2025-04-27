import AuthRoutes from './AuthRoutes'
import LenderRoutes from './ProtectedRoutes/LenderRoutes'
import CollectorRoutes from './ProtectedRoutes/CollectorRoutes'
import AdminRoutes from './ProtectedRoutes/AdminRoutes'
import { Suspense } from 'react'
import Fallback from '@src/Components/Fallback'


function BaseRoutes({ user }: any) {


    return (
        <Suspense fallback={<Fallback />}>
            <>
                {
                    user?.role === 'lender' ? (
                        <>
                            <LenderRoutes />
                        </>
                    )
                        :
                        user?.role === 'collector' ? (
                            <CollectorRoutes />
                        )
                            :
                            user?.role === 'admin' ? (
                                <>
                                    <AdminRoutes />
                                </>
                            )
                                :
                                (
                                    <>
                                        <AuthRoutes />
                                    </>
                                )

                }
            </>
        </Suspense>
    )
}

export default BaseRoutes





