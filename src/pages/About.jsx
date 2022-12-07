import React from 'react'
import BusinessCard from '../components/BusinessCard/BusinessCard'

const About = () => {
  return (
    <div>
        <BusinessCard name={"Manuel Totzauer"}
        infoText={"In meiner Freizeit reise ich gerne, spiele Schach und Akkordeon."}
        imageName={"manuelAvatar.jpeg"}/>
        <BusinessCard name={"Sofie Henghuber"}
        infoText={"Ich bin Sofie, 27 Jahre alt und studiere Informatik im Master. Mein Schwerpunkt liegt im Quantencomputing und Machine Learning. In meiner Freizeit studiere ich nebenbei noch Schauspiel."}
        imageName={"sofieAvatar.jpeg"}/>
        <BusinessCard name={"Lennard Greve"}
        infoText={"Ich bin Lennard, 24, studiere den Master of Management and Digital Technologies an der LMU.\nFun Fact: Ich habe vor vielen Jahren einen der größten europäischen Minecraft Server gegründet."}
        imageName={"lennardAvatar.jpeg"}/>
        <BusinessCard name={"Maximilian Brandmaier"}
        infoText={"Fun Fact: Max studiert MMT an der LMU München, vor seiner akademisch Karriere ist er mit seiner Tanz-Crew auf verschiedene HipHop Turniere in ganz Deutschland gegangen."}
        imageName={"maxiAvatar.jpeg"}/>
        <BusinessCard name={"Alexander Welling"}
        infoText={"Ich bin Alex und studiere Informatik an der LMU München im Master. In meiner Freizeit schreibe ich gerne About Pages und Masterarbeiten"}
        imageName={"alexAvatar.jpg"}/>
    </div>
  )
}

export default About