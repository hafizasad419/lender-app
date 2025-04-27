import { Formik, Form } from 'formik';
import * as yup from 'yup';
import TextField from '@src/Components/FormikFields/TextField';
import { BiLoaderAlt } from 'react-icons/bi';
import { collectorLogin } from './api';
import { loginSuccess } from '@src/redux/slices/userSlice';
import { setToken } from '@src/utils';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CollectorLoginForm = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

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
            role: 'collector',  // Keep role specific for 'collector'
        };

        try {
            const loggedInCollector = await collectorLogin(payload);
            if (loggedInCollector) {
                // console.log(loggedInCollector)
                dispatch(loginSuccess(loggedInCollector?.collector))
                setToken("collector", loggedInCollector)
                navigate('/')
            }

        } catch (err: any) {
            // const msg = err?.response?.data?.message || 'Network error';

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
                        {form.isSubmitting ? <BiLoaderAlt className="animate-spin text-2xl mx-auto" /> : 'Login'}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default CollectorLoginForm;
