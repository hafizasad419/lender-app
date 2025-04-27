import { ArrowLeft, Home } from "lucide-react"
import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div className='flex flex-col justify-center items-center h-screen w-full text-gray-700'>
        <p className='text-8xl'>404</p>
        <p className='text-2xl'>Not Found</p>
        <div className="flex flex-wrap justify-center gap-4 my-8">
          <Link
            to="/"
            className="flex items-center bg-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
        </div>
  )
}

export default NotFound