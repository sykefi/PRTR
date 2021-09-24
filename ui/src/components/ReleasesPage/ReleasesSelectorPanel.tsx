import { Button } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { PollutantCode } from '../../api/models/PollutantCode'
import { OptionType } from '../../models/OptionType'
import { ChakraSelect } from '../ChakraReactSelect'

const usePollutantNameOptions = (): OptionType<PollutantCode>[] => {
  const { t } = useTranslation(['pollutantName', 'pollutantAbbreviation'])

  return Object.values(PollutantCode)
    .reduce((prev, curr) => {
      const name = t(`pollutantName:${curr}`)
      const abbr = t(`pollutantAbbreviation:${curr}`)
      const label = `${abbr}${abbr && name && ' - '} ${name}`
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

const Form = styled.form`
  max-width: 100%;
`

export const ReleaseSelectorPanel = () => {
  const { t } = useTranslation()
  const pollutantOptions = usePollutantNameOptions()

  return (
    <Form
      onSubmit={() => console.warn('implement handle submit')}
      data-cy="facility-search-panel">
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
              value={undefined}
              name="facilityMainActivityCode"
              options={pollutantOptions}
              placeholder={t('releases.selectPollutant')}
              onChange={e =>
                console.warn('implement select pollutant', e?.value)
              }
            />
          </Box>
          <Button
            data-cy="search-facilities-btn"
            type="submit"
            marginY={1.0}
            marginLeft={1.0}
            disabled={true}
            colorScheme="green">
            {t('common.search')}
          </Button>
        </FormControl>
      </Flex>
    </Form>
  )
}
