import { Outlet } from 'react-router'
import * as React from 'react'


export const AuthLayout: React.FC = () => {

  return (
    <div>
      [Auth layout]

      <Outlet />
    </div>
  )
}