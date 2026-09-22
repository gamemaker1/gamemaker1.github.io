export const author = 'Vedant Kulkarni'

export const categories = [
  'AI and Machine Learning',
  'Libraries and Web Infrastructure',
  'Developer Tools and Systems',
  'Digital Public Goods',
  'Applications',
  'Hackathons and Other Events',
]

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function starsText(count: number): string {
  if (count < 1000) return `${count} stars`
  if (count < 100000)
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k stars`
  return `${Math.round(count / 1000)}k stars`
}

export function downloadsText(count: number): string {
  let value: number
  let unit: string
  if (count >= 1e6) [value, unit] = [count / 1e6, 'M']
  else if (count >= 1e3) [value, unit] = [count / 1e3, 'k']
  else return `${count} dl/month`
  if (value >= 100) value = Math.round(value / 10) * 10
  else if (value >= 10) value = Math.round(value)
  else value = Math.round(value * 10) / 10
  return `${value}${unit} dl/month`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
