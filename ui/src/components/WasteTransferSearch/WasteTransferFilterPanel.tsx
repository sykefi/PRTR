import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Flex } from '@chakra-ui/layout'
import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { asOption, OptionType } from '../../models/OptionType'
import { useYearOptions } from '../../hooks/useYearOptions'
import { DropdownSelectorAndLabel } from '../Common/DropdownSelectorAndLabel'
import { AllOrInternationalFilter } from '../../api/enums/AllOrInternationalFilter'
import { TranslationKeys } from '../../react-i18next'

const Form = styled.form`
  max-width: 100%;
`

const getAllOrInternationalOptions = (
  t: (translationKey: TranslationKeys) => string | undefined
): OptionType<AllOrInternationalFilter>[] => {
  return [
    {
      value: AllOrInternationalFilter.ALL,
      label: t('wasteTransfers.allOrInternationalAllLabel') || ''
    },
    {
      value: AllOrInternationalFilter.INTERNATIONAL,
      label: t('wasteTransfers.allOrInternationalInternationalLabel') || ''
    }
  ]
}

export const WasteTransferFilterPanel = (props: {
  urlYear: number | undefined
  urlAllOrInternational: AllOrInternationalFilter
}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const location = useLocation()

  const [year, setYear] = useState<number | undefined>(undefined)
  const [allOrInternational, setAllOrInternational] =
    useState<AllOrInternationalFilter>(props.urlAllOrInternational)

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
    if (allOrInternational) {
      newUrlSearchParams.set(
        URLSearchParamName.AllOrInternational,
        allOrInternational
      )
    }
    newUrlSearchParams.set(URLSearchParamName.FirstItemIdx, '0')
    history.push({
      pathname: location.pathname,
      search: '?' + newUrlSearchParams.toString()
    })
  }

  const searchInputsChanged =
    (!props.urlYear && allOrInternational === AllOrInternationalFilter.ALL) ||
    props.urlYear !== year ||
    props.urlAllOrInternational !== allOrInternational

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
            label={t('common.selectYear')}
            placeholder={t('common.selectYear')}
            isLoading={yearOptionsIsLoading || yearOptionsIsError}
            options={yearOptions}
            value={asOption(year, year)}
            handleChange={setYear}
          />
          <DropdownSelectorAndLabel<AllOrInternationalFilter>
            width={350}
            minWidth={200}
            name="selectAllOrInternationalWasteTransfers"
            label={t('wasteTransfers.allOrInternationalSelectLabel')}
            placeholder={t('wasteTransfers.allOrInternationalSelectLabel')}
            isClearable={false}
            options={getAllOrInternationalOptions(t)}
            value={asOption(
              allOrInternational,
              t(`wasteTransfers.allOrInternational${allOrInternational}Label`)
            )}
            handleChange={v =>
              setAllOrInternational(v || AllOrInternationalFilter.ALL)
            }
          />
        </Flex>
        <Button
          data-cy="filter-waste-transfers-btn"
          type="submit"
          width="max-content"
          disabled={!searchInputsChanged}
          marginBottom={0.5}
          colorScheme="green">
          {t('common.fetch')}
        </Button>
      </FormControl>
    </Form>
  )
}
