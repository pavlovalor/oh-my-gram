import { Divider, Stack, TextInput, Button, Group, ActionIcon, Loader, Tooltip } from '@mantine/core'
import { IconAsterisk, IconEyeClosed, IconEye, IconFingerprint, IconUser, IconBrandGoogle, IconAt, IconPhone } from '@tabler/icons-react'
import { SignInWithCredentialsRequestSchema, type Credentials } from '@omg/public-contracts-registry'
import { notifications } from '@mantine/notifications'
import { useOmgSession } from '~/client'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useForm } from '@mantine/form'
import { delay } from '~/utils'
import { Link, useNavigate } from 'react-router'
import * as React from 'react'


export const SignInPage: React.FC = () => {
  const [isPasswordVisible, setPasswordState] = React.useState(false)
  const [isSubmittingForm, setFormIndicator] = React.useState(false)
  const [isSubmitDisabled, setSubmitState] = React.useState(false)
  const [, { isAuthorized, signIn }] = useOmgSession()
  const navigate = useNavigate()

  if (isAuthorized()) navigate('/feed')

  const form = useForm({
    initialValues: { login: '', password: '' } satisfies Credentials,
    validate: zodResolver(SignInWithCredentialsRequestSchema),
    onValuesChange: () => setSubmitState(false),
    validateInputOnBlur: true,
  })

  const loginInput = React.useMemo(() => {
    const value = form.values.login
    const isEmail = !value.match(/^\d/) || value.includes('@')
    const isEmpty = !value.length

    if (isEmpty) return { type: 'text', icon: <IconUser /> }
    if (isEmail) return { type: 'email', icon: <IconAt /> }
    return { type: 'tel', icon: <IconPhone /> }
  }, [form.values.login])

  const handleSubmit = React.useCallback((values: Credentials) => {
    setFormIndicator(true)
    Promise.all([
      signIn(values),
      delay(1, 'second'),
    ])
      .then(([response]) => {
        if (response.isResolved) {
          navigate('/profile')
        } else {
          setSubmitState(true)
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
  }, [form, signIn, navigate])

  return (
    <Stack gap="xl" style={{ width: 350 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput {...form.getInputProps('login')}
            aria-required
            name="login"
            type={loginInput.type}
            disabled={isSubmittingForm}
            placeholder="Email or phone number..."
            leftSection={loginInput.icon} />

          <TextInput {...form.getInputProps('password')}
            aria-required
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
                disabled={isSubmittingForm}>
                {isSubmittingForm ? <Loader size="sm" /> : <IconFingerprint />}
              </ActionIcon>
            </Tooltip>

            <Button
              type="submit"
              disabled={isSubmittingForm || isSubmitDisabled}
              variant="gradient"
              style={{ flexGrow: 1 }}>
              {isSubmittingForm
                ? 'Opening new session...'
                : isSubmitDisabled
                  ? 'Update input'
                  : 'Sign in'}
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
