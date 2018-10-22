export interface Commit {
  sha: string
  url: string
}

export interface GitTag {
  name: string
  zipball_url: string
  tarball_url: string
  node_id: string
  commit: Commit
}
