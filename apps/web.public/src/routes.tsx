// Core
import * as React from 'react'
import { Routes, Route } from 'react-router'

// Layouts
import { PublicLayout } from '~/layouts/PublicLayout/structure'
import { InternalLayout } from '~/layouts/InternalLayout'
import { SettingsLayout } from '~/layouts/SettingsLayout'
import { AuthLayout } from '~/layouts/AuthLayout/structure'

// Pages
import { FeedPage } from '~/pages/FeedPage'
import { PostPage } from '~/pages/PostPage'
import { ProfilePage } from '~/pages/ProfilePage'
import { LandingPage } from '~/pages/LandingPage'
import { SignInPage } from '~/pages/SignInPage'
import { SignUpPage } from '~/pages/SignUpPage'
import { ProfileSettingsPage } from '~/pages/ProfileSettingsPage'
import { CredsRecoveryPage } from './pages/CredsRecoveryPage'
import { ChallengePage } from './pages/ChallengePage'
import { NotFoundPage } from '~/pages/NotFoundPage'


export const RouteTree: React.FC = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="signin" element={<SignInPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="recovery" element={<CredsRecoveryPage />} />
      </Route>
    </Route>

    <Route element={<InternalLayout />}>
      <Route path="feed" element={<FeedPage />} />
      <Route path="its/:profile" element={<ProfilePage />} />
      <Route path="post/:post" element={<PostPage />} />
      <Route path="challenge/:challengeType" element={<ChallengePage />} />
      <Route path="settings" element={<SettingsLayout />}>
        <Route path="profile" element={<ProfileSettingsPage />} />

      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)
