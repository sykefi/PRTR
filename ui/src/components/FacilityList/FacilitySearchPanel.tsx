import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Form = styled.form`
  max-width: 100%;
`

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

  return (
    <Form onSubmit={handleSubmit} data-cy="facility-search-panel">
      <Flex marginTop={1.0} marginBottom={2.0} flexWrap="wrap" justify="center">
        <Input
          data-cy="facility-search-term"
          type="text"
          bgColor="white"
          width={438}
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
      </Flex>
    </Form>
  )
}
