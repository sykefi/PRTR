import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Box, Flex } from '@chakra-ui/layout'
import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { PollutantCode } from '../../api/models/PollutantCode'
import { OptionType } from '../../models/OptionType'
import { ReleaseSearchURLParamName } from '../../models/ReleaseSearchURLParamName'
import { ChakraSelect } from '../ChakraReactSelect'
import { useGetPollutantLabel } from '../../hooks/useGetPollutantLabel'
import { Medium } from '../../api/models/Medium'

const usePollutantNameOptions = (): OptionType<PollutantCode>[] => {
  const getPollutantLabel = useGetPollutantLabel()

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

const asOption = <T extends string>(
  v: T | undefined,
  getLabel: (v: T) => string
): OptionType<T> | undefined => {
  return v
    ? {
        value: v,
        label: getLabel(v)
      }
    : undefined
}

const Form = styled.form`
  max-width: 100%;
`

export const ReleasesFilterPanel = (props: {
  medium: Medium
  urlPollutantCode: PollutantCode | undefined
}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const location = useLocation()
  const [pollutantCode, setPollutantCode] = useState<PollutantCode | undefined>(
    undefined
  )

  const getPollutantLabel = useGetPollutantLabel()
  const pollutantOptions = usePollutantNameOptions()

  useEffect(() => {
    // initialize selected pollutant from url search param on page load or medium tab switch
    setPollutantCode(props.urlPollutantCode)
  }, [props.medium, props.urlPollutantCode])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault() // prevent reload on submit
    const newUrlSearchParams = new URLSearchParams()
    if (pollutantCode) {
      newUrlSearchParams.set(
        ReleaseSearchURLParamName.PollutantCode,
        pollutantCode
      )
    }
    history.push({
      pathname: location.pathname,
      search: '?' + newUrlSearchParams.toString()
    })
  }

  return (
    <Form onSubmit={handleSubmit} data-cy="releases-filter-panel">
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
              name="releasesPollutantCode"
              value={asOption(pollutantCode, getPollutantLabel)}
              options={pollutantOptions}
              placeholder={t('releases.selectPollutant')}
              onChange={e => setPollutantCode(e?.value)}
            />
          </Box>
          <Button
            data-cy="filter-releases-btn"
            type="submit"
            marginY={1.0}
            marginLeft={1.0}
            colorScheme="green">
            {t('common.search')}
          </Button>
        </FormControl>
      </Flex>
    </Form>
  )
}
