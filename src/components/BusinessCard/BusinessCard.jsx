// IMPORTS
import './BusinessCard.scss'

const BusinessCard = ({ name, infoText, imageName }) => {

    // RENDER

    return (
        <div className="Visual">
            <table>
                <tr>
                    <td>
                        <img className="Avatar"
                            src={`/images/${imageName}`}
                            alt={`Image of ${name}`}/>
                    </td>
                    <td>
                        <div className="Heading">
                            <h2>{name}</h2>
                            <p>{infoText}</p>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    )
}

export default BusinessCard
