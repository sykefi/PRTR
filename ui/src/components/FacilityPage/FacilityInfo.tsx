import { Button } from '@chakra-ui/button'
import { Box, Flex } from '@chakra-ui/layout'
import { useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { getFacility } from '../../api'
import { Facility } from '../../api/models/Facility'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'
import { OlMap } from '../OlMap'

type FacilityParams = {
  facilityId: string
}

const InfoPropRow = ({
  label,
  value
}: {
  label: string
  value: string | undefined
}) => {
  return (
    <Box fontSize="smaller" marginY={2}>
      <Box fontWeight="semibold">{label}</Box>
      <Box marginTop={0.5} color="blackAlpha.800">
        {value || '-'}
      </Box>
    </Box>
  )
}

export const FacilityInfo = () => {
  const [infoState, setInfoState] = useState<
    'initial' | 'loading' | 'error' | 'done'
  >('initial')
  const { t } = useTranslation(['translation', 'mainActivityCodeDesc'])
  const history = useHistory()
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

  if (infoState === 'error') {
    return (
      <Box margin={1.0} marginY={2.0} fontWeight="bold">
        <Box>{t('translation:facilities.couldNotFindFacilityWithId')}</Box>
        <Box>
          <Button
            marginY={2.0}
            size="sm"
            colorScheme="blue"
            onClick={() => history.push('/')}>
            {t('translation:common.goBack')}
          </Button>
        </Box>
      </Box>
    )
  }

  if (!facility) return null

  return (
    <Flex wrap="wrap" justify="center" maxWidth="100%">
      <Box
        data-cy="facility-info-container"
        listStyleType="none"
        boxSizing="border-box"
        width={300}
        minWidth={250}
        maxWidth="100%"
        marginTop={1}
        marginBottom={2}
        padding={4}
        height="max-content"
        maxHeight={600}
        overflowY="auto"
        background="white"
        borderRadius="md"
        boxShadow="sm">
        <Box as="h2" fontWeight="semibold" marginBottom={3}>
          {facility.nameOfFeature}
        </Box>
        <InfoPropRow
          label={t('translation:facilities.facilityTypeCode')}
          value={
            facility.mainActivityCode +
            (t(`mainActivityCodeDesc:${facility.mainActivityCode}`)
              ? ' - ' + t(`mainActivityCodeDesc:${facility.mainActivityCode}`)
              : '')
          }
        />
        <InfoPropRow
          label={t('translation:common.municipality')}
          value={facility.city}
        />
        <InfoPropRow
          label={t('translation:common.streetAddress')}
          value={`${facility.streetName} ${facility.buildingNumber || ''}`}
        />
        <InfoPropRow
          label={t('translation:common.telephoneNumber')}
          value={facility.telephoneNo || ''}
        />
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
