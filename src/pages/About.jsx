import React from 'react'
import BusinessCard from '../components/BusinessCard/BusinessCard'
import './About.scss'

const About = () => {
  return (
    <div className='Page About'>
      <h1>Unser Team</h1>
      <div className="Cards">
        <BusinessCard name={"Manuel Totzauer"}
          infoText={"In meiner Freizeit reise ich gerne, spiele Schach und Akkordeon."}
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
    </div>
  )
}

export default About