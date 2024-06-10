import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({
      ...formData, [e.target.id]: e.target.value,
    })
  }


  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false)
      setError(null)
      navigate('/');
    } catch (error) {
      setError(data.message);
      setLoading(false);
    }


  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        {/* <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} /> */}
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'> {loading ? "loading..." : "Sign In"}</button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Haven't an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
