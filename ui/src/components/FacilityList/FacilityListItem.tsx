import { useTranslation } from 'react-i18next'
import { Facility } from '../../api/models/Facility'
import { History } from 'history'
import { Box, Flex } from '@chakra-ui/layout'

export const FacilityListItem = ({
  f,
  history
}: {
  f: Facility
  history: History
}) => {
  const { t } = useTranslation()

  return (
    <li>
      <Box
        bg="white"
        as="button"
        borderRadius="md"
        boxShadow="sm"
        paddingX={3}
        paddingY={1.5}
        textAlign="left"
        marginY={1.0}
        width="500px"
        maxWidth="100%"
        onClick={() => history.push('/facilities/' + f.facilityId)}>
        <Box
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          overflowWrap="normal"
          whiteSpace="unset"
          overflow="hidden">
          {f.nameOfFeature}
        </Box>
        <Flex>
          <Box fontSize="smaller" marginRight={2}>
            {t('common.facilityTypeCode')}: {f.mainActivityCode}
          </Box>
          <Box fontSize="smaller">
            {t('common.municipality')}: {f.city}
          </Box>
        </Flex>
      </Box>
    </li>
  )
}
