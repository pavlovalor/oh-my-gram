import { Divider, Stack, TextInput, Button, Group, ActionIcon, Loader, Tooltip } from '@mantine/core'
import { IconAsterisk, IconEyeClosed, IconEye, IconFingerprint, IconUser, IconBrandGoogle, IconAt, IconPhone } from '@tabler/icons-react'
import { SignUpWithCredentialsRequestSchema, type Credentials } from '@omg/public-contracts-registry'
import { Link, useNavigate } from 'react-router'
import { useOmgSession } from '~/client'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useForm } from '@mantine/form'
import { delay } from '~/utils'
import * as React from 'react'


export const SignUpPage: React.FC = () => {
  const [isPasswordVisible, setPasswordState] = React.useState(false)
  const [isSubmittingForm, setFormIndicator] = React.useState(false)
  const [, { isAuthorized, signUp }] = useOmgSession()
  const navigate = useNavigate()

  if (isAuthorized()) navigate('/profile')

  const form = useForm({
    initialValues: { login: '', password: '' } satisfies Credentials,
    validate: zodResolver(SignUpWithCredentialsRequestSchema),
    validateInputOnBlur: true,
  })

  const loginInput = React.useMemo(() => {
    const value = form.values.login
    const isEmail = !value.match(/^(\d|\+)/) || value.includes('@')
    const isEmpty = !value.length

    if (isEmpty) return { type: 'text', icon: <IconUser /> }
    if (isEmail) return { type: 'email', icon: <IconAt /> }
    return { type: 'tel', icon: <IconPhone /> }
  }, [form.values.login])

  const handleSubmit = React.useCallback(async (values: Credentials) => {
    setFormIndicator(true)
    await Promise.all([
      signUp(values),
      delay(.5, 'seconds'),
    ]).then(([response]) => {
      if (response.isResolved) {
        navigate('/challenge/create-profile')
      } else {
        setFormIndicator(false)
        form.setErrors({
          login: response.payload.message,
          password: response.payload.reason,
        })
      }
    })
  }, [signUp, navigate, form])

  return (
    <Stack gap="xl" style={{ width: 350 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            {...form.getInputProps('login')}
            name="login"
            type={loginInput.type}
            disabled={isSubmittingForm}
            placeholder="Email or phone number..."
            aria-required
            leftSection={loginInput.icon} />

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
            <Tooltip color="gray" label="Use biometric data to sign in">
              <ActionIcon
                size="input-sm"
                color="teal"
                disabled={isSubmittingForm}>
                {isSubmittingForm ? <Loader variant="" size="sm" /> : <IconFingerprint />}
              </ActionIcon>
            </Tooltip>

            <Button
              type="submit"
              disabled={isSubmittingForm}
              color="teal"
              variant="filled"
              style={{ flexGrow: 1 }}>
              {isSubmittingForm
                ? 'Creating another account...'
                : 'Sign up'}
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
        <Button component={Link} variant="subtle" to="/signin">
          I already have an account
        </Button>
        <Button component={Link} variant="subtle" to="/recovery">
          Can&apos;t remember my password
        </Button>
      </Stack>
    </Stack>
  )
}
