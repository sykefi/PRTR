import { Link as ReactRouterLink, useLocation } from 'react-router-dom'
import { Box, Link } from '@chakra-ui/layout'
import { FacilityMapFeature } from '../models/FacilityMapFeature'
import { RoutePath } from '../models'

export const FacilityMapPopupContent = ({
  popupData
}: {
  popupData: FacilityMapFeature
}) => {
  const location = useLocation()

  // show just the name (without link) if user is already at the facility page
  if (location.pathname === `${RoutePath.Facilities}/${popupData.facilityId}`) {
    return <Box fontWeight="semibold">{popupData.nameOfFeature}</Box>
  }

  return (
    <Link
      fontWeight="semibold"
      as={ReactRouterLink}
      lineHeight="tight"
      overflowWrap="normal"
      whiteSpace="unset"
      overflow="hidden"
      textDecoration="underline"
      to={{
        pathname: '/facilities/' + popupData.facilityId,
        state: { from: location.pathname }
        // store the current (i.e. previous) path in location.state.from so that we know where we came from
      }}>
      {popupData.nameOfFeature}
    </Link>
  )
}
