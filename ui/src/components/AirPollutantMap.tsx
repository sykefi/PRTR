import React from 'react'
import { Box, Container } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'

const AirPollutantMap: React.FC = () => {
  const { i18n } = useTranslation();
  const selectedLanguage = i18n.language;
  const source = 'air-pollutant-map/index.html?lang='+selectedLanguage

  return (
    <Container maxW="100%" p={3} centerContent>
      <Box 
        width="90%" 
        height="calc(90vh)" 
        backgroundColor='white' 
        borderRadius="md" 
        boxShadow="sm">
        <iframe
          src={source}
          title="Air Pollutant Map"
          width="100%"
          height="100%"
        />
      </Box>
    </Container>
  );
}

export default AirPollutantMap