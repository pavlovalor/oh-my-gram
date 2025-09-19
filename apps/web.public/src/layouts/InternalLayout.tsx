import { AppShell, Box, Group } from '@mantine/core'
import { Outlet } from 'react-router'
import * as React from 'react'
import { WrittenLogo } from '~/components/WrittenLogo'


export const InternalLayout: React.FC = () => {

  return (
    <AppShell header={{ height: { sm: 50, lg: 70, base: 40 } }}>
      <AppShell.Header>
        <Group mx="auto" my={0} h="100%" w="90%" maw={1200}>
          <WrittenLogo height="50%" />
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Box mx="auto" my={0} h="100%" w="90%" maw={1200} py="lg">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}
