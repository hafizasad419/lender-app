import { Axios } from '@src/api';
import { ErrorNotification, SuccessNotification } from '@src/utils';


interface CollectorLoginPayload {
    email: string;
    password: string;
    role?: string;
}

export const collectorLogin = async (
    {
        email,
        password,
        role = "collector",
    }: CollectorLoginPayload
) => {

    try {
        const response = await Axios.post('/auth/login', {
            email,
            password,
            role,
        },);

        if (response.status === 200) {
            // console.log('Admin created successfully:', response.data);
            SuccessNotification('Logged in successfully!');
            return response.data;
        }
    } catch (error) {
        ErrorNotification(error?.response?.data?.error || 'Failed to Login.');
        throw error.response ? error : new Error("Something went wrong while Logging in.");

    }


};

