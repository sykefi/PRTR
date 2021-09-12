import { useEffect, useState } from 'react'
import * as api from '../services'
import { SolidLoadAnimation } from './LoadAnimation/LoadAnimation'

export const Facilities = () => {
  const [loading, setLoading] = useState(false)
  const [facilities, setFacilities] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const getFacilities = async () => {
      try {
        const facilities = await api.getFacilities(controller)
        setFacilities(facilities.slice(0, 2))
        setLoading(false)
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error(e)
        }
      }
    }
    setLoading(true)
    getFacilities()

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <div>
      {(loading && <SolidLoadAnimation sizePx={25} />) ||
        (facilities && JSON.stringify(facilities))}
    </div>
  )
}
