import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Badge, Box, Flex, Link } from '@chakra-ui/layout'
import { Facility } from '../../api/models/Facility'
import {
  colorSchemeByFacilityStatus,
  fillColorByTopMainActivity,
  strokeColorByTopMainActivity
} from '../../constants'
import { FacilityTopMainActivity } from '../../api/enums/FacilityTopMainActivity'

const MainActivityBadge = ({
  topMainActivity
}: {
  topMainActivity: FacilityTopMainActivity
}) => {
  return (
    <Box
      borderRadius="50%"
      width={2.5}
      height={2.5}
      minHeight={2.5}
      minWidth={2.5}
      border="2px solid"
      color="black"
      marginRight={1}
      marginTop={0.5}
      borderColor={strokeColorByTopMainActivity[topMainActivity]}
      backgroundColor={fillColorByTopMainActivity[topMainActivity]}
    />
  )
}

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
        <Flex wrap="wrap" fontSize="smaller" marginRight={2} align="center">
          <Box marginRight={1.5}>{t('facilities.facilityTypeCode')}:</Box>
          <Flex align="center">
            <MainActivityBadge topMainActivity={f.topMainActivity} />
            {f.mainActivityCode}
          </Flex>
        </Flex>
        <Flex wrap="wrap" fontSize="smaller" marginRight={2}>
          <Box paddingRight={1.5}>{t('common.placename')}:</Box>
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
