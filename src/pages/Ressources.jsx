import React from 'react'


const Ressources = () => {
  return (
    <div className='Page About'>
      <h1>Unsere Datenquellen</h1>
      <a href="https://www-genesis.destatis.de/genesis//online?operation=table&code=52411-0004&bypass=true&levelindex=0&levelid=1671466031511#abreadcrumb">
        <h2>Insolvenzen im Gastgewerbe in Deutschland gesamt</h2>
      </a><br />
      <a href="https://www.statistischebibliothek.de/mir/receive/DESerie_mods_00000215">
        <h2>Insolvenzen im Gastgewerbe in Deutschland nach Subbranchen</h2>
      </a><br />
      <a href="https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Inzidenz-Tabellen.html">
        <h2>Corona Inzidenzen in Deutschland seit 2020</h2>
      </a><br />
      <a href="https://www-genesis.destatis.de/genesis//online?operation=table&code=45342-0001&bypass=true&levelindex=0&levelid=1667389597319#abreadcrumb">
        <h2>Betriebs- und volkswirtschaftliche Kennzahlen im Gastgewerbe in Deutschland</h2>
      </a><br />
      <a href="https://statistik.arbeitsagentur.de/SiteGlobals/Forms/Suche/Einzelheftsuche_Formular.html;jsessionid=C4ABF408301BFF733C01B9D8D9DFDEFF?gtp=15084_list%253D8&topic_f=kurzarbeit-endg">
        <h2>Kurzarbeit im Gastgewerbe in Deutschland</h2>
      </a>
    </div>
  )
}

export default Ressources