import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import Swal from 'sweetalert2'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axiosSecure from '../../axios/axiosSecure'
import { getAuth, deleteUser } from 'firebase/auth'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'
import Logo from '../../shared/Logo';
import useSaveGoogleUser from '../../hooks/user/useSaveGoogleUser'


const SignUp = () => {
  const { createUser, setUser, updateUser, setLoading, loginWithGoogle } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const auth = getAuth()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const signUpUser = async (userData) => {
    const res = await axiosSecure.post('/users', userData)
    return res.data
  }

  const mutation = useMutation({ mutationFn: signUpUser })
  const { mutateAsync } = useSaveGoogleUser();

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    const form = e.target
    const formData = new FormData(form)
    const { email, password, name } = Object.fromEntries(formData.entries())

    try {
      const result = await createUser(email, password)
      await updateUser({ displayName: name })   // photo removed

      try {
        await mutation.mutateAsync({ name, email, role: 'user' })   // photo removed
        setUser({ ...result.user, displayName: name })

        Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'Welcome to our platform.',
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: 'rounded-2xl' }
        })
        navigate('/')

      } catch (dbError) {
        if (auth.currentUser) await deleteUser(auth.currentUser)
        throw new Error('Database saving failed. Please try again.', dbError)
      }

    } catch (error) {
      console.error(error)
      setLoading(false)
      setError(error?.message || 'Registration failed. Please try again.')
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error?.message,
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-2xl' }
      })
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')

    try {

      const result = await loginWithGoogle()

      // save user in database
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
    } finally {
      setGoogleLoading(false)
    }
  }

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', icon: <User size={15} className="text-gray-400" /> },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', icon: <Mail size={15} className="text-gray-400" /> },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Create a password', icon: <Lock size={15} className="text-gray-400" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-10 dm-sans">
      <div className="w-full max-w-lg">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {/* Branding */}
          <div className="text-center mb-8">
            <div className='flex items-center justify-center'>
              <Logo></Logo>
              <h2 className="text-2xl font-semibold text-[#486be3] ml-2">
                Estaura
              </h2>
            </div>
            <p className="text-gray-400 text-sm mt-2">Welcome back! Please sign in to continue.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">

            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{field.label}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2">{field.icon}</span>
                  <input
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.name !== 'photo'}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            ))}

            {/* Error */}
            {error && (
              <p className="flex items-center gap-1.5 text-red-500 text-xs bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                <AlertCircle size={13} /> {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-70 mt-2"
            >
              {mutation.isPending
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : null}
              {mutation.isPending ? 'Creating account...' : 'Create Account'}
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
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-semibold text-gray-700 shadow-sm disabled:opacity-70"
          >
            {googleLoading
              ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              : <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="w-5 h-5" />
            }
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/signin" className="text-indigo-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp