import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"

const Confirm = ({ onReupload }: any) => {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-zinc/10 flex items-center justify-center mb-6">
          <CheckCircle className="h-12 w-12 text-zinc" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-zinc mb-3">
          Thank You for Confirming
        </h2>

        {/* Message */}
        <p className="text-gray-700 mb-8 max-w-md mx-auto">
          Your debt portfolio has been saved. Please Signup or Login to post your debt.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 flex-wrap mb-6">
          <button
            onClick={() => navigate("/signup")}
            className="btn-primary-zinc"
          >
            Signup Now
          </button>
          <button
            onClick={() => navigate("/login")}
            className="btn-primary-zinc"
          >
            Login
          </button>
        </div>

        {/* Reupload Link */}
        <button
          onClick={onReupload}
          className="btn-outline"
        >
          Upload a Different File
        </button>
      </div>
    </div>
  )
}

export default Confirm

