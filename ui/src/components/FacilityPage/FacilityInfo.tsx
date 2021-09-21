import { Box, Flex } from '@chakra-ui/layout'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFacility } from '../../api'
import { Facility } from '../../api/models/Facility'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'
import { OlMap } from '../OlMap'

type FacilityParams = {
  facilityId: string
}

export const FacilityInfo = () => {
  const [infoState, setInfoState] = useState<
    'initial' | 'loading' | 'error' | 'done'
  >('initial')
  const [facility, setFacility] = useState<Facility | null>(null)
  const { facilityId } = useParams<FacilityParams>()

  useEffect(() => {
    console.log('fetching facility info for', facilityId)
    const controller = new AbortController()

    const getFacilityData = async () => {
      setInfoState('loading')
      try {
        const data = await getFacility(controller, facilityId)
        setFacility(data)
        setInfoState('done')
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error(e)
          setInfoState('error')
        }
      }
    }

    getFacilityData()

    return () => {
      controller.abort()
    }
  }, [facilityId])

  if (infoState === 'loading') {
    return (
      <Box p={4} data-cy="facility-info-load-animation">
        <LoadAnimation sizePx={30} />
      </Box>
    )
  }

  return (
    <Flex wrap="wrap" justify="center" maxWidth="100%">
      <Box
        data-cy="facility-info-container"
        listStyleType="none"
        boxSizing="border-box"
        height="calc(100vh - 310px)"
        minHeight={600}
        maxHeight={800}
        maxWidth="100%"
        marginTop={1}
        marginBottom={2}
        overflowY={{ base: 'unset', md: 'auto' }}>
        {facility?.nameOfFeature}
      </Box>
      <Box px={{ base: 'unset', md: 2 }} maxWidth="100%">
        <OlMap
          facilities={facility ? [facility] : undefined}
          zoomToInitialExtent={false}
        />
      </Box>
    </Flex>
  )
}
