import { Box, Flex, Input, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import { History } from 'history'
import * as api from '../api'
import { Facility } from '../api/models/Facility'
import { SolidLoadAnimation } from './LoadAnimation/LoadAnimation'
import { FacilityQueryParams } from '../api/models/FacilityQueryParams'

const FacilityBox = ({ f, history }: { f: Facility; history: History }) => {
  const { t } = useTranslation()

  return (
    <Box
      bg="white"
      as="button"
      borderRadius="md"
      boxShadow="sm"
      padding={3}
      textAlign="left"
      marginY={1.0}
      width="100%"
      maxWidth="500px"
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
  )
}

const useURLSearchParam = (name: string): string | null => {
  return new URLSearchParams(useLocation().search).get(name)
}

const getQueryParams = (
  urlSearchTerm: string | null
): FacilityQueryParams | undefined => {
  return urlSearchTerm
    ? {
        name_search_str: urlSearchTerm
      }
    : undefined
}

export const FacilityList = () => {
  const [state, setState] = useState<'initial' | 'loading' | 'error' | 'done'>(
    'initial'
  )
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
    console.log('update facility list, params:', urlSearchTerm)
    const controller = new AbortController()
    const queryParams = getQueryParams(urlSearchTerm)
    const getFacilities = async () => {
      try {
        const facilities = await api.getFacilities(controller, queryParams)
        setFacilities(facilities)
        setState('done')
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error(e)
          setState('error')
        }
      }
    }
    setState('loading')
    getFacilities()

    return () => {
      controller.abort()
    }
  }, [urlSearchTerm])

  switch (state) {
    case 'initial':
    case 'loading':
      return <SolidLoadAnimation sizePx={25} />

    case 'error':
      return (
        <Box margin={1.0} marginY={2.0} fontWeight="bold">
          <Box>
            {t('facilities.loadFacilitiesErroredText', {
              searchTerm: urlSearchTerm,
              resultCount: facilities ? facilities.length : 0
            })}
          </Box>
          <Box>
            <Button
              marginY={2.0}
              size="sm"
              colorScheme="blue"
              onClick={() => history.push('/')}>
              {t('common.goBack')}
            </Button>
          </Box>
        </Box>
      )

    case 'done':
      return (
        <>
          {(!urlSearchTerm && ( // show search input(s) & button
            <form onSubmit={setUrlSearchParam}>
              <Flex marginTop={1.0} marginBottom={2.0} flexWrap="wrap">
                <Input
                  type="text"
                  bgColor="white"
                  width={434}
                  minWidth={300}
                  marginY={1.0}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder={t('common.searchTerm')}
                />
                <Button
                  type="submit"
                  marginY={1.0}
                  marginLeft={1.0}
                  colorScheme="blue">
                  {t('common.search')}
                </Button>
              </Flex>
            </form>
          )) || ( // or show search result info & reset search button
            <Box margin={1.0} marginBottom={2.0} fontWeight="bold">
              <Box>
                {t('common.facilitySearchResult', {
                  searchTerm: urlSearchTerm,
                  resultCount: facilities ? facilities.length : 0
                })}
              </Box>
              <Box>
                <Button
                  marginY={2.0}
                  size="sm"
                  colorScheme="blue"
                  onClick={() => history.push('/facilities')}>
                  {t('common.resetSearch')}
                </Button>
              </Box>
            </Box>
          )}

          {facilities && (
            <Box as="ul" boxSizing="border-box">
              {facilities.map(f => (
                <FacilityBox
                  key={f.facilityInspireId}
                  f={f}
                  history={history}
                />
              ))}
            </Box>
          )}
        </>
      )

    default:
      return null
  }
}
