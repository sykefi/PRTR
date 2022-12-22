
import { useTranslation } from 'react-i18next'
import { Button } from '@chakra-ui/button'
import { unparse } from 'papaparse'
import * as api from '../../api'
import {
    PollutantCodeAir,
    PollutantCodeWater
  } from '../../api/enums/PollutantCode'
import { PollutantRelease } from '../../api/models/PollutantRelease'
import { Medium } from '../../api/enums/Medium'

export const CSVDownloadReleasesButton = ({
    medium,
    urlPollutantCode,
    urlYear,
    urlPlacename,
    sort
    }: {
    medium: Medium,
    urlPollutantCode: (PollutantCodeAir | PollutantCodeWater)[] | undefined,
    urlYear: number[] | undefined,
    urlPlacename: string[] | undefined,
    sort: { sortKey: string; descending: boolean }
}) => {
    const { t } = useTranslation()

    const firstItemIdx = 0 //Get releases starting from the first
    const itemLimit = -1 //Until the end 

    const fetchDataAndLoadCSV =
        async () => {
          const result = await api.getReleases({
            pollutant_code: urlPollutantCode,
            medium: medium,
            reporting_year: urlYear,
            placename: urlPlacename,
            skip: firstItemIdx,
            limit: itemLimit,
            sort_key: sort.sortKey,
            descending: sort.descending
          })
          
        //Make PollutantRelease properties optional and delete unwanted properties
        result.data.forEach((v: Partial<PollutantRelease>) => {
            delete v.facilityId
            delete v.AccidentalPollutantQuantityKG
            delete v.id
            delete v.medium
            delete v.city
             });

        //Convert array of objects to csv
        const csv = unparse(result.data)

        //Download functionality
        const file = new Blob([csv], {type: 'text/csv;charset=utf-8'});
        const element = document.createElement("a");
        element.href = URL.createObjectURL(file);
        element.download = t("releases.fileName")+".csv";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      }


    return(
        <Button
            data-cy="download-button"
            colorScheme="green"
            size="sm"
            onClick={() => fetchDataAndLoadCSV()}>
            {t("common.downloadCSV")}
          </Button>
    )
}