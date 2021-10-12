import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Box, Flex } from '@chakra-ui/layout'
import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { ChakraSelect } from '../ChakraReactSelect'
import { asOption } from '../../models/OptionType'
import { useYearOptions } from '../../hooks/useYearOptions'

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

  const { yearOptionsIsLoading, yearOptionsIsError, yearOptions } =
    useYearOptions()

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
              isLoading={yearOptionsIsLoading || yearOptionsIsError}
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
