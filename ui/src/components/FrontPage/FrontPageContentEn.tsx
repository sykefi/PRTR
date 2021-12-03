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
      <p>You can search information using the following functions:</p>
      <p>
        <li>
          <b>Facilities</b> returns information by facilities, activities or
          location. 
        </li>
        <li>
          <b>Releases to air</b> returns air emissions from PRTR facilities in
          table format. 
        </li>
        <li>
          <b>Releases to water</b> returns releases to waterbodies. 
        </li>
        <li>
          <b>Waste transfers</b> returns both domestic and transboundary waste
          transfers. 
        </li>
      </p>
      <p>Please read through the terms of service before using the service.</p>
    </>
  )
}
