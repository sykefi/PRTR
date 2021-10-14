import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Box, Flex } from '@chakra-ui/layout'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { PollutantCode } from '../../api/enums/PollutantCode'
import { OptionType } from '../../models/OptionType'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { ChakraSelect } from '../ChakraReactSelect'
import { Medium } from '../../api/enums/Medium'
import { getLongPollutantLabel, getPollutantLabel } from '../../utils'
import { asOption } from '../../models/OptionType'
import { TranslationKeys } from '../../react-i18next'
import { usePlacenameOptions } from '../../hooks/usePlaceNameOptions'
import { useYearOptions } from '../../hooks/useYearOptions'

const getPollutantNameOptions = (
  t: (translationKey: TranslationKeys) => string | undefined
): OptionType<PollutantCode>[] => {
  return Object.values(PollutantCode)
    .reduce((prev, curr) => {
      const label = getLongPollutantLabel(t, curr)
      if (!!label) {
        return prev.concat({
          value: curr,
          label
        })
      } else return prev
    }, [] as OptionType<PollutantCode>[])
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

export const ReleaseFilterPanel = (props: {
  medium: Medium
  urlPollutantCode: PollutantCode | undefined
  urlYear: number | undefined
  urlPlacename: string | undefined
}) => {
  const { t } = useTranslation([
    'translation',
    'pollutantName',
    'pollutantCasNumber',
    'pollutantAbbreviation'
  ])
  const history = useHistory()
  const location = useLocation()

  const [pollutantCode, setPollutantCode] = useState<PollutantCode | undefined>(
    undefined
  )
  const [year, setYear] = useState<number | undefined>(undefined)
  const [placename, setPlacename] = useState<string | undefined>(undefined)

  const pollutantOptions = useMemo(() => getPollutantNameOptions(t), [t])
  const { yearOptionsIsLoading, yearOptionsIsError, yearOptions } =
    useYearOptions()
  const {
    placenameOptionsIsLoading,
    placenameOptionsIsError,
    placenameOptions
  } = usePlacenameOptions()

  useEffect(() => {
    // initialize select inputs from url search params on page load
    setPollutantCode(props.urlPollutantCode)
    setYear(props.urlYear)
  }, [props.medium, props.urlPollutantCode, props.urlYear])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault() // prevent reload on submit
    const newUrlSearchParams = new URLSearchParams()
    if (pollutantCode) {
      newUrlSearchParams.set(URLSearchParamName.PollutantCode, pollutantCode)
    }
    if (year) {
      newUrlSearchParams.set(URLSearchParamName.Year, year.toString())
    }
    if (placename) {
      newUrlSearchParams.set(URLSearchParamName.Placename, placename.toString())
    }
    newUrlSearchParams.set(URLSearchParamName.FirstItemIdx, '0')
    history.push({
      pathname: location.pathname,
      search: '?' + newUrlSearchParams.toString()
    })
  }

  const searchInputsChanged =
    (!props.urlYear && !props.urlPollutantCode && !props.urlPlacename) ||
    props.urlYear !== year ||
    props.urlPollutantCode !== pollutantCode ||
    props.urlPlacename !== placename

  return (
    <Form onSubmit={handleSubmit} data-cy="releases-filter-panel">
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
          <Box width={350} minWidth={200}>
            <ChakraSelect
              isClearable
              closeMenuOnSelect
              name="releasesPollutantCode"
              value={
                pollutantCode
                  ? asOption(pollutantCode, getPollutantLabel(t, pollutantCode))
                  : null
              }
              options={pollutantOptions}
              placeholder={t('translation:releases.selectPollutant')}
              onChange={e => setPollutantCode(e?.value)}
            />
          </Box>
          <Box width={250} minWidth={200}>
            <ChakraSelect
              isClearable
              closeMenuOnSelect
              isLoading={yearOptionsIsLoading || yearOptionsIsError}
              name="releasesYear"
              value={asOption(year, year)}
              options={yearOptions}
              placeholder={t('translation:releases.selectYear')}
              onChange={e => setYear(e?.value)}
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
        </Flex>
        <Button
          data-cy="filter-releases-btn"
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
