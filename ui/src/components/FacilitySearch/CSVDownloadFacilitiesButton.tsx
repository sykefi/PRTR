import { Button } from '@chakra-ui/button'
import { useTranslation } from 'react-i18next'
import { unparse } from 'papaparse'
import * as api from '../../api'
import { FacilityMainActivityCode } from '../../api/enums/FacilityMainActivityCode'
import { FacilityTopMainActivity } from '../../api/enums/FacilityTopMainActivity'
import { Facility } from '../../api/models/Facility'

export const CSVDownloadFacilitiesButton = ({
    urlSearchTerm,
    urlFacilityMainActivity,
    urlPlacename
    }: {
    urlSearchTerm: string | undefined,
    urlFacilityMainActivity: (FacilityMainActivityCode | FacilityTopMainActivity)[] | undefined,
    urlPlacename: string[] | undefined
}) => {
    const { t } = useTranslation()

    const firstItemIdx = 0 //Get releases starting from the first
    const itemLimit = -1 //Until the end 

    const fetchDataAndLoadCSV =
        async () => {
          const result = await api.getFacilities({
            name_search_str: urlSearchTerm,
            main_activity: urlFacilityMainActivity,
            placename: urlPlacename,
            skip: firstItemIdx,
            limit: itemLimit
          })
          

        //Make Facility properties optional and delete unwanted properties
        result.forEach((v: Partial<Facility>) => {
            delete v.facilityId
            delete v.parentCompanyName
            delete v.topMainActivity
            delete v.x
            delete v.y
            delete v.streetName
            delete v.buildingNumber
            delete v.postalCode
            delete v.authorityName
            delete v.authorityTelephoneNo
             });

        //Convert array of objects to csv
        const csv = unparse(result)
     
        //Download functionality
        const file = new Blob([csv], {type: 'text/csv;charset=utf-8'});
        const element = document.createElement("a");
        element.href = URL.createObjectURL(file);
        element.download = t("facilities.fileName")+".csv";
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