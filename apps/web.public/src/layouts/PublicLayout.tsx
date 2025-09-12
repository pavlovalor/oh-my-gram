import { Outlet } from 'react-router'
import * as React from 'react'


export const PublicLayout: React.FC = () => {

  return (
    <div>
      [Public layout]

      <Outlet />
    </div>
  )
}