import React from "react";
import { Box } from "@chakra-ui/layout";
import { useTranslation } from 'react-i18next'

const AirPollutantMap: React.FC = () => {
  const { i18n } = useTranslation();
  const selectedLanguage = i18n.language;
  const source = 'air-pollutant-map/index.html?lang='+selectedLanguage

  return (
    <Box width="100%" height="calc(90vh)">
      <iframe
        src={source}
        title="Air Pollutant Map"
        width="100%"
        height="100%"
      />
    </Box>
  );
}

export default AirPollutantMap