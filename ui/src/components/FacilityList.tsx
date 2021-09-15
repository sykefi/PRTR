import { Box, Flex, Input, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import { History } from 'history'
import * as api from '../api'
import { Facility } from '../api/models/Facility'
import { SolidLoadAnimation } from './LoadAnimation/LoadAnimation'

const FacilityBox = ({ f, history }: { f: Facility; history: History }) => {
  const { t } = useTranslation()

  return (
    <div>
      <Box
        bg="white"
        as="button"
        borderRadius="md"
        boxShadow="sm"
        padding={3}
        textAlign="left"
        margin={1.0}
        width="90%"
        maxWidth="650px"
        onClick={() => history.push('/facilities/' + f.facilityInspireId)}>
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
    </div>
  )
}

const useURLSearchParam = (name: string): string | null => {
  return new URLSearchParams(useLocation().search).get(name)
}

export const FacilityList = () => {
  const [loading, setLoading] = useState(false)
  const [facilities, setFacilities] = useState<Facility[] | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const history = useHistory()
  const urlSearchTerm = useURLSearchParam('searchTerm')
  const { t } = useTranslation()

  const setUrlSearchParam = () => {
    if (!!searchTerm) {
      history.push({
        pathname: '/facilities',
        search: '?searchTerm=' + searchTerm
      })
    }
  }

  useEffect(() => {
    console.log('searchTerm:', urlSearchTerm)
  }, [urlSearchTerm])

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
      <Flex margin={1.0} marginBottom={2.0} flexWrap="wrap">
        <Input
          bgColor="white"
          width={400}
          minWidth={300}
          margin={1.0}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={t('common.searchTerm')}
        />
        <Button margin={1.0} colorScheme="blue" onClick={setUrlSearchParam}>
          {t('common.search')}
        </Button>
      </Flex>
      {(loading && <SolidLoadAnimation sizePx={25} />) ||
        (facilities &&
          facilities.map(f => (
            <FacilityBox key={f.facilityInspireId} f={f} history={history} />
          )))}
    </div>
  )
}
