import { Divider, Stack, Input, Button, Group, ActionIcon } from '@mantine/core'
import { IconAsterisk, IconEyeClosed, IconEye, IconFingerprint, IconUser } from '@tabler/icons-react'
import * as React from 'react'


export const SignInPage: React.FC = () => {
  const [isPasswordVisible, setPasswordState] = React.useState(false)
  return (
    <Stack gap="xl" style={{ width: 350 }}>
      <Stack>
        <Input
          name="login"
          placeholder="Email or phone number..."
          aria-required
          leftSection={<IconUser />}
          />
        <Input
          name="password"
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder="super secret password..."
          autoComplete="current-password webauthn"
          leftSection={<IconAsterisk />}
          rightSectionPointerEvents="all"
          rightSection={
            <ActionIcon variant="subtle" onClick={() => setPasswordState(state => !state)}>
              {isPasswordVisible ? <IconEyeClosed /> : <IconEye />}
            </ActionIcon>
          } />
        <Group>
          <ActionIcon size="input-sm">
            <IconFingerprint />
          </ActionIcon>
          <Button
            variant="gradient"
            style={{ flexGrow: 1 }}>
            Sign in
          </Button>
        </Group>
      </Stack>
      <Divider label="OR" labelPosition="center" />
      <Stack>
        <Button variant="outline">
          Log in with Google
        </Button>
      </Stack>

      <Stack gap={0}>
        <Button variant="subtle">
          I already have an account
        </Button>
        <Button variant="subtle">
          Can't remember my password
        </Button>
      </Stack>
    </Stack>
  )
}