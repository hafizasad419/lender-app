import React from 'react'
import { stats } from './stats'
import { useSelector } from 'react-redux'
import type { RootState } from '@src/redux/store'

function Stats() {
    const lender = useSelector((state: RootState) => state.user)

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc">Welcome back, {lender?.name}</h1>
                    <p className="text-gray-700">Here's what's happening with your debt portfolios</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-700 mb-1">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-zinc">{stat.value}</h3>
                                <span className="text-sm text-green-600">{stat.change} this month</span>
                            </div>
                            <div className="p-3 rounded-full bg-zinc/10">
                                {<stat.icon
                                    className="h-6 w-6 text-zinc"
                                />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Stats
