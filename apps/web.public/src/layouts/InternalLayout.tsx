import { Outlet } from 'react-router'
import * as React from 'react'


export const InternalLayout: React.FC = () => {

  return (
    <div>
      [Internal layout]

      <Outlet />
    </div>
  )
}
