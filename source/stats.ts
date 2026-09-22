import {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from 'node:fs'

const entriesDir = 'source/content/projects'
const statsPath = 'source/stats.json'

const stats: Record<string, number> = existsSync(statsPath)
  ? JSON.parse(readFileSync(statsPath, 'utf8'))
  : {}

for (const name of readdirSync(entriesDir)) {
  if (!name.endsWith('.md')) continue
  const source = readFileSync(`${entriesDir}/${name}`, 'utf8')
  const repo = /^repo: (.+)$/m.exec(source)?.[1]
  const pkg = /^npm: (.+)$/m.exec(source)?.[1]

  try {
    if (repo) {
      const response = await fetch(
        `https://api.github.com/repos/${repo}`,
      )
      if (response.ok)
        stats[`github:${repo}`] = (
          await response.json()
        ).stargazers_count
      else console.warn(`could not fetch stars for ${repo}`)
    }
    if (pkg) {
      const response = await fetch(
        `https://api.npmjs.org/downloads/point/last-month/${pkg}`,
      )
      if (response.ok)
        stats[`npm:${pkg}`] = (await response.json()).downloads
      else console.warn(`could not fetch downloads for ${pkg}`)
    }
  } catch (error) {
    console.warn(`could not fetch stats for ${name}: ${error}`)
  }
}

writeFileSync(statsPath, JSON.stringify(stats, null, 2) + '\n')
console.log(`fetched stats for ${Object.keys(stats).length} sources`)
