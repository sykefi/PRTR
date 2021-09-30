import { FormEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { useHistory } from 'react-router'
import { Input } from '@chakra-ui/input'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { FacilityMainActivityCode } from '../../api/models/FacilityMainActivityCode'
import { ChakraSelect } from '../ChakraReactSelect'
import { OptionType } from '../../models/OptionType'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { asOption } from '../../utils'

const useFacilityMainActivityOptions =
  (): OptionType<FacilityMainActivityCode>[] => {
    const { t } = useTranslation('mainActivityCodeDesc')

    return Object.values(FacilityMainActivityCode)
      .reduce((prev, curr) => {
        if (t(curr)) {
          return prev.concat({
            value: curr,
            label: `${curr} - ${t(curr)}`
          })
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

const Form = styled.form`
  max-width: 100%;
`

export const FacilityFilterPanel = ({
  urlSearchTerm,
  urlFacilityMainActivityCode
}: {
  urlSearchTerm: string | undefined
  urlFacilityMainActivityCode: FacilityMainActivityCode | undefined
}) => {
  const { t } = useTranslation(['translation', 'mainActivityCodeDesc'])
  const history = useHistory()

  const facilityMainActivityCodeOptions = useFacilityMainActivityOptions()

  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const [facilityMainActivityCode, setFacilityMainActivityCode] = useState<
    FacilityMainActivityCode | undefined
  >(undefined)

  useEffect(() => {
    // initialize inputs from URL search params
    setFacilityMainActivityCode(urlFacilityMainActivityCode)
    setSearchTerm(urlSearchTerm)
  }, [urlFacilityMainActivityCode, urlSearchTerm])

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
    history.push({
      pathname: '/facilities',
      search: '?' + newUrlSearchParams.toString()
    })
  }

  const searchInputsChanged =
    urlSearchTerm !== searchTerm ||
    urlFacilityMainActivityCode !== facilityMainActivityCode

  return (
    <Form onSubmit={handleSubmit} data-cy="facility-search-panel">
      <Flex display="flex" flexWrap="wrap" justify="center">
        <FormControl
          marginTop={1.0}
          marginBottom={2.0}
          width={550}
          minWidth={250}>
          <Box marginY={1.0}>
            <ChakraSelect
              isClearable
              closeMenuOnSelect
              value={asOption(facilityMainActivityCode, v =>
                t(`mainActivityCodeDesc:${v}`)
              )}
              name="facilityMainActivityCode"
              options={facilityMainActivityCodeOptions}
              placeholder={t(
                'translation:facilities.selectFacilityMainActivityCode'
              )}
              onChange={e => setFacilityMainActivityCode(e?.value)}
            />
          </Box>
          <Input
            data-cy="facility-search-term"
            type="text"
            bgColor="white"
            minWidth={200}
            colorScheme="red"
            borderColor="var(--chakra-colors-gray-500)"
            _hover={{
              borderColor: 'var(--chakra-colors-gray-500)'
            }}
            maxWidth="100%"
            marginY={1.0}
            value={searchTerm || ''}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('translation:common.searchTerm')}
          />
          <Button
            data-cy="search-facilities-btn"
            type="submit"
            disabled={!searchInputsChanged}
            marginY={1.0}
            marginLeft={1.0}
            colorScheme="green">
            {t('translation:common.fetch')}
          </Button>
        </FormControl>
      </Flex>
    </Form>
  )
}
