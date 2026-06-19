import { ShieldCheck } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router'
import logo from '../../src/assets/logo.png'

export default function Logo() {
  return (
    <div>
      <NavLink to="/" className=" select-none flex gap-2 items-center">
        <img className='w-7' src={logo} alt="Estaura" />

      </NavLink>
    </div>
  )
}
