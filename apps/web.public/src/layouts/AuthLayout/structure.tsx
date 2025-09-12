import { Center, Group, Stack } from '@mantine/core'
import { Outlet } from 'react-router'
import * as React from 'react'
import illustration from './assets/landing-3x.png'
import logo from './assets/logo.full.svg'

export const AuthLayout: React.FC = () => {

  return (
    <Center p="xl" mih="100dvh" pb={100}>
      <Group align="center" justify="center" gap="xl">
        <img src={illustration} style={{ maxWidth: '45%' }} />
        <Stack>
          <img src={logo} height={42} />
          <Outlet />
        </Stack>
      </Group>
    </Center>
  )
}