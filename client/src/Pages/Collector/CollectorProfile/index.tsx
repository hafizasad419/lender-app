import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import { ErrorNotification } from '@src/utils';
import Profile from '@src/Components/Layout/Profile';
import { BiLoaderAlt } from 'react-icons/bi';
import { Axios } from '@src/api';
import Fallback from '@src/Components/Fallback';

interface Collector {
    name: string;
    email: string;
    organization?: string;
}

const CollectorProfile: React.FC = () => {
    const [collector, setCollector] = useState<Collector | null>(null);
    const [loading, setLoading] = useState(true);
    const collectorFromState = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const fetchCollectorProfile = async () => {
            try {
                // const res = await Axios.get(`/collector/profile/${collectorFromState._id}`);
                // setCollector(res?.data?.collector);
                setCollector(collectorFromState);
            } catch (error: any) {
                const message = error.response?.data?.error || error?.message || 'Failed to fetch collector profile.';
                ErrorNotification(message);
            } finally {
                setLoading(false);
            }
        };

        fetchCollectorProfile();
    }, []);

    if (loading) return <Fallback />

    if (!collector) {
        return (
            <div className="text-center text-red-500 mt-10">Collector profile could not be loaded.</div>
        );
    }

    return (
        <div className="py-10">
            <Profile
                name={collector.name}
                email={collector.email}
                organization={collector.organization}
                role="collector"
            />
        </div>
    );
};

export default CollectorProfile;
