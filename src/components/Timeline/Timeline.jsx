// IMPORTS
import './Timeline.scss'

const Timeline = ({ title, subtitle, children }) => {


    return (
        <div className="Timeline">
            <div className="Heading">
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>
            {children}
        </div>
    )
}

export default Timeline
