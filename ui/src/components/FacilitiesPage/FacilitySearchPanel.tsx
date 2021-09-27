import { FormEvent } from 'react'
import styled from 'styled-components'
import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { FacilityMainActivityCode } from '../../api/models/FacilityMainActivityCode'
import { ChakraSelect } from '../ChakraReactSelect'
import { OptionType } from '../../models/OptionType'

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

export const FacilitySearchPanel = ({
  searchTerm,
  facilityMainActivityCode,
  setSearchTerm,
  setFacilityMainActivityCode,
  handleSubmit
}: {
  searchTerm: string | undefined
  facilityMainActivityCode: FacilityMainActivityCode | undefined
  setSearchTerm: (term: string) => void
  setFacilityMainActivityCode: (
    code: FacilityMainActivityCode | undefined
  ) => void
  handleSubmit: (e: FormEvent) => void
}) => {
  const { t } = useTranslation(['translation', 'mainActivityCodeDesc'])
  const facilityMainActivityCodeOptions = useFacilityMainActivityOptions()

  const initialOption = facilityMainActivityCode
    ? {
        value: facilityMainActivityCode,
        label: t(`mainActivityCodeDesc:${facilityMainActivityCode}`)
      }
    : undefined

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
              value={initialOption}
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
            marginY={1.0}
            marginLeft={1.0}
            disabled={!searchTerm && !facilityMainActivityCode}
            colorScheme="green">
            {t('translation:common.search')}
          </Button>
        </FormControl>
      </Flex>
    </Form>
  )
}
