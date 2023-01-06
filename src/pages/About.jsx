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

      <div id="gant">
        <img src="/images/gant.jpg" alt="Gant Chart" />
      </div>

      <div className="SourceSpecifications">
        <h1>Sources</h1>
        <table>
            <SourceSpec sourceDescription={"Insolvenzen im Gastgewerbe in Deutschland gesamt"} sourceLink={"https://www-genesis.destatis.de/genesis//online?operation=table&code=52411-0004&bypass=true&levelindex=0&levelid=1671466031511#abreadcrumb"} lastTimeVisited={"06.01.2023"}/>
            <SourceSpec sourceDescription={"Insolvenzen im Gastgewerbe in Deutschland nach Subbranchen"} sourceLink={"https://www.statistischebibliothek.de/mir/receive/DESerie_mods_00000215"} lastTimeVisited={"06.01.2023"}/>
            <SourceSpec sourceDescription={"Corona Inzidenzen in Deutschland seit 2020"} sourceLink={"https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Inzidenz-Tabellen.html"} lastTimeVisited={"06.01.2023"}/>
            <SourceSpec sourceDescription={"Betriebs- und volkswirtschaftliche Kennzahlen im Gastgewerbe in Deutschland"} sourceLink={"https://www-genesis.destatis.de/genesis//online?operation=table&code=45342-0001&bypass=true&levelindex=0&levelid=1667389597319#abreadcrumb"} lastTimeVisited={"06.01.2023"}/>
            <SourceSpec sourceDescription={"Kurzarbeit im Gastgewerbe in Deutschland"} sourceLink={"https://statistik.arbeitsagentur.de/SiteGlobals/Forms/Suche/Einzelheftsuche_Formular.html;jsessionid=C4ABF408301BFF733C01B9D8D9DFDEFF?gtp=15084_list%253D8&topic_f=kurzarbeit-endg"} lastTimeVisited={"06.01.2023"}/>
        </table>
      </div>
    </div>
  )
}

export default About