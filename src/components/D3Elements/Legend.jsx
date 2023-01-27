import React from 'react'
import './Legend.scss'

const Legend = ({ vertical = true, selected, setSelected, hovered = null, setHovered = () => null, legendItems }) => {

    const toggleSelected = (item) => {
        if (selected.find(i => i.name === item.name)) {
            setSelected(selected.filter(i => i !== selected.find(i => i.name === item.name)))
        } else {
            setSelected([...selected, item])
        }
    }

    const onHoverItem = (item) => {
        setHovered(item)
    }

    const onLeaveItem = () => {
        setHovered(null)
    }

    const unselectedStyle = {
        opacity: 0.5,
        textDecoration: "line-through"
    }

    return (
        <div className="legend" style={{ flexDirection: vertical ? "column" : "row" }}>
            {legendItems?.map((item, index) =>
                <div className="legend-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleSelected(item)}
                    onMouseEnter={() => onHoverItem(item)}
                    onMouseLeave={() => onLeaveItem()}
                    key={index}>
                    <div className="legendColorBox" style={{ backgroundColor: selected.find(i => i.name === item.name) ? item.color : "#909090", transition: "all 0.1s ease-in-out 0s" }} />
                    <div className="legendLabelText" style={{ ...(selected.find(i => i.name === item.name) ? {} : unselectedStyle), transition: "all 0.1s ease-in-out 0s" }}>{item.name}</div>
                </div>
            )}
        </div>

    )
}

export default Legend