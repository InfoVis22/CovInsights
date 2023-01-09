// IMPORTS
import './Card.scss'
import { AiOutlineInfoCircle } from 'react-icons/ai';
import Legend from '../D3Elements/legend';


const Card = ({ title, subtitle, children }) => {

    return (
        <div className="Visual">
            <div className="Heading">
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>
            <div className="Info">
                <AiOutlineInfoCircle />
            </div>
            {children}
        </div>
    )
}

export default Card
