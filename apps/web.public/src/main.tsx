// Core
import { BrowserRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core';
import * as ReactDom from 'react-dom/client'
import * as React from 'react'
import '@mantine/core/styles.css';

// Layouts
import { PublicLayout } from './layouts/PublicLayout/structure'
import { InternalLayout } from './layouts/InternalLayout'
import { SettingsLayout } from './layouts/SettingsLayout'
import { AuthLayout } from './layouts/AuthLayout'

// Pages
import { FeedPage } from './pages/FeedPage'
import { PostPage } from './pages/PostPage'
import { ProfilePage } from './pages/ProfilePage'
import { LandingPage } from './pages/LandingPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { ProfileSettingsPage } from './pages/ProfileSettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'


const mountingPoint = document.getElementById('root')!
const queryClient = new QueryClient()


ReactDom
  .createRoot(mountingPoint, {
    identifierPrefix: 'omg',
  })
  .render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route index element={<LandingPage />} />

                <Route element={<AuthLayout />}>
                  <Route path="signin" element={<SignInPage />} />
                  <Route path="signup" element={<SignUpPage />} />
                </Route>
              </Route>

              <Route element={<InternalLayout />}>
                <Route path="feed" element={<FeedPage />} />
                <Route path="its/:profile" element={<ProfilePage />} />
                <Route path="post/:post" element={<PostPage />} />

                <Route path="settings" element={<SettingsLayout />}>
                  <Route path="profile" element={<ProfileSettingsPage />} />
                  
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </MantineProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
