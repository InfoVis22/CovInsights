// IMPORTS
import './Card.scss'
import { AiOutlineInfoCircle } from 'react-icons/ai';


const Card = ({ title, subtitle, children }) => {


    // RENDER

    return (
        <div className="Visual">
            <div className="Heading">
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>
            <div className="Info">
                <AiOutlineInfoCircle />
            </div>
            <div className="Graph">
                {children}
            </div>
        </div>
    )
}

export default Card
