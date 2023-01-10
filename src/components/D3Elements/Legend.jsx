import React from 'react'
import { categories } from "../../settings.js"
import './Legend.scss'

const Legend = ({ vertical = true }) => {

    return (
        <div className="legend" style={{ flexDirection: vertical ? "column" : "row" }}>

            <div className="legend-item">
                <div className="legendColorBox" style={{ backgroundColor: categories.Beherbergung.color }} />
                <div className="legendLabelText">Beherbergung</div>
            </div>

            <div className="legend-item">
                <div className="legendColorBox" style={{ backgroundColor: categories.Gastronomie.color }} />
                <div className="legendLabelText">Gastronomie</div>
            </div>

        </div>

    )
}

export default Legend