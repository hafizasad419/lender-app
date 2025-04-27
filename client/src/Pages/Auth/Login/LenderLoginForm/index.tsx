import { Formik, Form } from 'formik';
import * as yup from 'yup';
import TextField from '@src/Components/FormikFields/TextField';
import { BiLoaderAlt } from 'react-icons/bi';
import { lenderLogin } from './api';
import { loginSuccess } from '@src/redux/slices/userSlice';
import { ErrorNotification, setToken } from '@src/utils';
import { useDispatch } from 'react-redux';

const LenderLoginForm = () => {

    const dispatch = useDispatch()

    const validationSchema = yup.object({
        email: yup
            .string()
            .email('Invalid email')
            .required('Required'),
        password: yup
            .string()
            .required("Required")
    });

    const initialValues = {
        email: '',
        password: '',
    };

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        const payload = {
            email: values.email,
            password: values.password,
            role: 'lender',
        };

        try {
            const loggedInLender = await lenderLogin(payload);

            if (loggedInLender) {
                dispatch(loginSuccess(loggedInLender?.lender));
                setToken("lender", loggedInLender);
                const csvData = localStorage.getItem('csvData');
                if (csvData) {
                    window.location.href = '/upload';
                }
            }
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                ErrorNotification(error.response.data.error);
            } else {
                ErrorNotification("Invalid Email or Password. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {(form) => (

                <Form className="space-y-4">
                    <TextField
                        field="email"
                        label_text="Email"
                        placeholder="Enter your email"
                    />

                    <TextField
                        field="password"
                        type="password"
                        label_text="Password"
                        placeholder="Enter your password"
                    />
                    <button
                        className={`btn w-full btn-primary`}
                        type="submit"
                        disabled={form.isSubmitting}
                    >
                        {form.isSubmitting ?
                            <BiLoaderAlt className="animate-spin text-2xl mx-auto" /> : 'Login'}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default LenderLoginForm;
