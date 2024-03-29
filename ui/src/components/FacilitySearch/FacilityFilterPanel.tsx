import { FormEvent, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@chakra-ui/button'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { useHistory } from 'react-router-dom'
import { Input } from '@chakra-ui/input'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { FacilityMainActivityCode } from '../../api/enums/FacilityMainActivityCode'
import { OptionType } from '../../models/OptionType'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { asOption } from '../../models/OptionType'
import { TranslationKeys } from '../../react-i18next'
import {
  FacilityTopMainActivity,
  isTopMainActivity
} from '../../api/enums/FacilityTopMainActivity'
import { usePlacenameOptions } from '../../hooks/usePlaceNameOptions'
import { DropdownSelectorAndLabel } from '../Common/DropdownSelectorAndLabel'
import { arrayEquals } from '../../utils'

const asMainActivityOption = (
  o: FacilityMainActivityCode | FacilityTopMainActivity,
  desc?: string
): OptionType<FacilityMainActivityCode | FacilityTopMainActivity> => {
  return {
    value: o,
    label: `${o}${isTopMainActivity(o) ? '.' : ':'} ${desc || ''}`,
    bold: isTopMainActivity(o),
    indent: !isTopMainActivity(o)
  }
}

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
        return prev.concat(asMainActivityOption(curr, desc))
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
  searchHasBeenMade,
  urlSearchTerm,
  urlPlacename,
  urlFacilityMainActivity
}: {
  searchHasBeenMade: boolean
  urlSearchTerm: string | undefined
  urlPlacename: string[] | undefined
  urlFacilityMainActivity:
    | (FacilityMainActivityCode | FacilityTopMainActivity)[]
    | undefined
}) => {
  const { t } = useTranslation(['translation', 'mainActivityCodeDesc'])
  const history = useHistory()

  const [searchTerm, setSearchTerm] = useState<string | undefined>(
    urlSearchTerm
  )
  const [placename, setPlacename] = useState<string[] | undefined>(urlPlacename)
  const [facilityMainActivity, setFacilityMainActivity] = useState<
    (FacilityMainActivityCode | FacilityTopMainActivity)[] | undefined
  >(urlFacilityMainActivity)

  const facilityMainActivityOptions = useMemo(
    () => getFacilityMainActivityOptions(t),
    [t]
  )
  const {
    placenameOptionsIsLoading,
    placenameOptionsIsError,
    placenameOptions
  } = usePlacenameOptions()

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
      for (const fac of facilityMainActivity) {
        newUrlSearchParams.append(URLSearchParamName.FacilityMainActivity, fac)
      }
    }
    if (placename) {
      for (const p of placename) {
        newUrlSearchParams.append(URLSearchParamName.Placename, p)
      }
    }
    newUrlSearchParams.set(URLSearchParamName.FirstItemIdx, '0')
    history.push({
      pathname: '/facilities',
      search: '?' + newUrlSearchParams.toString()
    })
  }

  const allowSearch =
    !searchHasBeenMade ||
    urlSearchTerm !== searchTerm ||
    !arrayEquals(urlPlacename, placename) ||
    !arrayEquals(urlFacilityMainActivity, facilityMainActivity)

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
          <DropdownSelectorAndLabel<
            FacilityMainActivityCode | FacilityTopMainActivity
          >
            width={450}
            minWidth={200}
            name="facilityMainActivity"
            label={t('translation:facilities.selectFacilityMainActivityCode')}
            placeholder={t(
              'translation:facilities.selectFacilityMainActivityCode'
            )}
            options={facilityMainActivityOptions}
            value={
              facilityMainActivity
                ? asOption(
                    facilityMainActivity,
                    facilityMainActivity.map(elem =>
                      t(`mainActivityCodeDesc:${elem}`)
                    )
                  )
                : null
            }
            handleChange={setFacilityMainActivity}
          />
          <DropdownSelectorAndLabel<string>
            width={350}
            minWidth={200}
            name="facilitiesPlacename"
            label={t('translation:facilities.searchWithPlacename')}
            placeholder={t('translation:facilities.searchWithPlacename')}
            isLoading={placenameOptionsIsLoading || placenameOptionsIsError}
            options={placenameOptions}
            value={asOption(placename, placename)}
            handleChange={setPlacename}
          />
          <Box minWidth={200}>
            <FormLabel>{t('translation:facilities.searchWithName')} </FormLabel>
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
          </Box>
        </Flex>
        <Button
          data-cy="search-facilities-btn"
          type="submit"
          disabled={!allowSearch}
          width="max-content"
          marginBottom={0.5}
          colorScheme="green">
          {t('translation:common.fetch')}
        </Button>
      </FormControl>
    </Form>
  )
}
