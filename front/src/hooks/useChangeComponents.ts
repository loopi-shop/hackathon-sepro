import { useEffect, useRef } from 'react'

type OnChangeFunction = (detail: any) => void

export function useChangeComponents(onChange?: OnChangeFunction) {
  const ref = useRef<HTMLInputElement | HTMLSelectElement>(null)

  useEffect(() => {
    const element = ref.current
    if (element) {
      const handleInput = (e: any) => {
        if (onChange) {
          const { detail } = e
          if (detail && detail !== undefined) {
            onChange(detail[0])
          } else {
            onChange(e.target.value)
          }
        }
      }

      element.addEventListener('input', handleInput)
      element.addEventListener('blur', handleInput)

      return () => {
        element.removeEventListener('input', handleInput)
        element.removeEventListener('blur', handleInput)
      }
    }
  }, [ref, onChange])

  return ref
}
