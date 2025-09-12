import { Anchor, Avatar, Group, Stack, Text, Skeleton } from '@mantine/core'
import { getProfileUrl, useGithubProfileQuery } from './useGithubProfileQuery.hook'
import * as React from 'react'


export const GithubProfileCard: React.FC<{
  username: string,
}> = props => {
  const githubProfile = useGithubProfileQuery(props.username)
  const profileUrl = getProfileUrl(props.username)

  if (githubProfile.isLoadingError) return (
    <Group>
      <Text size="xs" style={{ fontFamily: 'monospace' }}>
        Failed to load profile information from Github API: <br/>
        <Anchor href={profileUrl} target="_blank">{profileUrl}</Anchor>
      </Text>
    </Group>
  )
  
  if (githubProfile.isLoading) return (
    <React.Fragment>
      <Group>
        <Skeleton height={40} circle radius="xl" />
        <Stack gap={8}>
          <Skeleton height={8} width={60} radius="xl" />
          <Skeleton height={6} width={40} radius="xl" />
        </Stack>
      </Group>

      <Stack gap={10} mt="md">
        <Skeleton height={8} width="100%" radius="xl" />
        <Skeleton height={8} width="90%" radius="xl" />
        <Skeleton height={8} width="70%" radius="xl" />
      </Stack>

      <Group mt="md" mb="xs" gap="xl">
        <Group mt="md" gap="sm">
          <Skeleton height={8} width={20} radius="xl" />
          <Skeleton height={8} width={70} radius="xl" />
        </Group>
        <Group mt="md" gap="sm">
          <Skeleton height={8} width={20} radius="xl" />
          <Skeleton height={8} width={70} radius="xl" />
        </Group>
      </Group>
    </React.Fragment>
  ) 
  
  return (
    <React.Fragment>
      <Group>
        <Avatar src={githubProfile.data?.avatarUri} radius="xl" />
        <Stack gap={5}>
          <Text size="sm" fw={700} style={{ lineHeight: 1 }}>
            {githubProfile.data?.fullname}
          </Text>
          <Anchor
            href={githubProfile.data?.url}
            c="dimmed"
            size="xs"
            style={{ lineHeight: 1 }}
          >
            @{githubProfile.data?.username}
          </Anchor>
        </Stack>
      </Group>

      <Text size="sm" mt="md">
        {githubProfile.data?.description}
      </Text>

      <Text size="xs" mt="md" c="dimmed" fs="italic">
        Since {githubProfile.data?.createdAt.format('DD/MM/YYYY')},
        from {githubProfile.data?.location}
      </Text>

      <Group mt="md" gap="xl">
        <Text size="sm">
          <b>{githubProfile.data?.followers ?? 0}</b> Following
        </Text>
        <Text size="sm">
          <b>{githubProfile.data?.following ?? 0}</b> Followers
        </Text>
      </Group>
    </React.Fragment>
  )
}