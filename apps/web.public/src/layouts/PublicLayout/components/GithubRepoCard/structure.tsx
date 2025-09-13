import { Anchor, Group, Stack, Text, Skeleton, Chip } from '@mantine/core'
import { getRepoUrl, useGithubRepoQuery } from './useGithubRepoQuery.hook'
import { IconCircle } from '@tabler/icons-react'
import * as React from 'react'


export const GithubRepoCard: React.FC<{
  repo: string,
}> = props => {
  const githubRepo = useGithubRepoQuery(props.repo)
  const repoUrl = getRepoUrl(props.repo)

  if (githubRepo.isLoadingError) return (
    <Group>
      <Text size="xs" style={{ fontFamily: 'monospace' }}>
        Failed to load repo information from Github API: <br/>
        <Anchor href={repoUrl} target="_blank">{repoUrl}</Anchor>
      </Text>
    </Group>
  )

  if (githubRepo.isLoading) return (
    <React.Fragment>
      <Stack gap={8}>
        <Skeleton height={8} width={90} radius="xl" />
        <Skeleton height={6} width={50} radius="xl" />
      </Stack>

      <Stack gap={10} mt="md">
        <Skeleton height={8} width="100%" radius="xl" />
        <Skeleton height={8} width="90%" radius="xl" />
        <Skeleton height={8} width="70%" radius="xl" />
      </Stack>

      <Group mt="md" mb="xs" gap="xs">
        <Skeleton height={14} width={50} radius="xl" />
        <Skeleton height={14} width={70} radius="xl" />
        <Skeleton height={14} width={90} radius="xl" />
        <Skeleton height={14} width={60} radius="xl" />
        <Skeleton height={14} width={120} radius="xl" />
      </Group>

      <Stack gap={10} mt="md">
        <Skeleton height={8} width={120} radius="xl" />
        <Skeleton height={8} width={120} radius="xl" />
      </Stack>
    </React.Fragment>
  )

  return (
    <React.Fragment>
      <Group>
        <Stack gap={5}>
          <Text size="sm" fw={700} style={{ lineHeight: 1 }}>
            {githubRepo.data?.name}
          </Text>
          <Text
            c="dimmed"
            size="xs"
            style={{ lineHeight: 1 }}>
            @{githubRepo.data?.owner}
          </Text>
        </Stack>
      </Group>

      <Text size="sm" mt="md">
        {githubRepo.data?.description}
      </Text>

      <Group mt="md" gap="xs">
        {githubRepo.data?.topics.map((topic, index) => (
          <Chip checked readOnly icon={<IconCircle size={12} />} key={index} variant="light" size="xs">{topic}</Chip>
        ))}
      </Group>

      <Text size="xs" mt="md" c="dimmed" fs="italic">
        Created {githubRepo.data?.createdAt.format('DD/MM/YYYY')} <br />
        Last update {githubRepo.data?.updatedAt.format('DD/MM/YYYY')}
      </Text>
    </React.Fragment>
  )
}
