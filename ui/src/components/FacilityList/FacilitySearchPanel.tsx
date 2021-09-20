import styled from 'styled-components'
import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { ChakraSelect } from '../ChakraReactSelect'
import { useFacilityMainActivityOptions } from './useFacilityMainActivityOptions'

const Form = styled.form`
  max-width: 100%;
`

export const colourOptions = [
  { value: '2(b)', label: 'Rauta- ja terästeollisuus' },
  { value: '5(f)', label: 'Yhdyskuntajätevesien käsittelylaitokset' }
]

export const FacilitySearchPanel = ({
  searchTerm,
  setSearchTerm,
  handleSubmit
}: {
  searchTerm: string
  setSearchTerm: (term: string) => void
  handleSubmit: () => void
}) => {
  const { t } = useTranslation()
  const facilityMainActivityCodeOptions = useFacilityMainActivityOptions()

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
              name="colors"
              options={colourOptions}
              borderColor="blue"
              placeholder="Valitse toimiala"
              onChange={e => console.log(e)}
            />
          </Box>
          <Input
            data-cy="facility-search-term"
            type="text"
            bgColor="white"
            minWidth={200}
            maxWidth="100%"
            marginY={1.0}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('common.searchTerm')}
          />
          <Button
            data-cy="search-facilities-btn"
            type="submit"
            marginY={1.0}
            marginLeft={1.0}
            disabled={searchTerm === ''}
            colorScheme="green">
            {t('common.search')}
          </Button>
        </FormControl>
      </Flex>
    </Form>
  )
}
