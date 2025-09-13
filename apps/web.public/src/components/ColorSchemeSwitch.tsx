import { ActionIcon, useComputedColorScheme, useMantineColorScheme, type MantineColorScheme } from '@mantine/core'
import { IconMoon, IconBrightnessAutoFilled, IconSun } from '@tabler/icons-react'
import * as React from 'react'

type ComputedColorScheme = Exclude<MantineColorScheme, 'auto'>
const getOppositeColorScheme = (colorScheme: ComputedColorScheme): ComputedColorScheme =>
  colorScheme === 'dark' ? 'light' : 'dark'

export const ColorSchemeSwitch: React.FC = () => {
  const { setColorScheme, colorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme()

  const handleColorSchemeChange = React.useCallback(() => {
    const preferredColorScheme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'

    if (colorScheme === 'auto') return setColorScheme(getOppositeColorScheme(computedColorScheme))
    setColorScheme(colorScheme === preferredColorScheme ? 'auto' : getOppositeColorScheme(colorScheme))
  }, [setColorScheme, colorScheme, computedColorScheme])

  return (
    <ActionIcon
      onClick={handleColorSchemeChange}
      variant="subtle"
      size="md"
      aria-label="Toggle color scheme">
      {colorScheme === 'auto' && <IconBrightnessAutoFilled />}
      {colorScheme === 'dark' && <IconMoon />}
      {colorScheme === 'light' && <IconSun />}
    </ActionIcon>
  )
}
