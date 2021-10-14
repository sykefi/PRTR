import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Flex } from '@chakra-ui/layout'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { PollutantCode } from '../../api/enums/PollutantCode'
import { OptionType } from '../../models/OptionType'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { Medium } from '../../api/enums/Medium'
import { getLongPollutantLabel, getPollutantLabel } from '../../utils'
import { asOption } from '../../models/OptionType'
import { TranslationKeys } from '../../react-i18next'
import { usePlacenameOptions } from '../../hooks/usePlaceNameOptions'
import { useYearOptions } from '../../hooks/useYearOptions'
import { DropdownSelectorAndLabel } from '../Common/DropdownSelectorAndLabel'

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
          <DropdownSelectorAndLabel<PollutantCode>
            width={350}
            minWidth={200}
            name="releasesPollutantCode"
            label={t('translation:releases.selectPollutant')}
            placeholder={t('translation:releases.selectPollutant')}
            value={
              pollutantCode
                ? asOption(pollutantCode, getPollutantLabel(t, pollutantCode))
                : null
            }
            options={pollutantOptions}
            handleChange={setPollutantCode}
          />
          <DropdownSelectorAndLabel<number>
            width={250}
            minWidth={200}
            name="releasesYear"
            label={t('translation:releases.selectYear')}
            placeholder={t('translation:releases.selectYear')}
            isLoading={yearOptionsIsLoading || yearOptionsIsError}
            options={yearOptions}
            value={asOption(year, year)}
            handleChange={setYear}
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
