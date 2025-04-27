import { useState } from 'react';
import LenderForm from './LenderForm';
import CollectorForm from './CollectorForm';
import { NavLink } from 'react-router-dom';

const Signup = () => {
  const [role, setRole] = useState<'lender' | 'collector'>('lender');
  const [userDetails, setUserDetails] = useState({});
  // console.log(userDetails);

  return (
    <div className="p-4 max-w-md mx-auto">

      <h1
        className='text-gray-700 font-bold text-3xl md:text-4xl my-4'
      >
        Sign up
      </h1>

      <h2 className="text-zinc font-bold text-base my-4">
        You are Signing up as
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
        <LenderForm
          setUserDetails={setUserDetails} />
      ) : role === 'collector' ? (
        <CollectorForm
          setUserDetails={setUserDetails} />
      ) : null

      }

      <div className="text-center mt-6">
        <span className="text-slate-700 dark:text-lightGray">Already have an account? </span>
        <NavLink
          to="/login"
          className="text-slate-700 dark:text-lightGray underline font-bold"
        >
          Login
        </NavLink>
      </div>
    </div>
  );
};

export default Signup;

