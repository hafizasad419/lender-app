import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import { ErrorNotification } from '@src/utils';
import Profile from '@src/Components/Layout/Profile';
import { BiLoaderAlt } from 'react-icons/bi';
import { Axios } from '@src/api';
import Fallback from '@src/Components/Fallback';

interface Lender {
    name: string;
    email: string;
    organization?: string;
}

const LenderProfile: React.FC = () => {
    const [lender, setLender] = useState<Lender | null>(null);
    const [loading, setLoading] = useState(true);
    const lenderFromState = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const fetchLenderProfile = async () => {
            try {
                // const res = await Axios.get(`/lender/profile/${lenderFromState._id}`);
                // setLender(res?.data?.lender);
                setLender(lenderFromState);
            } catch (error:any) {
                const message = error.response?.data?.error || error?.message || 'Failed to fetch lender profile.';
                ErrorNotification(message);
            } finally {
                setLoading(false);
            }
        };

        fetchLenderProfile();
    }, []);

    if (loading) return <Fallback />

    if (!lender) {
        return (
            <div className="text-center text-red-500 mt-10">Lender profile could not be loaded.</div>
        );
    }

    return (
        <div className="py-10">
            <Profile
                name={lender.name}
                email={lender.email}
                organization={lender.organization}
                role="lender"
            />
        </div>
    );
};

export default LenderProfile;

