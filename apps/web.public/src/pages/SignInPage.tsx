import { Divider, Stack, TextInput, Button, Group, ActionIcon, Loader } from '@mantine/core'
import { IconAsterisk, IconEyeClosed, IconEye, IconFingerprint, IconUser } from '@tabler/icons-react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useForm } from '@mantine/form'
import * as React from 'react'
import * as zod from 'zod'


const CredsSchema = zod.object({
  login: zod.string().min(6),
  password: zod.string().min(6),
})


export const SignInPage: React.FC = () => {
  const [isPasswordVisible, setPasswordState] = React.useState(false)
  const [isSubmittingForm, setFormIndicator] = React.useState(false)

  const form = useForm({
    initialValues: { login: '', password: '' },
    validate: zodResolver(CredsSchema),
    validateInputOnBlur: true,
  })

  const handleSubmit = React.useCallback(async (values: any) => {
    setFormIndicator(true)
    await new Promise(r => setTimeout(r, 3000))
    setFormIndicator(false)
  }, [])

  return (
    <Stack gap="xl" style={{ width: 350 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            {...form.getInputProps('login')}
            name="login"
            disabled={isSubmittingForm}
            placeholder="Email or phone number..."
            aria-required
            leftSection={<IconUser />} />

          <TextInput
            {...form.getInputProps('password')}
            name="password"
            disabled={isSubmittingForm}
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Super secret password..."
            autoComplete="current-password webauthn"
            leftSection={<IconAsterisk />}
            rightSectionPointerEvents="all"
            rightSection={
              <ActionIcon variant="subtle" onClick={() => setPasswordState(state => !state)}>
                {isPasswordVisible ? <IconEyeClosed /> : <IconEye />}
              </ActionIcon>
            } />

          <Group>
            <ActionIcon
              size="input-sm"
              disabled={isSubmittingForm}>
              <IconFingerprint />
            </ActionIcon>

            <Button
              type="submit"
              disabled={isSubmittingForm}
              variant="gradient"
              style={{ flexGrow: 1 }}>
              {isSubmittingForm ? (
                <React.Fragment>
                  <Loader variant="" mr="md" size="sm" />
                  Opening new session...
                </React.Fragment>
              ) : (
                <React.Fragment>
                  Sign in
                </React.Fragment>
              )}
            </Button>
          </Group>
        </Stack>
      </form>
      <Divider label="OR" labelPosition="center" />
      <Stack>
        <Button variant="outline"
          disabled={isSubmittingForm}>
          Log in with Google
        </Button>
      </Stack>

      <Stack gap={0}>
        <Button variant="subtle">
          I already have an account
        </Button>
        <Button variant="subtle">
          Can&apos;t remember my password
        </Button>
      </Stack>
    </Stack>
  )
}
