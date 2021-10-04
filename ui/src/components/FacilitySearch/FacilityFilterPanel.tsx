import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { useHistory } from 'react-router-dom'
import { Input } from '@chakra-ui/input'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import * as api from '../../api'
import * as env from '../../env'
import { FacilityMainActivityCode } from '../../api/models/FacilityMainActivityCode'
import { ChakraSelect } from '../ChakraReactSelect'
import { OptionType } from '../../models/OptionType'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { asOption } from '../../models/OptionType'
import { PRTRApiMetadata } from '../../api/models/PRTRApiMetadata'
import { TranslationKeys } from '../../react-i18next'

const getFacilityMainActivityOptions = (
  t: (translationKey: TranslationKeys) => string | undefined
): OptionType<FacilityMainActivityCode>[] => {
  return Object.values(FacilityMainActivityCode)
    .reduce((prev, curr) => {
      const desc = t(`mainActivityCodeDesc:${curr}`)
      const option = desc
        ? { value: curr, label: `${curr}, ${desc}` }
        : undefined
      if (option) {
        return prev.concat(option)
      }
      return prev
    }, [] as OptionType<FacilityMainActivityCode>[])
    .sort((a, b) => {
      if (a.label < b.label) {
        return -1
      }
      if (a.label > b.label) {
        return 1
      }
      return 0
    })
}

const getPlacenameOptions = (
  metadata: PRTRApiMetadata | undefined
): OptionType<string>[] => {
  return metadata
    ? metadata.present_cities
        .map(c => asOption(c, c))
        .filter((o): o is OptionType<string> => Boolean(o))
    : []
}

const Form = styled.form`
  max-width: 100%;
`

export const FacilityFilterPanel = ({
  urlSearchTerm,
  urlPlacename,
  urlFacilityMainActivityCode
}: {
  urlSearchTerm: string | undefined
  urlPlacename: string | undefined
  urlFacilityMainActivityCode: FacilityMainActivityCode | undefined
}) => {
  const { t } = useTranslation(['translation', 'mainActivityCodeDesc'])
  const history = useHistory()

  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const [placename, setPlacename] = useState<string | undefined>(undefined)
  const [facilityMainActivityCode, setFacilityMainActivityCode] = useState<
    FacilityMainActivityCode | undefined
  >(undefined)

  const facilityMainActivityCodeOptions = useMemo(
    () => getFacilityMainActivityOptions(t),
    [t]
  )
  const apiMetadata = useQuery(
    ['prtrApiMetadata'],
    () => api.getApiMetadata(),
    env.rqCacheSettings
  )
  const placenameOptions = useMemo(
    () => getPlacenameOptions(apiMetadata.data),
    [apiMetadata.data]
  )

  useEffect(() => {
    // initialize inputs from URL search params
    setFacilityMainActivityCode(urlFacilityMainActivityCode)
    setSearchTerm(urlSearchTerm)
    setPlacename(urlPlacename)
  }, [urlFacilityMainActivityCode, urlSearchTerm, urlPlacename])

  /**
   * Resets current URL search parameters (including active row ranges)
   * and sets new ones (if some of them changed). This will trigger
   * the facility list update.
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault() // prevent reload on submit
    const newUrlSearchParams = new URLSearchParams()
    if (searchTerm)
      newUrlSearchParams.set(URLSearchParamName.SearchTerm, searchTerm)
    if (facilityMainActivityCode) {
      newUrlSearchParams.set(
        URLSearchParamName.FacilityMainActivityCode,
        facilityMainActivityCode
      )
    }
    if (placename) {
      newUrlSearchParams.set(URLSearchParamName.Placename, placename)
    }
    history.push({
      pathname: '/facilities',
      search: '?' + newUrlSearchParams.toString()
    })
  }

  const searchInputsChanged =
    urlSearchTerm !== searchTerm ||
    urlPlacename !== placename ||
    urlFacilityMainActivityCode !== facilityMainActivityCode

  return (
    <Form onSubmit={handleSubmit} data-cy="facility-search-panel">
      <FormControl
        display="flex"
        flexWrap="wrap"
        flexDirection="column"
        justify="center"
        sx={{ gap: 'var(--chakra-space-3)' }} //flex gap
        marginTop={1.0}
        marginBottom={2.0}
        width="100%">
        <Flex wrap="wrap" width="100%" sx={{ gap: 'var(--chakra-space-3)' }}>
          <Box width={450} minWidth={200}>
            <ChakraSelect
              isClearable
              closeMenuOnSelect
              value={
                facilityMainActivityCode
                  ? asOption(
                      facilityMainActivityCode,
                      t(`mainActivityCodeDesc:${facilityMainActivityCode}`)
                    )
                  : null
              }
              name="facilityMainActivityCode"
              options={facilityMainActivityCodeOptions}
              placeholder={t(
                'translation:facilities.selectFacilityMainActivityCode'
              )}
              onChange={e => setFacilityMainActivityCode(e?.value)}
            />
          </Box>
          <Box width={350} minWidth={200}>
            <ChakraSelect
              isClearable
              closeMenuOnSelect
              isLoading={apiMetadata.isLoading || apiMetadata.isError}
              name="facilitiesPlacename"
              value={asOption(placename, placename)}
              options={placenameOptions}
              placeholder={t('translation:facilities.searchWithPlacename')}
              onChange={e => setPlacename(e?.value)}
            />
          </Box>
          <Input
            data-cy="facility-search-term"
            type="text"
            bgColor="white"
            minWidth={200}
            width={350}
            colorScheme="red"
            borderColor="var(--chakra-colors-gray-500)"
            _hover={{
              borderColor: 'var(--chakra-colors-gray-500)'
            }}
            maxWidth="100%"
            value={searchTerm || ''}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('translation:facilities.searchWithName')}
          />
        </Flex>
        <Button
          data-cy="search-facilities-btn"
          type="submit"
          disabled={!searchInputsChanged}
          width="max-content"
          marginBottom={0.5}
          colorScheme="green">
          {t('translation:common.fetch')}
        </Button>
      </FormControl>
    </Form>
  )
}
