export const FrontPageContentSv = () => {
  return (
    <>
      <h3>Information</h3>
      <p>
        På sidan visas information om utsläpp till luft och vatten samt om
        avfallstransporter från finska industrianläggningar och
        lantbruksföretag. Uppgifterna är från PRTR registret som underhålls av 
        Europeiska miljlbyrån (EEA).
      </p>
      <p>
        Företag som bedriver miljöfarligt verksamhet har rapporteringsskyldighet
        enligt EG-förordningen 166/2006 om utsläpp och avfallstransporter.
        Uppgifterna samlas i Europeiska PRTR registret (Pollutant Release and
        Transfer Register). Information som presenteras är från den fjärde
        versionen som publicerats i 
        <a
          href="https://www.eea.europa.eu/data-and-maps/data/industrial-reporting-under-the-industrial-3"
          target="blank">
          {' '}
          March 2021{' '}
        </a>{' '}
        . Endast uppgifter som ingår i det ovannämnda PRTR registret
        presenteras. För tillfället presenteras uppgifterna sedan
        rapporteringsåret 2017.
      </p>
      <h3>Sökalternativ</h3>
      <p>Du kan söka databasen med följande funktioner:</p>
      <p>
        <li>
          <b>Anläggning, verksamhet, ort</b> filtrerar information efter
          anläggning, verksamhet eller ort. 
        </li>
        <li>
          <b>Utsläpp till luft</b> filtrerar PRTR anläggningarnas utsläpp till
          luft i tabellformat 
        </li>
        <li>
          <b>Utsläpp till vatten</b> filtrerar PRTR anläggningarnas utsläpp till
          vatten.
        </li>
        <li>
          <b>Avfallstransporter</b> filtrerar uppgifter om inhemska och
          gränsöverskridande avfallstransporter 
        </li>
      </p>
      <p>
        Vänligen läs användarvillkor  innan du använder tjänsten.
      </p>
    </>
  )
}
