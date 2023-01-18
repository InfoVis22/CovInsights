import React, { useState } from 'react'
import { categories } from "../../settings.js"
import './Legend.scss'

const Legend = ({ vertical = true, selected, setSelected, legendItems }) => {

    const toggleSelected = (item) => {
        if (selected.find(i => i.name === item.name)) {
            setSelected(selected.filter(i => i !== selected.find(i => i.name === item.name)))
        } else {
            setSelected([...selected, item])
        }
    }

    const unselectedStyle = {
        opacity: 0.5,
        textDecoration: "line-through"
    }

    return (
        <div className="legend" style={{ flexDirection: vertical ? "column" : "row" }}>
            {legendItems?.map((item, index) =>
                <div className="legend-item" onClick={() => toggleSelected(item)} key={index}>
                    <div className="legendColorBox" style={{ backgroundColor: selected.find(i => i.name === item.name) ? item.color : "#909090", transition: "all 0.1s ease-in-out 0s" }} />
                    <div className="legendLabelText" style={{ ...(selected.find(i => i.name === item.name) ? {} : unselectedStyle), transition: "all 0.1s ease-in-out 0s" }}>{item.name}</div>
                </div>
            )}
        </div>

    )
}

export default Legend