import { BrowserRouter } from 'react-router-dom'
import BaseRoutes from './Routes'
import { useDispatch, useSelector } from 'react-redux'
import BaseHeader from './Components/Header'
import { useEffect } from 'react'
import { getAuthUser } from './utils'
import { loginSuccess } from './redux/slices/userSlice'

function App() {

  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      const localUser = getAuthUser();
      if (localUser) {
        dispatch(loginSuccess(localUser));
      }
    }
  }, [user]);

  return (
    <>
      <BrowserRouter>
        <BaseHeader />
        <BaseRoutes user={user} />
      </BrowserRouter>
    </>
  )
}

export default App

{/* <div className="text-gray-700 bg-orange-500 font-bold">Hello World!</div> */ }