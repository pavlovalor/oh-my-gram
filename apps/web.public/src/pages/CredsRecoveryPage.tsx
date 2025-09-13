import { Divider, Stack, TextInput, Button, Loader, Text } from '@mantine/core'
import { IconUser, IconBrandGoogle } from '@tabler/icons-react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useForm } from '@mantine/form'
import * as React from 'react'
import * as zod from 'zod'
import { Link } from 'react-router'


const CredsSchema = zod.object({
  login: zod.string().min(6),
})


export const CredsRecoveryPage: React.FC = () => {
  const [isSubmittingForm, setFormIndicator] = React.useState(false)

  const form = useForm({
    initialValues: { login: '' },
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
          <Text ta="center">
            Type down an email or phone number which your account
            supposed to be registered with. We will send you a reset
            password letter.
          </Text>
          <TextInput
            {...form.getInputProps('login')}
            name="login"
            disabled={isSubmittingForm}
            placeholder="Email or phone number..."
            aria-required
            leftSection={<IconUser />} />

          <Button
            type="submit"
            disabled={isSubmittingForm}
            variant="gradient"
            style={{ flexGrow: 1 }}>
            {isSubmittingForm ? (
              <React.Fragment>
                <Loader variant="" mr="md" size="sm" />
                  Sending inbox instructions...
              </React.Fragment>
            ) : (
              <React.Fragment>
                  Recover
              </React.Fragment>
            )}
          </Button>
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
        <Button component={Link} variant="subtle" to="/signin">
          I&apos;ve remembered my password
        </Button>
      </Stack>
    </Stack>
  )
}
