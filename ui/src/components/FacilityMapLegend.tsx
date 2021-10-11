import { Box, Flex, Heading } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { FacilityTopMainActivity } from '../api/models/FacilityTopMainActivity'
import {
  strokeColorByTopMainActivity,
  fillColorByTopMainActivity
} from '../constants'

const legendItems: FacilityTopMainActivity[] = [
  FacilityTopMainActivity.ENERGY,
  FacilityTopMainActivity.METALS,
  FacilityTopMainActivity.MINERALS,
  FacilityTopMainActivity.CHEMICAL,
  FacilityTopMainActivity.WASTE,
  FacilityTopMainActivity.WOOD,
  FacilityTopMainActivity.LIVESTOCK,
  FacilityTopMainActivity.FOOD,
  FacilityTopMainActivity.OTHER,
  FacilityTopMainActivity.MISSING
]

const ClassRow = ({
  topMainActivity
}: {
  topMainActivity: FacilityTopMainActivity
}) => {
  const { t } = useTranslation('mainActivityCodeDesc')
  return (
    <Flex marginY={4} align="center">
      <Box
        width={5}
        minWidth={5}
        height={5}
        borderRadius="50%"
        border="1px solid"
        borderColor={strokeColorByTopMainActivity[topMainActivity]}
        backgroundColor={fillColorByTopMainActivity[topMainActivity]}></Box>
      <Box marginX={2}>{t(topMainActivity)}</Box>
    </Flex>
  )
}

export const FacilityMapLegend = () => {
  const { t } = useTranslation()
  return (
    <Box
      data-cy="facility-map-legend"
      width={450}
      minWidth={250}
      maxWidth="100%"
      paddingX={5}
      paddingY={2}
      height="max-content"
      maxHeight={600}
      overflowY="auto"
      background="white"
      borderRadius="md"
      boxShadow="md">
      <Heading as="h3" size="md" fontWeight="semibold" marginY={3}>
        {t('facilities.mapLegendTitle')}
      </Heading>
      {legendItems.map(a => (
        <ClassRow key={a} topMainActivity={a} />
      ))}
    </Box>
  )
}
