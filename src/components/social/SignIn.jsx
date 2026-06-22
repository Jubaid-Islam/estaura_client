import { use, useState, useRef } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import Swal from 'sweetalert2'
import { Link, useLocation, useNavigate } from 'react-router'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import Logo from '../../shared/Logo';
import useSaveGoogleUser from '../../hooks/user/useSaveGoogleUser'

const DEMO_CREDENTIALS = {
  user:  { email: 'user@1.com',  password: '111111' },
  agent: { email: 'agent@1.com', password: '111111' },
  admin: { email: 'admin@1.com', password: '111111' },
};

const SignIn = () => {
  const { signIn, loginWithGoogle } = use(AuthContext)
  const { mutateAsync } = useSaveGoogleUser();
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [activeRole, setActiveRole] = useState(null)

  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const handleQuickFill = (role) => {
    const cred = DEMO_CREDENTIALS[role];
    if (!cred) return;
    if (emailRef.current) emailRef.current.value = cred.email;
    if (passwordRef.current) passwordRef.current.value = cred.password;
    setActiveRole(role);
  };

  const handleSignIn = async e => {
    e.preventDefault()
    const form = e.target
    const email = form.email.value
    const password = form.password.value
    setIsSubmitting(true)
    setError('')
    try {
      await signIn(email, password)
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        showConfirmButton: false,
        timer: 1500,
        customClass: { popup: 'rounded-2xl' }
      })
      navigate(`${location.state ? location.state : '/'}`)
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err?.message || 'Invalid email or password',
        customClass: { popup: 'rounded-2xl' }
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError('')
    try {
      const result = await loginWithGoogle()
      await mutateAsync(result.user)
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        showConfirmButton: false,
        timer: 1500,
        customClass: { popup: 'rounded-2xl' }
      })
      navigate(location.state ? location.state : '/')
    } catch (err) {
      console.error(err)
      setError('Google sign-in failed. Please try again.')
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err?.response?.data?.error || 'Failed to save user data',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-2xl' }
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 dm-sans">
      <div className="w-full max-w-lg">

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {/* Branding */}
          <div className="text-center mb-6">
            <div className='flex items-center justify-center'>
              <Logo></Logo>
              <h2 className="text-2xl font-semibold text-[#486be3] ml-2">
                Estaura
              </h2>
            </div>
            <p className="text-gray-400 text-sm mt-2">Welcome back! Please sign in to continue.</p>
          </div>

          {/* Demo role quick-fill */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {Object.keys(DEMO_CREDENTIALS).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleQuickFill(role)}
                className={`py-2 rounded-xl text-sm font-medium capitalize border transition ${
                  activeRole === role
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={emailRef}
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  onChange={() => setActiveRole(null)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600">Password</label>
                <span className="text-xs text-indigo-500 hover:text-indigo-700 cursor-pointer transition">Forgot password?</span>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={passwordRef}
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  onChange={() => setActiveRole(null)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="flex items-center gap-1.5 text-red-500 text-xs bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                <AlertCircle size={13} /> {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-70 mt-2"
            >
              {isSubmitting
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : null}
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-semibold text-gray-700 shadow-sm disabled:opacity-70"
          >
            {isGoogleLoading
              ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              : <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="w-5 h-5" />
            }
            {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn