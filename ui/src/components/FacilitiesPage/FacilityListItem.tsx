import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Box, Flex, Link } from '@chakra-ui/layout'
import { Facility } from '../../api/models/Facility'

export const FacilityListItem = ({ idx, f }: { idx: number; f: Facility }) => {
  const { t } = useTranslation()
  const location = useLocation()

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
        to={{
          pathname: '/facilities/' + f.facilityId,
          state: { from: location.pathname } // store the current (i.e. previous) path in location.state.from
        }}>
        {f.nameOfFeature}
      </Link>
      <Flex>
        <Box fontSize="smaller" marginRight={2}>
          {t('facilities.facilityTypeCode')}: {f.mainActivityCode}
        </Box>
        <Box fontSize="smaller">
          {t('common.municipality')}: {f.city}
        </Box>
      </Flex>
    </Box>
  )
}