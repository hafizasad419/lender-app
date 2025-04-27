import { Axios } from '@src/api';
import { ErrorNotification, SuccessNotification } from '@src/utils';


interface LenderSignupPayload {
    name: string;
    email: string;
    password: string;
    organization?: string;
    role?: string;
}


export const lenderSignup = async (
    {
        name,
        email,
        password,
        role = "lender",
        organization,
    }: LenderSignupPayload
) => {

    try {
        const response = await Axios.post('/auth/signup', {
            name,
            email,
            password,
            role,
            organization
        });

        if (response.status === 201) {
            // console.log('Admin created successfully:', response.data);
            SuccessNotification('Account created successfully!');
            return response.data;
        }
    } catch (error: any) {
        ErrorNotification(error?.response?.data?.error || 'Failed to create account.');
        throw error.response ? error : new Error("Something went wrong");

    }

};

