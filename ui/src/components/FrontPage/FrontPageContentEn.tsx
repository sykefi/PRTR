export const FrontPageContentEn = () => {
  return (
    <>
      <h3>Information</h3>
      <p>
        This web site presents information on releases to air and water from
        industrial and agricultural facilities in Finland. The information is
        retreived from{' '}
        <a
          href="https://www.eea.europa.eu/data-and-maps/data/industrial-reporting-under-the-industrial-3"
          target="blank">
          PRTR
        </a>{' '}
        (Pollutant Release and Transfer Register) maintained by the European
        Environment Agency. 
      </p>
      <p>
        Disclosure of the information to the European Comission is regulated by
        the Regulation No 166/2006 and Commission Implementing Decision
        2019/1741. Only data included in the above mentioned PRTR database are
        presented. At the moment the presentation includes data since the
        reporting year 2017.
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
      <p>
        Please read through{' '}
        <a href="Käyttöehdot.pdf" target="blank">
          the terms of service
        </a>{' '}
        before using the service.
      </p>

      <p>
        Finnish Environment Institute has built the website on the request from
        the Ministry of the Environment. Feedback on data and other content can
        be sent to supervising authorities (
        <a href="https://www.ely-keskus.fi/ympariston-tilan-seuranta">
          ELY-keskukset
        </a>
        ). Feedback on the technical functions or improvement proposals can be
        sent to <a href="mailto:PRTR@syke.fi">PRTR@syke.fi</a>.
      </p>

      <p>
        <a href="Palveluseloste.pdf" target="blank">
          Service proxy
        </a>
      </p>
    </>
  )
}
