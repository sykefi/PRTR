import { Box, Circle, Flex, Heading } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { FacilityTopMainActivity } from '../api/enums/FacilityTopMainActivity'
import {
  strokeColorByTopMainActivity,
  fillColorByTopMainActivity,
  symbolByTopMainActivity
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
  FacilityTopMainActivity.OTHER
]

const LegendClassRow = ({
  topMainActivity
}: {
  topMainActivity: FacilityTopMainActivity
}) => {
  const { t } = useTranslation('mainActivityCodeDesc')

  return (
    <Flex marginY={4} align="center">
      <Circle
        h={8}
        w={8}
        border="solid"
        borderColor={strokeColorByTopMainActivity[topMainActivity]}
        backgroundColor={fillColorByTopMainActivity[topMainActivity]}>
        {symbolByTopMainActivity[topMainActivity]}
      </Circle>
      <Box marginLeft={2}>{t(topMainActivity)}</Box>
    </Flex>
  )
}

export const FacilityMapLegend = () => {
  const { t } = useTranslation()

  return (
    <Box
      data-cy="facility-map-legend"
      width={370}
      minWidth={250}
      maxWidth="100%"
      height="max-content"
      paddingX={5}
      paddingY={2}
      background="white"
      borderRadius="md"
      boxShadow="md">
      <Heading as="h3" size="md" fontWeight="semibold" marginY={3}>
        {t('facilities.mapLegendTitle')}
      </Heading>
      {legendItems.map(a => (
        <LegendClassRow key={a} topMainActivity={a} />
      ))}
    </Box>
  )
}
