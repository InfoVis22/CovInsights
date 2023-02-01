import React from 'react'
import BusinessCard from '../components/BusinessCard/BusinessCard'
import SourceSpec from '../components/SourceSpec/SourceSpec'
import './About.scss'

const About = () => {
  return (
    <div className='Page About'>
      <h1>Unser Team</h1>
      <div className="Cards">
        <BusinessCard name={"Manuel Totzauer"}
          infoText={"Ich studiere MMT an der LMU München. In meiner Freizeit reise ich gerne, spiele Schach und Akkordeon."}
          imageName={"manuelAvatar.jpeg"} />
        <BusinessCard name={"Sofie Henghuber"}
          infoText={"Ich bin Sofie, 27 Jahre alt und studiere Informatik im Master. Mein Schwerpunkt liegt im Quantencomputing und Machine Learning. In meiner Freizeit studiere ich nebenbei noch Schauspiel."}
          imageName={"sofieAvatar.jpeg"} />
        <BusinessCard name={"Lennard Greve"}
          infoText={"Ich bin Lennard, 24, studiere den Master of Management and Digital Technologies an der LMU.\nFun Fact: Ich habe vor vielen Jahren einen der größten europäischen Minecraft Server gegründet."}
          imageName={"lennardAvatar.jpeg"} />
        <BusinessCard name={"Max Brandmaier"}
          infoText={"Ich studiere MMT an der LMU München. Vor meiner akademisch Karriere bin ich mit meiner Tanz-Crew auf verschiedene HipHop Turniere in ganz Deutschland gegangen."}
          imageName={"maxiAvatar.jpeg"} />
        <BusinessCard name={"Alexander Welling"}
          infoText={"Ich bin Alex und studiere Informatik an der LMU München im Master. In meiner Freizeit schreibe ich gerne About Pages und Masterarbeiten"}
          imageName={"alexAvatar.jpg"} />
      </div>

      <div className="Sources">
        <h1>Sources</h1>

        <div className='sourcesList'>
          <h2>Statistisches Bundesamt</h2>
          <p>45342-0001: Unternehmen, Beschäftigte, Umsatz und weitere betriebs- und
            volkswirtschaftliche Kennzahlen im Gastgewerbe</p>
          <p className='lastVisit'>Abgerufen am: 17.11.2023, <a href='https://www-genesis.destatis.de/genesis//online?operation=table&code=45342-0001&bypass=true&levelindex=0&levelid=1675257245756#abreadcrumb' target="_blank">Link</a></p>

          <p>45213-0002: Beschäftigte im Gastgewerbe, Deutschland, Monate, Wirtschaftszweige</p>
          <p className='lastVisit'>Abgerufen am: 10.12.2023, <a href='https://www-genesis.destatis.de/genesis//online?operation=table&code=45213-0002&bypass=true&levelindex=1&levelid=1675257314387#abreadcrumb' target="_blank">Link</a></p>

          <p>45213-0004: Umsatz im Gastgewerbe: Deutschland, Monate, Wirtschaftszweige</p>
          <p className='lastVisit'>Abgerufen am: 10.12.2023, <a href='https://www-genesis.destatis.de/genesis//online?operation=table&code=45213-0004&bypass=true&levelindex=1&levelid=1675257314387#abreadcrumb' target="_blank">Link</a></p>

          <p>52411-0004: Insolvenzen im Gastgewerbe in Deutschland gesamt</p>
          <p className='lastVisit'>Abgerufen am: 19.12.2023, <a href='https://www-genesis.destatis.de/genesis//online?operation=table&code=52411-0004&bypass=true&levelindex=0&levelid=1671466031511#abreadcrumb' target="_blank">Link</a></p>


          <h2>Statistische Ämter des Bundes und der Länder</h2>
          <p>Insolvenzen im Gastgewerbe in Deutschland nach Subbranchen</p>
          <p className='lastVisit'>Abgerufen am: 06.01.2023, <a href='https://www.statistischebibliothek.de/mir/receive/DESerie_mods_00000215' target="_blank">Link</a></p>


          <h2>Robert Koch-Institut</h2>
          <p>Corona 7-Tage Inzidenzen in Deutschland</p>
          <p className='lastVisit'>Abgerufen am: 10.12.2023, <a href='https://github.com/robert-koch-institut/COVID-19_7-Tage-Inzidenz_in_Deutschland/blob/main/COVID-19-Faelle_7-Tage-Inzidenz_Deutschland.csv' target="_blank">Link</a></p>


          <h2>Bundesagentur für Arbeit</h2>
          <p>Kurzarbeit im Gastgewerbe in Deutschland</p>
          <p className='lastVisit'>Abgerufen am: 06.01.2023, <a href='https://statistik.arbeitsagentur.de/SiteGlobals/Forms/Suche/Einzelheftsuche_Formular.html;jsessionid=C4ABF408301BFF733C01B9D8D9DFDEFF?gtp=15084_list%253D8&topic_f=kurzarbeit-endg' target="_blank">Link</a></p>

        </div>


        <div id="gant">
          <img src="/images/Gant.png" alt="Gant Chart" />
        </div>

      </div>
    </div>
  )
}

export default About