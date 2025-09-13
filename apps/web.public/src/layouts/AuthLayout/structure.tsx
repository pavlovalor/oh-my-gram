import { Center, Group, Stack } from '@mantine/core'
import { WrittenLogo } from '~/components/WrittenLogo'
import { Outlet } from 'react-router'
import * as React from 'react'
import illustration from './assets/landing-3x.png'

export const AuthLayout: React.FC = () => {

  return (
    <Center p="xl" mih="100dvh" pb={100}>
      <Group align="center" justify="center" gap="xl">
        <img src={illustration} className="mantine-visible-from-sm" style={{ maxWidth: '45%' }} />
        <Stack>
          <WrittenLogo height={42} />
          <Outlet />
        </Stack>
      </Group>
    </Center>
  )
}