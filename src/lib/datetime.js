export function formatUTC(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return (
    d
      .toLocaleString('en-GB', {
        timeZone: 'UTC',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(',', ' ·') + 'Z'
  )
}