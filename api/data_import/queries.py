from data_import.conf import conf

sql_waste_transfers = (
    f'''
    SELECT
    [2h_OffSiteWasteTransfer].Facility_INSPIRE_ID,
    [2h_OffSiteWasteTransfer].reportingYear,
    [2_ProductionFacility].nameOfFeature,
    [2_ProductionFacility].mainActivityCode,
    [2_ProductionFacility].mainActivityName,
    [2_ProductionFacility].pointGeometryLon,
    [2_ProductionFacility].pointGeometryLat,
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
