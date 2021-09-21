import { useParams } from 'react-router-dom'

type FacilityParams = {
  facilityId: string
}

export const FacilityInfo = () => {
  const { facilityId } = useParams<FacilityParams>()
  return <div>Facility info for {facilityId}</div>
}
