import { FormEvent, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { useHistory } from 'react-router-dom'
import { Input } from '@chakra-ui/input'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { FacilityMainActivityCode } from '../../api/models/FacilityMainActivityCode'
import { ChakraSelect } from '../ChakraReactSelect'
import { OptionType } from '../../models/OptionType'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { asOption } from '../../models/OptionType'
import { TranslationKeys } from '../../react-i18next'
import {
  FacilityTopMainActivity,
  isTopMainActivity
} from '../../api/models/FacilityTopMainActivity'
import { usePlacenameOptions } from '../../hooks/usePlaceNameOptions'

const getFacilityMainActivityOptions = (
  t: (translationKey: TranslationKeys) => string | undefined
): OptionType<FacilityMainActivityCode | FacilityTopMainActivity>[] => {
  return [
    ...Object.values(FacilityTopMainActivity),
    ...Object.values(FacilityMainActivityCode)
  ]
    .reduce((prev, curr) => {
      const desc = t(`mainActivityCodeDesc:${curr}`)
      if (desc) {
        return prev.concat({
          value: curr,
          label: `${curr}${isTopMainActivity(curr) ? '.' : ':'} ${desc}`,
          bold: isTopMainActivity(curr),
          indent: !isTopMainActivity(curr)
        })
      }
      return prev
    }, [] as OptionType<FacilityMainActivityCode | FacilityTopMainActivity>[])
    .sort((a, b) => {
      if (a.value < b.value) {
        return -1
      }
      if (a.value > b.value) {
        return 1
      }
      return 0
    })
}

const Form = styled.form`
  max-width: 100%;
`

export const FacilityFilterPanel = ({
  urlSearchTerm,
  urlPlacename,
  urlFacilityMainActivity
}: {
  urlSearchTerm: string | undefined
  urlPlacename: string | undefined
  urlFacilityMainActivity:
    | FacilityMainActivityCode
    | FacilityTopMainActivity
    | undefined
}) => {
  const { t } = useTranslation(['translation', 'mainActivityCodeDesc'])
  const history = useHistory()

  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const [placename, setPlacename] = useState<string | undefined>(undefined)
  const [facilityMainActivity, setFacilityMainActivity] = useState<
    FacilityMainActivityCode | FacilityTopMainActivity | undefined
  >(undefined)

  const facilityMainActivityOptions = useMemo(
    () => getFacilityMainActivityOptions(t),
    [t]
  )
  const {
    placenameOptionsIsLoading,
    placenameOptionsIsError,
    placenameOptions
  } = usePlacenameOptions()

  useEffect(() => {
    // initialize inputs from URL search params
    setFacilityMainActivity(urlFacilityMainActivity)
    setSearchTerm(urlSearchTerm)
    setPlacename(urlPlacename)
  }, [urlFacilityMainActivity, urlSearchTerm, urlPlacename])

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
    if (facilityMainActivity) {
      newUrlSearchParams.set(
        URLSearchParamName.FacilityMainActivity,
        facilityMainActivity
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
    urlFacilityMainActivity !== facilityMainActivity

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
                facilityMainActivity
                  ? asOption(
                      facilityMainActivity,
                      t(`mainActivityCodeDesc:${facilityMainActivity}`)
                    )
                  : null
              }
              name="facilityMainActivity"
              options={facilityMainActivityOptions}
              placeholder={t(
                'translation:facilities.selectFacilityMainActivityCode'
              )}
              onChange={e => setFacilityMainActivity(e?.value)}
            />
          </Box>
          <Box width={350} minWidth={200}>
            <ChakraSelect
              isClearable
              closeMenuOnSelect
              isLoading={placenameOptionsIsLoading || placenameOptionsIsError}
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
