import { useTranslation } from 'react-i18next'
import { History } from 'history'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Box, Flex, Link } from '@chakra-ui/layout'
import { Facility } from '../../api/models/Facility'

export const FacilityListItem = ({
  idx,
  f,
  history
}: {
  idx: number
  f: Facility
  history: History
}) => {
  const { t } = useTranslation()

  return (
    <Box
      bg="white"
      as="li"
      borderRadius="md"
      boxShadow="sm"
      paddingX={3}
      paddingY={1.5}
      textAlign="left"
      marginY={1.5}
      marginTop={idx === 0 ? 'unset' : 1}
      marginRight={{ base: 'unset', md: 1 }}
      width="500px"
      maxWidth="100%">
      <Link
        fontWeight="semibold"
        as={ReactRouterLink}
        lineHeight="tight"
        overflowWrap="normal"
        whiteSpace="unset"
        overflow="hidden"
        to={'/facilities/' + f.facilityId}>
        {f.nameOfFeature}
      </Link>
      <Flex>
        <Box fontSize="smaller" marginRight={2}>
          {t('common.facilityTypeCode')}: {f.mainActivityCode}
        </Box>
        <Box fontSize="smaller">
          {t('common.municipality')}: {f.city}
        </Box>
      </Flex>
    </Box>
  )
}
