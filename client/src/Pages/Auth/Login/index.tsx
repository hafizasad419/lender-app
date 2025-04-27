import { useState } from 'react';
import CollectorLoginForm from './CollectorLoginForm';
import { NavLink } from 'react-router-dom';
import LenderLoginForm from './LenderLoginForm';

const Login = () => {
  const [role, setRole] = useState<'lender' | 'collector'>('lender');


  return (
    <div className="p-4 max-w-md mx-auto">


      <h1
        className='text-gray-700 font-bold text-3xl md:text-4xl my-4'
      >
        Login to your account
      </h1>

      <h2 className="text-zinc font-bold text-base my-4">
        You are Logging in as
      </h2>

      <div className="flex gap-4 justify-start mb-6">
        <button
          className={`btn ${role === 'lender' ? 'btn-primary-zinc' : 'btn-outline'}`}
          onClick={() => setRole('lender')}
          type="button"
        >
          Lender
        </button>
        <button
          className={`btn ${role === 'collector' ? 'btn-primary-zinc' : 'btn-outline'}`}
          onClick={() => setRole('collector')}
          type="button"
        >
          Collector
        </button>

      </div>

      {role === 'lender' ? (
        <LenderLoginForm />
      ) : role === 'collector' ? (
        <CollectorLoginForm />
      ) : null

      }

      <div className="text-center mt-6">
        <span className="text-slate-700 dark:text-lightGray">
          Don't have an account? </span>
        <NavLink
          to="/signup"
          className="text-slate-700 dark:text-lightGray underline font-bold"
        >
          Sign up
        </NavLink>
      </div>
    </div>
  );
};

export default Login;

