import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Flex } from '@chakra-ui/layout'
import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { asOption, asSingleOption, OptionType } from '../../models/OptionType'
import { useYearOptions } from '../../hooks/useYearOptions'
import { DropdownSelectorAndLabel } from '../Common/DropdownSelectorAndLabel'
import { SingleDropdownSelectorAndLabel} from '../Common/SingleDropdownSelectorAndLabel'
import { AllOrInternationalFilter } from '../../api/enums/AllOrInternationalFilter'
import { TranslationKeys } from '../../react-i18next'
import { usePlacenameOptions } from '../../hooks/usePlaceNameOptions'
import { arrayEquals } from '../../utils'

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
  urlYear: number[] | undefined
  urlAllOrInternational: AllOrInternationalFilter
  urlPlacename: string[] | undefined
  sort: { sortKey: string; descending: boolean }
  updateSortKey: (newSortKey: string, newDescending: boolean) => void
}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const location = useLocation()

  const [year, setYear] = useState<number[] | undefined>(props.urlYear)
  const [allOrInternational, setAllOrInternational] =
    useState<AllOrInternationalFilter>(props.urlAllOrInternational)

  const { yearOptionsIsLoading, yearOptionsIsError, yearOptions } =
    useYearOptions()

  const [placename, setPlacename] = useState<string[] | undefined>(props.urlPlacename)

  const {
      placenameOptionsIsLoading,
      placenameOptionsIsError,
      placenameOptions
  } = usePlacenameOptions()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault() // prevent reload on submit
    const newUrlSearchParams = new URLSearchParams()
    if (year) {
      for (const y of year){
        newUrlSearchParams.append(URLSearchParamName.Year, y.toString())
      }
    }
    if (allOrInternational) {
      newUrlSearchParams.set(
        URLSearchParamName.AllOrInternational,
        allOrInternational
      )
    }
    if (placename) {
      for (const p of placename){
        newUrlSearchParams.append(URLSearchParamName.Placename, p)
      }
    }
    newUrlSearchParams.set(URLSearchParamName.FirstItemIdx, '0')
    history.push({
      pathname: location.pathname,
      search: '?' + newUrlSearchParams.toString()
    })
    props.updateSortKey("", true)
  }

  const searchInputsChanged =
    (!props.urlYear && allOrInternational === AllOrInternationalFilter.ALL && !props.urlPlacename) ||
    !(arrayEquals(props.urlYear, year)) ||
    props.urlAllOrInternational !== allOrInternational ||
    !(arrayEquals(props.urlPlacename, placename)) ||
    props.sort.sortKey !== ""

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
          <SingleDropdownSelectorAndLabel<AllOrInternationalFilter>
            width={350}
            minWidth={200}
            name="selectAllOrInternationalWasteTransfers"
            label={t('wasteTransfers.allOrInternationalSelectLabel')}
            placeholder={t('wasteTransfers.allOrInternationalSelectLabel')}
            isClearable={false}
            options={getAllOrInternationalOptions(t)}
            value={asSingleOption(
              allOrInternational,
              t(`wasteTransfers.allOrInternational${allOrInternational}Label`)
            )}
            handleChange={v =>
              setAllOrInternational(v || AllOrInternationalFilter.ALL)
            }
          />
          <DropdownSelectorAndLabel<string>
            width={350}
            minWidth={200}
            name="wasteTransfersPlacename"
            label={t('wasteTransfers.searchWithPlaceName')}
            placeholder={t('wasteTransfers.searchWithPlaceName')}
            isLoading={placenameOptionsIsLoading || placenameOptionsIsError}
            options={placenameOptions}
            value={asOption(placename, placename)}
            handleChange={setPlacename}
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
