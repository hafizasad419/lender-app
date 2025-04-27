import { Formik, Form } from 'formik';
import * as yup from 'yup';
import TextField from '@src/Components/FormikFields/TextField';
import { BiLoaderAlt } from 'react-icons/bi';
import { lenderSignup } from './api';
import { useNavigate } from 'react-router-dom';

const LenderForm = ({ setUserDetails }: any) => {
    
    const navigate = useNavigate()

    const validationSchema = yup.object({
        name: yup.string().min(3, "Come on don't be shy").required('Required'),
        email: yup.string().email('Invalid email').required('Required'),
        password: yup
            .string()
            .min(8, 'Min 8 characters')
            .matches(/[A-Z]/, 'One uppercase required')
            .matches(/[a-z]/, 'One lowercase required')
            .matches(/\d/, 'One number required')
            .matches(/[!@#$%^&*(),.?":{}|<>]/, 'One special char required')
            .required('Required'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Required'),
        organization: yup.string().optional(),
    });

    const initialValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        organization: '',
    };

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        const payload = {
            name: values.name,
            email: values.email,
            password: values.password,
            organization: values.organization,
            role: 'lender',
        };

        try {
            await lenderSignup(payload);
            navigate('/login')
            setUserDetails(payload);
        } catch (error:any) {
            // const msg = err?.response?.data?.message || 'Network error';
            console.log("error on signup: ", error?.message)
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

                    <p className='text-red-500 font-semibold'>
                        I want help in recovering my money</p>

                    <TextField
                        field="name"
                        label_text="Full Name"
                        placeholder="Enter your full name" />

                    <TextField field="email"
                        label_text="Email"
                        placeholder="Enter your email" />

                    <TextField field="organization" label_text="Organization (optional)" placeholder="Enter your organization" />

                    <TextField field="password"
                        type="password" label_text="Password" placeholder="Enter your password" />

                    <TextField field="confirmPassword" type="password" label_text="Confirm Password" placeholder="Confirm your password" />


                    <button
                        className={`btn w-full btn-primary`}
                        type="submit"
                        disabled={form.isSubmitting}
                    >
                        {form.isSubmitting ? <BiLoaderAlt className="animate-spin text-2xl mx-auto" /> : 'Sign Up'}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default LenderForm;


