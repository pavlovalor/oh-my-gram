// Core
import { notifications } from '@mantine/notifications'
import { Outlet, Link } from 'react-router'
import { Trans } from '@lingui/react/macro'
import * as React from 'react'

// Mantine
import { Anchor, AppShell, Badge, Center, Group, Stack, Text, HoverCard, Select } from '@mantine/core'

// Local
import { LocalesContext, LANGUAGES, LOCALES } from '~/locales'
import { refusalNotificationChain } from './constants'
import { GithubProfileCard } from './components/GithubProfileCard/structure'
import { GithubRepoCard } from './components/GithubRepoCard/structure'


const fuckingLanguage = LANGUAGES[24]
const availableLanguages = LANGUAGES
  .filter(l => LOCALES.includes(l.isoCode as typeof LOCALES[number]))


export const PublicLayout: React.FC = () => {
  const [forbiddenAttemptCount, setForbiddenAttemptCount] = React.useState(0)
  const localeContext = React.useContext(LocalesContext)

  const handleLocaleSelect = React.useCallback((value: string | null) => {
    if (localeContext.isLoading) return
    if (localeContext.currentLocale === value) return
    if (value === fuckingLanguage.isoCode) {
      notifications.show(refusalNotificationChain[forbiddenAttemptCount])
      return void setForbiddenAttemptCount(c => ++c)
    }

    localeContext.setNextLocale(value as typeof LOCALES[number])
  }, [localeContext, forbiddenAttemptCount, setForbiddenAttemptCount])

  return (
    <AppShell>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <AppShell.Footer style={{ padding: 16 }}>
        <Center>
          <Stack gap={16} align="center">
            <Group>
              <HoverCard withArrow
                shadow="md" 
                width={320} 
                openDelay={200} 
                closeDelay={400}>
                <HoverCard.Target>
                  <Anchor
                    href="https://github.com/pavlovalor"
                    target="_blank"
                    rel="nofollow">
                      <Trans id="layout.public.footer.menu.items.github-profile">
                        Github profile
                      </Trans>
                  </Anchor>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <GithubProfileCard username="pavlovalor" />
                </HoverCard.Dropdown>
              </HoverCard>

              <HoverCard withArrow
                shadow="md" 
                width={320} 
                openDelay={200} 
                closeDelay={400}>
                <HoverCard.Target>
                  <Anchor
                    href="https://github.com/pavlovalor/oh-my-gram"
                    target="_blank"
                    rel="nofollow">
                    <Trans id="layout.public.footer.menu.items.source-code">
                      Curious about the source code
                    </Trans>
                  </Anchor>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <GithubRepoCard repo="pavlovalor/oh-my-gram" />
                </HoverCard.Dropdown>
              </HoverCard>

              <Anchor
                href="https://pavlo-valor.vercel.app/"
                target="_blank"
                rel="nofollow">
                <Trans id="layout.public.footer.menu.items.portfolio">
                  Look at my portfolio
                </Trans>
              </Anchor>

              <Anchor 
                component={Link}
                to="/idea">
                <Trans id="layout.public.footer.menu.items.idea">
                  Idea
                </Trans>
              </Anchor>

              <Anchor 
                component={Link}
                to="/terms">
                <Trans id="layout.public.footer.menu.items.terms">
                  Terms
                </Trans>
              </Anchor>
              
              <Anchor
                component={Link}
                to="/privacy">
                <Trans id="layout.public.footer.menu.items.privacy">
                  Privacy
                </Trans>
              </Anchor>

              <Select
                disabled={localeContext.isLoading}
                checkIconPosition="right"
                variant="unstyled"
                value={localeContext.currentLocale}
                onChange={handleLocaleSelect}
                data={availableLanguages.map(l => ({
                  disabled: false,
                  label: `${l.flag} ${l.nativeName}`,
                  value: l.isoCode,
                })).concat({
                  disabled: forbiddenAttemptCount === refusalNotificationChain.length,
                  label: `${fuckingLanguage.flag} ${fuckingLanguage.nativeName}`,
                  value: fuckingLanguage.isoCode,
                })} />
            </Group>

            <Text size="sm">
              Authored by&nbsp;
              <HoverCard withArrow
                shadow="md" 
                width={320} 
                openDelay={200} 
                closeDelay={400}>
                <HoverCard.Target>
                  <Anchor 
                    href="https://github.com/pavlovalor"
                    target="_blank"
                    rel="nofollow">
                    @pavlovalor
                  </Anchor>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <GithubProfileCard username="pavlovalor" />
                </HoverCard.Dropdown>
              </HoverCard>
              &nbsp;completely&nbsp;
              <Badge component="span" color="green">
                AI-Free
              </Badge>
            </Text>
          </Stack>
        </Center>
      </AppShell.Footer>
    </AppShell>
  )
}