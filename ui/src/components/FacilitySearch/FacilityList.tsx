import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Box } from '@chakra-ui/layout'
import { Facility } from '../../api/models/Facility'
import { FacilityListItem } from './FacilityListItem'

export const FacilityList = ({
  facilities,
  firstItemIdx,
  pageItemLimit
}: {
  facilities: Facility[]
  firstItemIdx: number
  pageItemLimit: number
}) => {
  const history = useHistory()
  useEffect(() => {
    // redirect back to /facilities if the requested activeRowRange is not initial and has no rows
    if (
      firstItemIdx !== 0 &&
      facilities.slice(firstItemIdx, firstItemIdx + pageItemLimit).length === 0
    ) {
      console.warn(
        'No facilities found with the current activeRowRange, redirecting to default facility list'
      )
      history.push('/facilities')
    }
  }, [facilities, firstItemIdx, pageItemLimit, history])

  return (
    <Box
      data-cy="facility-list"
      as="ul"
      listStyleType="none"
      boxSizing="border-box"
      maxHeight="max(600px, calc(100vh - 405px))"
      maxWidth="100%"
      overflowY="auto">
      {facilities
        .slice(firstItemIdx, firstItemIdx + pageItemLimit)
        .map((f, idx) => (
          <FacilityListItem idx={idx} key={f.facilityId} f={f} />
        ))}
    </Box>
  )
}
