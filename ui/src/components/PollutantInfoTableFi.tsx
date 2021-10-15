import styled from 'styled-components'

const TableStyleWrapper = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  padding: 10px;
  padding-bottom: 30px;
  max-width: 100%;
  overflow: auto;

  h2 {
    font-size: 18px;
    font-weight: 600;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-top: 10px;
  }

  table,
  th,
  td {
    border: 1px solid black;
  }
  table {
    margin-bottom: 20px;
  }

  .pollutantTableTitleRow {
    font-weight: 600;
  }

  li {
    margin-top: 5px;
  }
`

export const PollutantInfoTableFi = () => {
  return (
    <TableStyleWrapper>
      <div className="pollutantTableContent">
        <h2>PRTR-raportoinnin epäpuhtaudet ja niiden raportointikynnysarvot</h2>

        <table cellSpacing="0">
          <tbody>
            <tr className="pollutantTableTitleRow">
              <td>N:o</td>
              <td>CAS- numero</td>
              <td>Epäpuhtaus</td>
              <td>Kynnysarvo, joka koskee päästöjä (1 sarake)</td>
              <td></td>
              <td></td>
              <td>
                Kynnysarvo epäpuhtauk- sien siirroille laitoskoko- naisuuden
                ulkopuolelle (2 sarake) kg/vuosi
              </td>
              <td>
                Valmistusta, käsittelyä tai käyttöä koskeva Kynnysarvo (3
                sarake) kg/vuosi
              </td>
              <td></td>
            </tr>
            <tr className="pollutantTableTitleRow">
              <td></td>
              <td></td>
              <td></td>
              <td>ilmaan (1a sarake) kg/vuosi</td>
              <td>veteen (1b sarake) kg/vuosi</td>
              <td>maahan (1c sarake) kg/vuosi</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>1</td>
              <td>74-82-8</td>
              <td>Metaani (CH4)</td>
              <td>100000</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>*</td>
              <td></td>
            </tr>
            <tr>
              <td>2</td>
              <td>630-08-0</td>
              <td>Hiilimonoksidi (CO)</td>
              <td>500000</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>*</td>
              <td></td>
            </tr>
            <tr>
              <td>3</td>
              <td>124-38-9</td>
              <td>Hiilidioksidi (CO2)</td>
              <td>100 milj.</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>*</td>
              <td></td>
            </tr>
            <tr>
              <td>4</td>
              <td></td>
              <td>Fluorihiilivedyt (HFC:t)</td>
              <td>100</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>*</td>
              <td></td>
            </tr>
            <tr>
              <td>5</td>
              <td>10024-97-2</td>
              <td>Dityppioksidi (N2O)</td>
              <td>10000</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>*</td>
              <td></td>
            </tr>
            <tr>
              <td>6</td>
              <td>7664-41-7</td>
              <td>Ammoniakki (NH3)</td>
              <td>10000</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>7</td>
              <td></td>
              <td>
                Muut haihtuvat orgaaniset yhdisteet kuin metaani
                (NMVOC-yhdisteet)
              </td>
              <td>100000</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>*</td>
              <td></td>
            </tr>
            <tr>
              <td>8</td>
              <td></td>
              <td>Typen oksidit (NOx/NO2)</td>
              <td>100000</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>*</td>
              <td></td>
            </tr>
            <tr>
              <td>9</td>
              <td></td>
              <td>Perfluorihiilivedyt (PFC:t)</td>
              <td>100</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>*</td>
              <td></td>
            </tr>
            <tr>
              <td>10</td>
              <td>2551-62-4</td>
              <td>Rikkiheksafluoridi (SF6)</td>
              <td>50</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>*</td>
              <td></td>
            </tr>
            <tr>
              <td>11</td>
              <td></td>
              <td>Rikin oksidit (SOx/SO2)</td>
              <td>150000</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>*</td>
              <td></td>
            </tr>
            <tr>
              <td>12</td>
              <td></td>
              <td>Kokonaistyppi</td>
              <td>-</td>
              <td>50000</td>
              <td>50000</td>
              <td>10000</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>13</td>
              <td></td>
              <td>Kokonaisfosfori</td>
              <td>-</td>
              <td>5000</td>
              <td>5000</td>
              <td>10000</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>14</td>
              <td></td>
              <td>Osittain halogenoidut kloorifluorihiilivedyt (HCFC:t)</td>
              <td>1</td>
              <td>-</td>
              <td>-</td>
              <td>100</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>15</td>
              <td></td>
              <td>Kloorifluorihiilivedyt (CFC:t)</td>
              <td>1</td>
              <td>-</td>
              <td>-</td>
              <td>100</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>16</td>
              <td></td>
              <td>Halonit</td>
              <td>1</td>
              <td>-</td>
              <td>-</td>
              <td>100</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>17</td>
              <td>7440-38-2</td>
              <td>Arseeni, arseeniyhdisteet (As)</td>
              <td>20</td>
              <td>5</td>
              <td>5</td>
              <td>50</td>
              <td>50</td>
              <td></td>
            </tr>
            <tr>
              <td>18</td>
              <td>7440-43-9</td>
              <td>Kadmium, kadmiumyhdisteet (Cd)</td>
              <td>10</td>
              <td>5</td>
              <td>5</td>
              <td>5</td>
              <td>5</td>
              <td></td>
            </tr>
            <tr>
              <td>19</td>
              <td>7440-47-3</td>
              <td>Kromi, kromiyhdisteet (Cr)</td>
              <td>100</td>
              <td>50</td>
              <td>50</td>
              <td>200</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>20</td>
              <td>7440-50-8</td>
              <td>Kupari, kupariyhdisteet (Cu)</td>
              <td>100</td>
              <td>50</td>
              <td>50</td>
              <td>500</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>21</td>
              <td>7439-97-6</td>
              <td>Elohopea, elohopeayhdisteet (Hg)</td>
              <td>10</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>5</td>
              <td></td>
            </tr>
            <tr>
              <td>22</td>
              <td>7440-02-0</td>
              <td>Nikkeli, nikkeliyhdisteet (Ni)</td>
              <td>50</td>
              <td>20</td>
              <td>20</td>
              <td>500</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>23</td>
              <td>7439-92-1</td>
              <td>Lyijy, lyijy-yhdisteet (Pb)</td>
              <td>200</td>
              <td>20</td>
              <td>20</td>
              <td>50</td>
              <td>50</td>
              <td></td>
            </tr>
            <tr>
              <td>24</td>
              <td>7440-66-6</td>
              <td>Sinkki, sinkkiyhdisteet (Zn)</td>
              <td>200</td>
              <td>100</td>
              <td>100</td>
              <td>1000</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>25</td>
              <td>15972-60-8</td>
              <td>Alakloori</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>26</td>
              <td>309-00-2</td>
              <td>Aldriini</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td></td>
            </tr>
            <tr>
              <td>27</td>
              <td>1912-24-9</td>
              <td>Atratsiini</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>28</td>
              <td>57-74-9</td>
              <td>Klordaani</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td></td>
            </tr>
            <tr>
              <td>29</td>
              <td>143-50-0</td>
              <td>Klordekoni</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td></td>
            </tr>
            <tr>
              <td>30</td>
              <td>470-90-6</td>
              <td>Klorfenvinfossi</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>31</td>
              <td>85535-84-8</td>
              <td>Kloorialkaanit, C10-C13</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>10</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>32</td>
              <td>2921-88-2</td>
              <td>Klorpyrifossi</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>33</td>
              <td>50-29-3</td>
              <td>DDT</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td></td>
            </tr>
            <tr>
              <td>34</td>
              <td>107-06-2</td>
              <td>1,2-dikloorietaani (EDC)</td>
              <td>1000</td>
              <td>10</td>
              <td>10</td>
              <td>100</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>35</td>
              <td>75-09-2</td>
              <td>Dikloorimetaani (DCM)</td>
              <td>1000</td>
              <td>10</td>
              <td>10</td>
              <td>100</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>36</td>
              <td>60-57-1</td>
              <td>Dieldriini</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td></td>
            </tr>
            <tr>
              <td>37</td>
              <td>330-54-1</td>
              <td>Diuroni</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>38</td>
              <td>115-29-7</td>
              <td>Endosulfaani</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>39</td>
              <td>72-20-8</td>
              <td>Endriini</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td></td>
            </tr>
            <tr>
              <td>40</td>
              <td></td>
              <td>Halogenoidut orgaaniset yhdisteet (AOX)</td>
              <td>-</td>
              <td>1000</td>
              <td>1000</td>
              <td>1000</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>41</td>
              <td>76-44-8</td>
              <td>Heptakloori</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td></td>
            </tr>
            <tr>
              <td>42</td>
              <td>118-74-1</td>
              <td>Heksaklooribentseeni (HCB)</td>
              <td>10</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td></td>
            </tr>
            <tr>
              <td>43</td>
              <td>87-68-3</td>
              <td>Heksaklooributadieeni (HCBD)</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>44</td>
              <td>608-73-1</td>
              <td>1,2,3,4,5,6-heksakloorisyklo- heksaani (HCH)</td>
              <td>10</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>10</td>
              <td></td>
            </tr>
            <tr>
              <td>45</td>
              <td>58-89-9</td>
              <td>Lindaani</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td></td>
            </tr>
            <tr>
              <td>46</td>
              <td>2385-85-5</td>
              <td>Mireksi</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td></td>
            </tr>
            <tr>
              <td>47</td>
              <td></td>
              <td>PCDD + PCDF (dioksiinit + furaanit) (TEQ)</td>
              <td>0.001</td>
              <td>0.001</td>
              <td>0.001</td>
              <td>0.001</td>
              <td>0.001</td>
              <td></td>
            </tr>
            <tr>
              <td>48</td>
              <td>608-93-5</td>
              <td>Pentaklooribentseeni</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>50</td>
              <td></td>
            </tr>
            <tr>
              <td>49</td>
              <td>87-86-5</td>
              <td>Pentakloorifenoli (PCP)</td>
              <td>10</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>50</td>
              <td>1336-36-3</td>
              <td>Polyklooratut bifenyylit (PCB:t)</td>
              <td>0.1</td>
              <td>0.1</td>
              <td>0.1</td>
              <td>1</td>
              <td>50</td>
              <td></td>
            </tr>
            <tr>
              <td>51</td>
              <td>122-34-9</td>
              <td>Simatsiini</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>52</td>
              <td>127-18-4</td>
              <td>Tetrakloorietyleeni (PER)</td>
              <td>2000</td>
              <td>-</td>
              <td>-</td>
              <td>1000</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>53</td>
              <td>56-23-5</td>
              <td>Tetrakloorimetaani (TCM)</td>
              <td>100</td>
              <td>-</td>
              <td>-</td>
              <td>1000</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>54</td>
              <td>12002-48-1</td>
              <td>Triklooribentseenit (TCB)</td>
              <td>10</td>
              <td>-</td>
              <td>-</td>
              <td>1000</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>55</td>
              <td>71-55-6</td>
              <td>1,1,1-trikloorietaani</td>
              <td>100</td>
              <td>-</td>
              <td>-</td>
              <td>1000</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>56</td>
              <td>79-34-5</td>
              <td>1,1,2,2-tetrakloorietaani</td>
              <td>50</td>
              <td>-</td>
              <td>-</td>
              <td>1000</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>57</td>
              <td>79-01-6</td>
              <td>Trikloorietyleeni</td>
              <td>2000</td>
              <td>-</td>
              <td>-</td>
              <td>1000</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>58</td>
              <td>67-66-3</td>
              <td>Trikloorimetaani</td>
              <td>500</td>
              <td>-</td>
              <td>-</td>
              <td>1000</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>59</td>
              <td>8001-35-2</td>
              <td>Toksafeeni</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td></td>
            </tr>
            <tr>
              <td>60</td>
              <td>75-01-4</td>
              <td>Vinyylikloridi</td>
              <td>1000</td>
              <td>10</td>
              <td>10</td>
              <td>100</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>61</td>
              <td>120-12-7</td>
              <td>Antraseeni</td>
              <td>50</td>
              <td>1</td>
              <td>1</td>
              <td>50</td>
              <td>50</td>
              <td></td>
            </tr>
            <tr>
              <td>62</td>
              <td>71-43-2</td>
              <td>Bentseeni</td>
              <td>1000</td>
              <td>200 BTEX a/</td>
              <td>200 BTEX a/</td>
              <td>2 000 BTEX a/</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>63</td>
              <td></td>
              <td>Bromatut difenyylieetterit (PBDE)</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>64</td>
              <td></td>
              <td>Nonyylifenolietoksylaatit (NP/NPE:t) ja vastaavat aineet</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>65</td>
              <td>100-41-4</td>
              <td>Etyylibentseeni</td>
              <td>-</td>
              <td>200 BTEX a/</td>
              <td>200 BTEX a/</td>
              <td>2 000 BTEX a/</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>66</td>
              <td>75-21-8</td>
              <td>Etyleenioksidi</td>
              <td>1000</td>
              <td>10</td>
              <td>10</td>
              <td>100</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>67</td>
              <td>34123-59-6</td>
              <td>Isoproturoni</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>68</td>
              <td>91-20-3</td>
              <td>Naftaleeni</td>
              <td>100</td>
              <td>10</td>
              <td>10</td>
              <td>100</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>69</td>
              <td></td>
              <td>Orgaaniset tinayhdisteet (kokonais-Sn)</td>
              <td>-</td>
              <td>50</td>
              <td>50</td>
              <td>50</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>70</td>
              <td>117-81-7</td>
              <td>Di-2-etyyliheksyyliftalaatti (DEHP)</td>
              <td>10</td>
              <td>1</td>
              <td>1</td>
              <td>100</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>71</td>
              <td>108-95-2</td>
              <td>Fenolit (kokonais-C)</td>
              <td>-</td>
              <td>20</td>
              <td>20</td>
              <td>200</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>72</td>
              <td></td>
              <td>Polysykliset aromaattiset hiilivedyt (PAH)b/</td>
              <td>50</td>
              <td>5</td>
              <td>5</td>
              <td>50</td>
              <td>50</td>
              <td></td>
            </tr>
            <tr>
              <td>73</td>
              <td>108-88-3</td>
              <td>Tolueeni</td>
              <td>-</td>
              <td>200 BTEX a/</td>
              <td>200 BTEXa/</td>
              <td>2 000 BTEX a/</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>74</td>
              <td></td>
              <td>Tributyylitina, tributyylitinayhdisteet</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>75</td>
              <td></td>
              <td>Trifenyylitina, trifenyylitinayhdisteet</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>76</td>
              <td></td>
              <td>
                Orgaanisen hiilen kokonaismäärä (TOC) (kokonais-C tai COD/3)
              </td>
              <td>-</td>
              <td>50000</td>
              <td>-</td>
              <td>-</td>
              <td>**</td>
              <td></td>
            </tr>
            <tr>
              <td>77</td>
              <td>1582-09-8</td>
              <td>Trifluraliini</td>
              <td>-</td>
              <td>1</td>
              <td>1</td>
              <td>5</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>78</td>
              <td>1330-20-7</td>
              <td>Ksyleenit</td>
              <td>-</td>
              <td>200 BTEXa/</td>
              <td>200 BTEXa/</td>
              <td>2 000 BTEX a/</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>79</td>
              <td></td>
              <td>Kloridit (kokonais-Cl)</td>
              <td>-</td>
              <td>2 milj.</td>
              <td>2 milj.</td>
              <td>2 milj.</td>
              <td>10 000c/</td>
              <td></td>
            </tr>
            <tr>
              <td>80</td>
              <td></td>
              <td>Kloori ja epäorgaaniset yhdisteet (HCl)</td>
              <td>10000</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>81</td>
              <td>1332-21-4</td>
              <td>Asbesti</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>10</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>82</td>
              <td></td>
              <td>Syanidit (kokonais-CN)</td>
              <td>-</td>
              <td>50</td>
              <td>50</td>
              <td>500</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>83</td>
              <td></td>
              <td>Fluoridit (kokonais-F)</td>
              <td>-</td>
              <td>2000</td>
              <td>2000</td>
              <td>10000</td>
              <td>10 000c/</td>
              <td></td>
            </tr>
            <tr>
              <td>84</td>
              <td></td>
              <td>Fluori ja epäorgaaniset yhdisteet (HF)</td>
              <td>5000</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>85</td>
              <td>74-90-8</td>
              <td>Syaanivety (HCN)</td>
              <td>200</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>10000</td>
              <td></td>
            </tr>
            <tr>
              <td>86</td>
              <td></td>
              <td>Hiukkaset (PM10)</td>
              <td>50000</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>*</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <h3>Selitykset:</h3>
        <li>
          Epäpuhtauden tunnisteena toimii sen CAS-numero eli Chemical Abstracts
          Service -numero.
        </li>

        <li>
          Sarakkeessa 1 on esitetty 7 artiklan 1 kappaleen a kohdan (i) ja (iv)
          kohdissa tarkoitetut Kynnysarvot. Jos tietyssä alasarakkeessa (joka
          koskee päästöjä ilmaan, veteen tai maahan) oleva Kynnysarvo ylittyy,
          kyseisestä laitoskokonaisuudesta on ilmoitettava epäpuhtauksien
          päästöt tai jätevedenkäsittelyyn tarkoitetussa jätevedessä olevien
          epäpuhtauksien osalta niiden siirrot kyseisessä alasarakkeessa
          tarkoitettuun ympäristöön, jos sopimuspuoli on valinnut 7 artiklan 1
          kappaleen a kohdan mukaisen ilmoittamisjärjestelmän.
        </li>

        <li>
          Sarakkeessa 2 on esitetty 7 artiklan 1 kappaleen a kohdan i kohdassa
          tarkoitetut kynnys-arvot. Jos jokin tämän sarakkeen Kynnysarvoista
          ylittyy tietyn epäpuhtauden osalta, kyseisen epäpuhtauden siirrosta
          kyseisen laitoskokonaisuuden ulkopuolelle on ilmoitettava, jos
          sopimuspuoli on valinnut 7 artiklan 1 kappaleen a kohdan ii kohdan
          mukaisen ilmoittamisjärjestelmän.Sarakkeessa 3 on esitetty 7 artiklan
          1 kappaleen b kohdassa tarkoitetut Kynnysarvot. Jos jokin tämän
          sarakkeen Kynnysarvoista ylittyy tietyn epäpuhtauden osalta, kyseisen
          epäpuhtauden päästöt ja siirrot kyseisen laitoskokonaisuuden
          ulkopuolelle on ilmoitettava, jos sopimuspuoli on valinnut 7 artiklan
          1 kappaleen b kohdan mukaisen ilmoittamisjärjestelmän.
        </li>

        <li>
          Vaakaviiva (-) osoittaa, että kyseinen parametri ei aiheuta
          ilmoitusvaatimusta.
        </li>

        <li>
          Asteriski (*) tarkoittaa, että kyseisen epäpuhtauden osalta on
          käytettävä sarakkeen 1a päästökynnystä valmistusta, käsittelyä tai
          käyttöä koskevan Kynnysarvon asemesta.
        </li>

        <li>
          Kaksi asteriskia (**) tarkoittaa, että kyseisen epäpuhtauden osalta on
          käytettävä sarakkeen 1b päästökynnystä valmistusta, käsittelyä tai
          käyttöä koskevan Kynnysarvon asemesta.
        </li>

        <h3>Alaviitteet:</h3>

        <li>
          a/ Yksittäiset epäpuhtaudet on ilmoitettava, jos BTEX-kynnys
          (bentseenin, tolueenin, etyylibentseenin ja ksyleenin summaparametri)
          ylittyy.
        </li>

        <li>
          b/ Seuraavat polysykliset aromaattiset hiilivedyt (PAH:t) on
          mitattava: bentso(a)pyreeni (50- 32-8), bentso(b)fluoranteeni
          (205-99-2), bentso(k)fluoranteeni (207-08-9), indeno(1,2,3-cd)pyreeni
          (193-39-5) (perustuu valtiosta toiseen tapahtuvaa ilman epäpuhtauksien
          kaukokulkeutumista koskevaan yleissopimukseen liittyvään pysyviä
          orgaanisia yhdisteitä koskevaan pöytäkirjaan).
        </li>

        <li>c/ Epäorgaanisina yhdisteinä.</li>
      </div>
    </TableStyleWrapper>
  )
}
