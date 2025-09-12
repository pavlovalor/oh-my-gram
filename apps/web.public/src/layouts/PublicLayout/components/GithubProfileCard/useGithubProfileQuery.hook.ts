import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'


interface IGithubProfile {
  login: string,
  id: number,
  node_id: string,
  avatar_url: string,
  gravatar_id: string,
  url: string,
  html_url: string,
  followers_url: string,
  following_url: string,
  gists_url: string,
  starred_url: string,
  subscriptions_url: string,
  organizations_url: string,
  repos_url: string,
  events_url: string,
  received_events_url: string,
  type: 'User',
  user_view_type: 'public' | 'private',
  site_admin: boolean,
  name: string,
  company: string,
  blog: string,
  location: string,
  email?: string,
  hireable: true,
  bio: string,
  twitter_username?: string,
  public_repos: number,
  public_gists: number,
  followers: number,
  following: number,
  created_at: string,
  updated_at: string,
}


export const getProfileUrl = (username: string) => `https://api.github.com/users/${username}`


export const useGithubProfileQuery = (username: string) => useQuery({
  queryKey: ['github.profile', username],
  async queryFn() {
    const path = getProfileUrl(username)
    const response = await fetch(path)
    const json: IGithubProfile = await response.json()

    return {
      description: json.bio,
      followers: json.followers,
      following: json.following,
      avatarUri: json.avatar_url,
      username: json.login,
      fullname: json.name,
      location: json.location,
      url: json.html_url,
      createdAt: dayjs(json.created_at),
    }
  }
})
