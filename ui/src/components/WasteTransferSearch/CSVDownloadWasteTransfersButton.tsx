import { Button } from '@chakra-ui/button'
import { useTranslation } from 'react-i18next'
import { unparse } from 'papaparse'
import * as api from '../../api'
import { AllOrInternationalFilter } from '../../api/enums/AllOrInternationalFilter'
import { WasteTransfer } from '../../api/models/WasteTransfer'

export const CSVDownloadWasteTransfersButton = ({
    urlAllOrInternational,
    urlYear,
    urlPlacename,
    sort
    }: {
    urlAllOrInternational: AllOrInternationalFilter,
    urlYear: number[] | undefined,
    urlPlacename: string[] | undefined,
    sort: { sortKey: string; descending: boolean }
}) => {
    const { t } = useTranslation()

    const firstItemIdx = 0 //Get releases starting from the first
    const itemLimit = -1 //Until the end 

    const fetchDataAndLoadCSV =
        async () => {
          const result = await api.getWasteTransfers({
            reporting_year: urlYear,
            skip: firstItemIdx,
            limit: itemLimit,
            placename: urlPlacename,
            all_or_international_filter: urlAllOrInternational,
            sort_key: sort.sortKey,
            descending: sort.descending
          })
           
        //Make PollutantRelease properties optional and delete unwanted properties    
        result.data.forEach((v: Partial<WasteTransfer>) => {
            delete v.facilityId
            delete v.topMainActivity
            delete v.id
            delete v.mainActivityCode
            delete v.receivingSiteCity
            delete v.receivingSiteCountryName
            delete v.methodCode
             });

        //Convert array of objects to csv
        const csv = unparse(result.data)

        //Download functionality
        const file = new Blob([csv], {type: 'text/csv;charset=utf-8'});
        const element = document.createElement("a");
        element.href = URL.createObjectURL(file);
        element.download = t("wasteTransfers.fileName")+".csv";
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