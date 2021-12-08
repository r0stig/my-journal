import {useEffect, useRef} from 'react'

/**
 * This hook only runs `onUnmount` once when component unmouts and it keeps dependencies up to date.
 * @param onUnmount only runs once the component unmouts
 * @param deps array of updated dependencies
 */
export function useUnmountOnceWithDeps(
  onUnmount: () => void,
  deps: React.DependencyList = []
) {
  const unmount = useRef(false)

  useEffect(() => {
    return () => {
      unmount.current = true
    }
  }, [])

  useEffect(() => {
    return () => {
      if (unmount.current) {
        onUnmount()
      }
    }
  }, deps)
}
