from data_import.conf import conf


sql_facilities = (
    f'''
    SELECT DISTINCT
    [2_ProductionFacility].Facility_INSPIRE_ID,
    [2_ProductionFacility].parentCompanyName,
    [2_ProductionFacility].nameOfFeature,
    [2_ProductionFacility].mainActivityCode,
    [2_ProductionFacility].mainActivityName,
    [2_ProductionFacility].pointGeometryLon,
    [2_ProductionFacility].pointGeometryLat,
    [2_ProductionFacility].streetName,
    [2_ProductionFacility].buildingNumber,
    [2_ProductionFacility].city,
    [2_ProductionFacility].postalCode,
    [2_ProductionFacility].countryCode,
    Max([2a_ProductionFacilityDetails].reportingYear) AS reportingYear,
    FIRST([2a_ProductionFacilityDetails].status) as status,
    FIRST([2d_CompetentAuthorityEPRTR].CompetentAuthorityEPRTRId)
        as CompetentAuthorityEPRTRId,
    FIRST([2d_CompetentAuthorityEPRTR].telephoneNo) as telephoneNo
    FROM (
        2_ProductionFacility
        LEFT JOIN 2a_ProductionFacilityDetails ON
            [2_ProductionFacility].[Facility_INSPIRE_ID] =
            [2a_ProductionFacilityDetails].[Facility_INSPIRE_ID]
        )
        LEFT JOIN 2d_CompetentAuthorityEPRTR ON
            [2_ProductionFacility].[Facility_INSPIRE_ID] =
            [2d_CompetentAuthorityEPRTR].[Facility_INSPIRE_ID]
    GROUP BY [2_ProductionFacility].Facility_INSPIRE_ID,
    [2_ProductionFacility].parentCompanyName,
    [2_ProductionFacility].nameOfFeature,
    [2_ProductionFacility].mainActivityCode,
    [2_ProductionFacility].mainActivityName,
    [2_ProductionFacility].pointGeometryLat,
    [2_ProductionFacility].pointGeometryLon,
    [2_ProductionFacility].streetName,
    [2_ProductionFacility].buildingNumber,
    [2_ProductionFacility].city,
    [2_ProductionFacility].postalCode,
    [2_ProductionFacility].countryCode,
    [2_ProductionFacility].facilityType
    HAVING (
        (
            [2_ProductionFacility].countryCode='{conf.country_code}' AND
            [2_ProductionFacility].facilityType='EPRTR'
        )
    );
    '''
)

sql_releases = (
    f'''
    SELECT
    [2f_PollutantRelease].Facility_INSPIRE_ID,
    [2f_PollutantRelease].reportingYear,
    [2f_PollutantRelease].pollutantCode,
    [2f_PollutantRelease].pollutantName,
    [2f_PollutantRelease].medium,
    [2f_PollutantRelease].totalPollutantQuantityKg,
    [2f_PollutantRelease].AccidentalPollutantQuantityKG,
    [2f_PollutantRelease].methodCode,
    [2f_PollutantRelease].methodName
    FROM
    (
        2f_PollutantRelease
        INNER JOIN 2_ProductionFacility ON
        [2f_PollutantRelease].Facility_INSPIRE_ID =
        [2_ProductionFacility].Facility_INSPIRE_ID
    )
    WHERE
    [2_ProductionFacility].countryCode='{conf.country_code}' AND
    [2_ProductionFacility].facilityType='EPRTR';
    '''
)

sql_waste_transfers = (
    f'''
    SELECT
    [2h_OffSiteWasteTransfer].Facility_INSPIRE_ID,
    [2h_OffSiteWasteTransfer].reportingYear,
    [2_ProductionFacility].nameOfFeature,
    [2_ProductionFacility].mainActivityCode,
    [2_ProductionFacility].mainActivityName,
    [2_ProductionFacility].city,
    [2h_OffSiteWasteTransfer].wasteClassificationCode,
    [2h_OffSiteWasteTransfer].wasteClassificationName,
    [2h_OffSiteWasteTransfer].wasteTreatmentCode,
    [2h_OffSiteWasteTransfer].wasteTreatmentName,
    [2h_OffSiteWasteTransfer].totalWasteQuantityTNE,
    [2h_OffSiteWasteTransfer].methodCode,
    [2h_OffSiteWasteTransfer].methodName,
    [2h_OffSiteWasteTransfer].nameOfReceiver,
    [2h_OffSiteWasteTransfer].ReceivingSite_city,
    [2h_OffSiteWasteTransfer].ReceivingSite_postalCode,
    [2h_OffSiteWasteTransfer].ReceivingSite_countryName
    FROM 2_ProductionFacility
    INNER JOIN 2h_OffSiteWasteTransfer ON
        [2_ProductionFacility].[Facility_INSPIRE_ID] =
            [2h_OffSiteWasteTransfer].[Facility_INSPIRE_ID]
    WHERE
    [2_ProductionFacility].countryCode='{conf.country_code}' AND
    [2_ProductionFacility].facilityType='EPRTR';
    '''
)
