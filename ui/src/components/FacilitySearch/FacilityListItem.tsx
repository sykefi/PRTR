import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Badge, Box, Flex, Link } from '@chakra-ui/layout'
import { Facility } from '../../api/models/Facility'
import { colorSchemeByFacilityStatus } from '../../constants'

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
      paddingY={2}
      textAlign="left"
      marginY={2}
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
        textDecoration="underline"
        to={{
          pathname: '/facilities/' + f.facilityId,
          state: { from: location.pathname }
          // store the current (i.e. previous) path in location.state.from so that we know where we came from
        }}>
        {f.nameOfFeature}
      </Link>
      <Flex marginTop={0.5} justify="space-between">
        <Flex wrap="wrap" fontSize="smaller" marginRight={2}>
          <Box>{t('facilities.facilityTypeCode')}:</Box>
          <Box>{f.mainActivityCode}</Box>
        </Flex>
        <Flex wrap="wrap" fontSize="smaller" marginRight={2}>
          <Box>{t('common.placename')}:</Box>
          <Box>{f.city}</Box>
        </Flex>
        <Flex wrap="wrap">
          <Box fontSize="smaller" marginRight={2}>
            {t('facilities.status.title')}:
          </Box>
          <Badge
            colorScheme={
              f.status ? colorSchemeByFacilityStatus[f.status] : 'blackAlpha'
            }
            variant={f.status ? 'subtle' : 'outline'}>
            {f.status ? t(`facilities.status.${f.status}`) : '-'}
          </Badge>
        </Flex>
      </Flex>
    </Box>
  )
}
