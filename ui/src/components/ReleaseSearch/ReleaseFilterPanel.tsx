import { useQuery } from 'react-query'
import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Box, Flex } from '@chakra-ui/layout'
import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import * as api from '../../api'
import * as env from '../../env'
import { PollutantCode } from '../../api/models/PollutantCode'
import { OptionType } from '../../models/OptionType'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { ChakraSelect } from '../ChakraReactSelect'
import { useGetPollutantLabel } from '../../hooks/useGetPollutantLabel'
import { Medium } from '../../api/models/Medium'
import { PRTRApiMetadata } from '../../api/models/PRTRApiMetadata'
import { asOption } from '../../utils'

const usePollutantNameOptions = (
  getPollutantLabel: (p: PollutantCode) => string
): OptionType<PollutantCode>[] => {
  return Object.values(PollutantCode)
    .reduce((prev, curr) => {
      const label = getPollutantLabel(curr)
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

const useYearOptions = (
  metadata: PRTRApiMetadata | undefined
): OptionType<number>[] => {
  return metadata
    ? metadata.available_reporting_years
        .map(y => asOption(y))
        .filter((o): o is OptionType<number> => Boolean(o))
    : []
}

const Form = styled.form`
  max-width: 100%;
`

export const ReleaseFilterPanel = (props: {
  medium: Medium
  urlPollutantCode: PollutantCode | undefined
  urlYear: number | undefined
}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const location = useLocation()
  const [pollutantCode, setPollutantCode] = useState<PollutantCode | undefined>(
    undefined
  )
  const [year, setYear] = useState<number | undefined>(undefined)

  const getPollutantLabel = useGetPollutantLabel()
  const pollutantOptions = usePollutantNameOptions(getPollutantLabel)

  const apiMetadata = useQuery(
    ['prtrApiMetadata'],
    () => api.getApiMetadata(),
    env.rqCacheSettings
  )
  const yearOptions = useYearOptions(apiMetadata.data)

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
    newUrlSearchParams.set(URLSearchParamName.FirstItemIdx, '0')
    history.push({
      pathname: location.pathname,
      search: '?' + newUrlSearchParams.toString()
    })
  }

  const searchInputsChanged =
    (!props.urlYear && !props.urlPollutantCode) ||
    props.urlYear !== year ||
    props.urlPollutantCode !== pollutantCode

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
              value={asOption(pollutantCode, getPollutantLabel)}
              options={pollutantOptions}
              placeholder={t('releases.selectPollutant')}
              onChange={e => setPollutantCode(e?.value)}
            />
          </Box>
          <Box width={250} minWidth={200}>
            <ChakraSelect
              isClearable
              closeMenuOnSelect
              isLoading={apiMetadata.isLoading || apiMetadata.isError}
              name="releasesYear"
              value={asOption(year)}
              options={yearOptions}
              placeholder={t('releases.selectYear')}
              onChange={e => setYear(e?.value)}
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
          {t('common.fetch')}
        </Button>
      </FormControl>
    </Form>
  )
}
