import { categories } from "../../settings.js"
import './Legend.scss'

const Legend = ({ vertical = true }) => {

    return (
        <div className="legend" style={{ flexDirection: vertical ? "column" : "row" }}>
            {categories.map(category =>
                <div className="legend-item">
                    <div className="legendColorBox" style={{ backgroundColor: category.color }} />
                    <div className="legendLabelText">{category.name}</div>
                </div>
            )}

        </div>

    )
}

export default Legend