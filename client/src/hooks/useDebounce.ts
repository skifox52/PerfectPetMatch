import { useEffect, useState } from "react"

export const useDebounce = (value: string, delay: number): string => {
  const [debounceValue, setDebounceValue] = useState<string>(value)

  useEffect(() => {
    const timeoutValue = setTimeout(() => {
      setDebounceValue(value)
    }, delay)

    return () => {
      clearTimeout(timeoutValue)
    }
  }, [value, delay])

  return debounceValue
}
