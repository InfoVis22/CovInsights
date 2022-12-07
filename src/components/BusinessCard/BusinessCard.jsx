// IMPORTS
import './BusinessCard.scss'

const BusinessCard = ({ name, infoText, imageName }) => {

    // RENDER

    return (
        <div className="BusinessCard">
                <img className="Avatar"
                    src={`/images/${imageName}`}
                    alt={`Image of ${name}`}/>

                <div className="Heading">
                    <h2>{name}</h2>
                    <p>{infoText}</p>
                </div>
        </div>
    )
}

export default BusinessCard
