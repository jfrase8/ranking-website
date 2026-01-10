export const formatTimestamp = (timestamp: number | string) => {
  const date = new Date(timestamp)

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true, // <-- 12-hour format with AM/PM
  }

  return date.toLocaleString('en-US', options)
}
