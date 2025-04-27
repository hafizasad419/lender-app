// src/Components/Profile/Profile.tsx
import React from 'react';

interface ProfileProps {
    name: string;
    email: string;
    organization?: string;
    role: 'lender' | 'collector' | 'admin';
}

const Profile: React.FC<ProfileProps> = ({ name, email, organization, role }) => {
    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md mx-auto border border-gray-200">
            <h2 className="text-2xl font-bold text-zinc mb-2 capitalize">{role} Profile</h2>
            <div className="space-y-2">
                <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-lg font-semibold text-gray-800">{name}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-semibold text-gray-800">{email}</p>
                </div>
                {organization && (
                    <div>
                        <p className="text-sm text-gray-500">Organization</p>
                        <p className="text-lg font-semibold text-gray-800">{organization}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
