import { Box, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import * as api from '../api'
import { Facility } from '../api/models/Facility'
import { SolidLoadAnimation } from './LoadAnimation/LoadAnimation'

const FacilityBox = ({ f }: { f: Facility }) => {
  const { t } = useTranslation()

  return (
    <Link to={'/facilities/' + f.facilityInspireId}>
      <Box
        bg="white"
        as="button"
        borderRadius="md"
        boxShadow="sm"
        padding={3}
        textAlign="left"
        margin={1.0}
        width="90%"
        maxWidth="650px">
        <Box fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
          {f.nameOfFeature}
        </Box>
        <Flex>
          <Box fontSize="smaller" marginRight={2}>
            {t('common.facilityTypeCode')}: {f.mainActivityCode}
          </Box>
          <Box fontSize="smaller">
            {t('common.municipality')}: {f.city}
          </Box>
        </Flex>
      </Box>
    </Link>
  )
}

export const FacilityList = () => {
  const [loading, setLoading] = useState(false)
  const [facilities, setFacilities] = useState<Facility[] | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const getFacilities = async () => {
      try {
        const facilities = await api.getFacilities(controller)
        setFacilities(facilities)
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
        (facilities &&
          facilities.map(f => <FacilityBox key={f.facilityInspireId} f={f} />))}
    </div>
  )
}
