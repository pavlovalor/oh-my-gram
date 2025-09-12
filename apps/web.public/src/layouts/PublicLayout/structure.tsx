// Core
import { Outlet, Link } from 'react-router'
import * as React from 'react'

// Mantine
import { Anchor, AppShell, Badge, Center, Group, Stack, Text, HoverCard, Select } from '@mantine/core'

// Local
import { GithubProfileCard } from './components/GithubProfileCard/structure'
import { GithubRepoCard } from './components/GithubRepoCard/structure'


export const PublicLayout: React.FC = () => {

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
                    Github profile
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
                    Curious about the source code
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
                Look at my portfolio
              </Anchor>

              <Anchor 
                component={Link}
                to="/idea">
                Idea
              </Anchor>

              <Anchor 
                component={Link}
                to="/terms">
                Terms
              </Anchor>
              
              <Anchor
                component={Link}
                to="/privacy">
                Privacy
              </Anchor>

              <Select
                variant="unstyled"
                onSelect={console.log}
                value={'🏴󠁧󠁢󠁥󠁮󠁧󠁿 English'}
                data={['🏴󠁧󠁢󠁥󠁮󠁧󠁿 English', '🇺🇦 Ukrainian', '🏳️‍🌈 Muscovian']} />
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
              <Badge color="green">
                AI-Free
              </Badge>
            </Text>
          </Stack>
        </Center>
      </AppShell.Footer>
    </AppShell>
  )
}