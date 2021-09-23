import { Button } from '@chakra-ui/button'
import { Box, Heading } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { Facility } from '../../api/models/Facility'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'

const InfoPropRow = ({
  label,
  value
}: {
  label: string
  value: string | null
}) => {
  return (
    <Box marginY={2}>
      <Box fontWeight="semibold">{label}</Box>
      <Box marginTop={0.5} color="blackAlpha.800">
        {value || '-'}
      </Box>
    </Box>
  )
}

export const FacilityBasicInfo = ({
  facility,
  loading,
  error
}: {
  facility: Facility | null
  loading: boolean
  error: boolean
}) => {
  const history = useHistory()
  const { t } = useTranslation(['translation', 'mainActivityCodeDesc'])

  return (
    <Box
      data-cy="facility-basic-info"
      width={450}
      minWidth={250}
      maxWidth="100%"
      m={2}
      paddingX={5}
      paddingY={2}
      height="max-content"
      maxHeight={600}
      overflowY="auto"
      background="white"
      borderRadius="md"
      boxShadow="md">
      <Heading as="h3" size="md" fontWeight="semibold" marginY={2}>
        {t('translation:common.basicInfo')}
      </Heading>
      {facility && (
        <>
          <InfoPropRow
            label={t('translation:facilities.facilityTypeCode')}
            value={
              facility.mainActivityCode +
              (t(`mainActivityCodeDesc:${facility.mainActivityCode}`)
                ? ' - ' + t(`mainActivityCodeDesc:${facility.mainActivityCode}`)
                : '')
            }
          />
          <InfoPropRow
            label={t('translation:common.municipality')}
            value={facility.city}
          />
          <InfoPropRow
            label={t('translation:common.streetAddress')}
            value={`${facility.streetName} ${facility.buildingNumber || ''}`}
          />
          <InfoPropRow
            label={t('translation:common.telephoneNumber')}
            value={facility.telephoneNo || ''}
          />
        </>
      )}
      {loading && (
        <Box p={2} data-cy="facility-info-load-animation">
          <LoadAnimation sizePx={30} />
        </Box>
      )}
      {error && (
        <>
          <Box marginTop={2.0}>
            <Box fontSize="smaller">
              {t('translation:facilities.couldNotFindFacilityWithId')}
            </Box>
            <Box>
              <Button
                marginY={2.0}
                size="sm"
                colorScheme="blue"
                onClick={() => history.push('/')}>
                {t('translation:common.goBack')}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}
