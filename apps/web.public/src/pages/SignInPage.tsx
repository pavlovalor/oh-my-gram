import { Divider, Stack, TextInput, Button, Group, ActionIcon, Loader } from '@mantine/core'
import { IconAsterisk, IconEyeClosed, IconEye, IconFingerprint, IconUser, IconBrandGoogle } from '@tabler/icons-react'
import { SignInWithCredentialsRequestSchema, type Credentials } from '@omg/public-contracts-registry'
import { zodResolver } from 'mantine-form-zod-resolver'
import { omgClient } from '~/client'
import { useForm } from '@mantine/form'
import { Link } from 'react-router'
import * as React from 'react'
import { notifications } from '@mantine/notifications'


export const SignInPage: React.FC = () => {
  const [isPasswordVisible, setPasswordState] = React.useState(false)
  const [isSubmittingForm, setFormIndicator] = React.useState(false)

  const form = useForm({
    initialValues: { login: '', password: '' } satisfies Credentials,
    validate: zodResolver(SignInWithCredentialsRequestSchema),
    validateInputOnBlur: true,
  })

  const handleSubmit = React.useCallback((values: Credentials) => {
    setFormIndicator(true)
    omgClient.auth.signIn(values)
      .then(response => {
        if (response.isResolved) {
          // TODO
        } else {
          form.setErrors({
            login: response.payload.message,
            password: response.payload.reason,
          })
        }
      })
      .catch(() => {
        notifications.show({
          title: 'Oops! Something got wrong',
          message: 'It looks like something is wrong with you network',
          color: 'red',
        })
      })
      .finally(() => {
        setFormIndicator(false)
      })
  }, [form])

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
        <Button
          variant="outline"
          leftSection={<IconBrandGoogle />}
          disabled={isSubmittingForm}>
          Log in with Google
        </Button>
      </Stack>

      <Stack gap={0}>
        <Button component={Link} variant="subtle" to="/signup">
          I don&apos;t have an account
        </Button>
        <Button component={Link} variant="subtle" to="/recovery">
          Can&apos;t remember my password
        </Button>
      </Stack>
    </Stack>
  )
}
