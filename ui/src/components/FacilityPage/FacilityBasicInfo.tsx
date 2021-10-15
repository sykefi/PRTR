import { Button } from '@chakra-ui/button'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, Link } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { Facility } from '../../api/models/Facility'
import { AuthorityInfo } from '../../models/AuthorityInfo'
import { getAuthorityInfo } from '../../authorityInfo'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'

const getStreetAddress = (f: Facility): string | undefined => {
  if (!f.streetName && !f.buildingNumber) return
  return `${f.streetName ? f.streetName + ' ' : ''}${f.buildingNumber || ''}`
}

const InfoPropRow = ({
  label,
  value
}: {
  label: string
  value?: string | null
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

export const getCompetentAuthorityName = (
  authority: AuthorityInfo,
  lang: string
): string | undefined => {
  if (!authority || !['fi', 'sv', 'en'].includes(lang)) return undefined
  return authority.name[lang as 'fi' | 'sv' | 'en']
}

export const FacilityBasicInfo = ({
  facility,
  loading,
  error,
  handleExit,
  exitLabel
}: {
  facility: Facility | undefined
  loading: boolean
  error: boolean
  handleExit: () => void
  exitLabel: string
}) => {
  const { t } = useTranslation(['translation', 'mainActivityCodeDesc'])
  const { i18n } = useTranslation()

  const authorityInfo =
    facility && facility.authorityName
      ? getAuthorityInfo(facility.authorityName)
      : undefined

  return (
    <Box
      data-cy="facility-basic-info"
      width={450}
      minHeight={400}
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
            label={t('translation:common.placename')}
            value={facility.city}
          />
          <InfoPropRow
            label={t('translation:common.streetAddress')}
            value={getStreetAddress(facility)}
          />
          <InfoPropRow
            label={t('translation:common.telephoneNumberToAuthority')}
            value={facility.authorityTelephoneNo || ''}
          />
          <Box marginY={2}>
            <Box fontWeight="semibold">
              {t('translation:common.competentAuthority')}
            </Box>
            {!authorityInfo && (
              <Box marginTop={0.5} color="blackAlpha.800">
                -
              </Box>
            )}
            {authorityInfo && (
              <Link href={authorityInfo.url} isExternal>
                {getCompetentAuthorityName(authorityInfo, i18n.language) || '-'}{' '}
                <ExternalLinkIcon color="#4f4f4f" mx="2px" />
              </Link>
            )}
          </Box>
          <InfoPropRow
            label={t('translation:facilities.status.title')}
            value={
              facility.status
                ? t(`translation:facilities.status.${facility.status}`)
                : ''
            }
          />
        </>
      )}
      {loading && (
        <Flex p={2} justify="center" data-cy="facility-info-load-animation">
          <LoadAnimation sizePx={30} />
        </Flex>
      )}
      {!facility && error && (
        <>
          <Box marginTop={2.0}>
            <Box>{t('translation:facilities.couldNotFindFacilityWithId')}</Box>
            <Box>
              <Button
                marginY={2.0}
                size="sm"
                colorScheme="blue"
                onClick={handleExit}>
                {exitLabel}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}
