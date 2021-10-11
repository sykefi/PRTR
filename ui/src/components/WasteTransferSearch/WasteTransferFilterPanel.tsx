import { useQuery } from 'react-query'
import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Box, Flex } from '@chakra-ui/layout'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import * as api from '../../api'
import * as env from '../../env'
import { OptionType } from '../../models/OptionType'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { ChakraSelect } from '../ChakraReactSelect'
import { PRTRApiMetadata } from '../../api/models/PRTRApiMetadata'
import { asOption } from '../../models/OptionType'

const getYearOptions = (
  metadata: PRTRApiMetadata | undefined
): OptionType<number>[] => {
  return metadata
    ? metadata.available_reporting_years
        .map(y => asOption(y, y))
        .filter((o): o is OptionType<number> => Boolean(o))
    : []
}

const Form = styled.form`
  max-width: 100%;
`

export const WasteTransferFilterPanel = (props: {
  urlYear: number | undefined
}) => {
  const { t } = useTranslation(['translation'])
  const history = useHistory()
  const location = useLocation()

  const [year, setYear] = useState<number | undefined>(undefined)

  const apiMetadata = useQuery(
    ['prtrApiMetadata'],
    api.getApiMetadata,
    env.rqCacheSettings
  )
  const yearOptions = useMemo(
    () => getYearOptions(apiMetadata.data),
    [apiMetadata.data]
  )

  useEffect(() => {
    // initialize select inputs from url search params on page load
    setYear(props.urlYear)
  }, [props.urlYear])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault() // prevent reload on submit
    const newUrlSearchParams = new URLSearchParams()
    if (year) {
      newUrlSearchParams.set(URLSearchParamName.Year, year.toString())
    }
    newUrlSearchParams.set(URLSearchParamName.FirstItemIdx, '0')
    history.push({
      pathname: location.pathname,
      search: '?' + newUrlSearchParams.toString()
    })
  }

  return (
    <Form onSubmit={handleSubmit} data-cy="waste-transfers-filter-panel">
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
          <Box width={250} minWidth={200}>
            <ChakraSelect
              isClearable
              closeMenuOnSelect
              isLoading={apiMetadata.isLoading || apiMetadata.isError}
              name="wasteTransfersYear"
              value={asOption(year, year)}
              options={yearOptions}
              placeholder={t('translation:common.selectYear')}
              onChange={e => setYear(e?.value)}
            />
          </Box>
        </Flex>
        <Button
          data-cy="filter-waste-transfers-btn"
          type="submit"
          width="max-content"
          marginBottom={0.5}
          colorScheme="green">
          {t('translation:common.fetch')}
        </Button>
      </FormControl>
    </Form>
  )
}
