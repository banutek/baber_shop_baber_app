/**
 * Truncates a string at the nth occurrence of a comma.
 * Returns the whole string if there are fewer than n commas.
 */
export const truncateAtNthComma = (str: string, n: number): string => {
  if (!str) return ''
  let count = 0
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ',') {
      count++
      if (count === n) {
        return str.slice(0, i)
      }
    }
  }
  return str
}
