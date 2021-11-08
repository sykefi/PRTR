export const FrontPageContentEn = () => {
  return (
    <>
      <h3>Information</h3>
      <p>
        This web site presents information on releases to air and water from
        industrial and agricultural facilities in Finland. The information is
        retreived from PRTR (Pollutant Release and Transfer Register) maintained
        by the European Environment Agency. 
      </p>
      <p>
        Disclosure of the information to the European Comission is regulated by
        the Regulation No 166/2006 and Commission Implementing Decision
        2019/1741. Currently presented information is retreived from the fourth
        version of the database published in{' '}
        <a
          href="https://www.eea.europa.eu/data-and-maps/data/industrial-reporting-under-the-industrial-3"
          target="blank">
          {' '}
          March 2021{' '}
        </a>
        . Only data included in the above mentioned PRTR database are presented.
        At the moment the presentation includes data since the reporting year
        2017.
      </p>
      <h3>Search options</h3>
      <p>You can search information using the following functions:</p>
      <p>
        <li>
          <b>Facility, activity, location</b> returns information by facilities,
          activities or location. 
        </li>
        <li>
          <b>Päästöt ilmaan</b> näyttää päästötietojaan raportoineiden
          PRTR-laitosten päästötietoja ilmaan taulukkomuodossa. 
        </li>
        <li>
          <b>Wastewaters</b> filters releases to waterbodies. 
        </li>
        <li>
          <b>On page Waste transfers</b>-total amounts are presented for wastes
          transferred in the country as well as for transboundary waste
          transfers. 
        </li>
      </p>
      <p>
        Please read through the terms of  service before using
        the service.
      </p>
    </>
  )
}
