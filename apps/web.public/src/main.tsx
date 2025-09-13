// Core
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { BrowserRouter } from 'react-router'
import * as ReactDom from 'react-dom/client'
import * as React from 'react'

// Styles
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

// Local
import { LocalesProvider } from '~/locales'
import { RouteTree } from '~/routes'


const mountingPoint = document.getElementById('root')!
const queryClient = new QueryClient()


ReactDom
  .createRoot(mountingPoint, {
    identifierPrefix: '@omg',
  })
  .render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme="auto">
          <LocalesProvider>
            <BrowserRouter>
              <RouteTree />
            </BrowserRouter>
            <Notifications />
          </LocalesProvider>
        </MantineProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
