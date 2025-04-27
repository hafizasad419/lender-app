import { Axios } from '@src/api';
import { ErrorNotification, SuccessNotification } from '@src/utils';


interface LenderLoginPayload {
    email: string;
    password: string;
    role?: string;
}

export const lenderLogin = async (
    {
        email,
        password,
        role = "lender",
    }: LenderLoginPayload
) => {

    try {
        const response = await Axios.post('/auth/login', {
            email,
            password,
            role,
        },);

        if (response.status === 200) {
            SuccessNotification('Logged in successfully!');
            return response.data;
        }
    } catch (error:any) {
        throw error.response ? error : new Error("Something went wrong, PLease Try again after some time.");

    }


};


