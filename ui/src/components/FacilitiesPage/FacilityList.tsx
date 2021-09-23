import { useEffect } from 'react'
import { Box } from '@chakra-ui/layout'
import { Facility } from '../../api/models/Facility'
import { FacilityListItem } from './FacilityListItem'

export const FacilityList = ({
  facilities,
  activeRowRange,
  handleExitResults
}: {
  facilities: Facility[]
  activeRowRange: [number, number]
  handleExitResults: () => void
}) => {
  useEffect(() => {
    // redirect back to /facilities if the requested activeRowRange is not initial and has no rows
    // (i.e. URL contains )
    if (
      facilities.slice(activeRowRange[0], activeRowRange[1]).length === 0 &&
      activeRowRange[0] !== 0
    ) {
      console.warn(
        'No facilities found with the current activeRowRange, redirecting to default facility list'
      )
      handleExitResults()
    }
  }, [activeRowRange, facilities, handleExitResults])

  return (
    <Box
      data-cy="facility-list"
      as="ul"
      listStyleType="none"
      boxSizing="border-box"
      maxHeight="max(600px, calc(100vh - 320px))"
      maxWidth="100%"
      marginTop={1}
      marginBottom={2}
      overflowY="auto">
      {facilities.slice(activeRowRange[0], activeRowRange[1]).map((f, idx) => (
        <FacilityListItem idx={idx} key={f.facilityId} f={f} />
      ))}
    </Box>
  )
}
