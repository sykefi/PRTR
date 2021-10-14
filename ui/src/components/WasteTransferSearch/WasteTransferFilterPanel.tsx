import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Flex } from '@chakra-ui/layout'
import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { asOption } from '../../models/OptionType'
import { useYearOptions } from '../../hooks/useYearOptions'
import { DropdownSelectorAndLabel } from '../Common/DropdownSelectorAndLabel'

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

  const searchInputsChanged = !props.urlYear || props.urlYear !== year

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
          <DropdownSelectorAndLabel
            width={250}
            minWidth={200}
            name="wasteTransfersYear"
            label={t('translation:common.selectYear')}
            placeholder={t('translation:common.selectYear')}
            isLoading={yearOptionsIsLoading || yearOptionsIsError}
            options={yearOptions}
            value={asOption(year, year)}
            handleChange={setYear}
          />
        </Flex>
        <Button
          data-cy="filter-waste-transfers-btn"
          type="submit"
          width="max-content"
          disabled={!searchInputsChanged}
          marginBottom={0.5}
          colorScheme="green">
          {t('translation:common.fetch')}
        </Button>
      </FormControl>
    </Form>
  )
}
