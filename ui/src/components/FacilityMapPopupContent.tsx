import { Link as ReactRouterLink, useLocation } from 'react-router-dom'
import { Link } from '@chakra-ui/layout'
import { FacilityMapFeature } from '../models/FacilityMapFeature'

export const FacilityMapPopupContent = ({
  popupData
}: {
  popupData: FacilityMapFeature
}) => {
  const location = useLocation()

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
