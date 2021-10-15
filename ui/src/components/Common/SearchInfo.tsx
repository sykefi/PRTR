import { Box, Flex, Link } from '@chakra-ui/layout'
import { NavLink as RrLink } from 'react-router-dom'

import { TFuncKey, Trans } from 'react-i18next'
import { TranslationKeys } from '../../react-i18next'
import { RoutePath } from '../../models/RoutePath'

export const SearchInfo = ({ textKey }: { textKey: TranslationKeys }) => {
  return (
    <Flex width="100%" justify="center">
      <Box paddingX={{ base: 0, md: 10 }} paddingY={2} maxWidth={900}>
        <Trans i18nKey={textKey as TFuncKey}>
          <Link
            as={RrLink}
            to={RoutePath.PollutantInfoTable}
            textDecoration="underline"
            rel="noopener noreferrer external"></Link>
        </Trans>
      </Box>
    </Flex>
  )
}
