
import React, { useMemo, useRef, useState } from 'react'
import { useAppContext } from '../../contexts/appContext';
import useChartDimensions from '../../hooks/useChartDimensions';
import * as d3 from 'd3'
import YAxisLinear from '../D3Elements/YAxisLinear';
import { useEffect } from 'react';
import Legend from "../D3Elements/Legend.jsx";
import { categories } from "../../settings.js"


//set margins of Graph
const chartSettings = {
    height: 250,
    marginTop: 20,
    marginRight: 30,
    marginBottom: 30,
    marginLeft: 50,
}

const InsolvenzenProzent = () => {

    //setup Hooks
    const [wrapperRef, dms] = useChartDimensions(chartSettings)
    const { insolvenzenData, hoveredTime, selectedDate } = useAppContext()
    const [insolvenzData, setInsolvenzData] = useState([])
    const [hoveredBar, setHoveredBar] = useState(null)
    const [showTooltip, setShowTooltip] = useState(false)

    //to select and deselect Sectors
    const legendItems = [...categories, ...categories.flatMap(c => c.subCategories)]
        .filter(c => c.name === "Hotels" || c.name === "Restaurants & Cafes" || c.name === "Caterer" || c.name === "Bars & Clubs")
    const [selectedBranchen, setSelectedBranchen] = useState(legendItems)
    const [hoveredBranche, setHoveredBranche] = useState(null)

    //refs
    const tooltipRef = useRef();

    useEffect(() => {
        const yearMonthTime = [selectedDate.getFullYear(), selectedDate.getMonth() + 1].join("-")

        const filteredData = insolvenzenData
            .filter(row => (row.Branche_Code !== "WZ08-55" && row.Branche_Code !== "WZ08-56") &&
                ((row.Jahr + "-" + row.Monat) === yearMonthTime) &&
                selectedBranchen.find(b => row.Branche_Code.includes(b.code)))

        setInsolvenzData(filteredData)
    }, [selectedDate, selectedBranchen])


    //X-Scale for graph
    const xScale = d3.scaleBand()
        .domain(insolvenzData.map(d => d.Branche_Label))
        .range([0, dms.innerWidth])
        .padding(0.6)


    //Y-Scale for graph
    const yScale = d3.scaleLinear()
        .domain([100, -100])
        .range([0, dms.innerHeight])
        .nice()

    const ticks = xScale.domain().map(value => ({ value, xOffset: xScale(value) }))


    const mouseEnterEvent = (e, row) => {
        setShowTooltip(true)
        setHoveredBar(row)
    }

    const onMouseMove = (e, row) => {
        //get x and y position relative to hovered event element
        const [x, y] = d3.pointer(e)

        //set the position of the tooltip
        const tooltipX = x + 80
        const tooltipY = y + 70

        tooltipRef.current.style.top = tooltipY + "px"
        tooltipRef.current.style.left = tooltipX + "px"
    }

    const mouseLeaveEvent = () => {
        setShowTooltip(false)
    }

    //helper functions & constants
    const getFill = (row) => selectedBranchen.find(b => row.Branche_Code.includes(b.code)) ? selectedBranchen.find(b => row.Branche_Code.includes(b.code)).color : "#0000"
    const transitionStyle = { transition: "all 0.5s ease-in-out 0s" }
    const calculateOpacity = (branchenCode) => {
        if (!selectedBranchen.find(b => branchenCode.includes(b.code))) return 0
        if (hoveredBranche && !branchenCode.includes(hoveredBranche.code) && selectedBranchen.find(b => hoveredBranche.code.includes(b.code))) return 0.2
        return 1
    }

    return (
        <>
            <div className="graph" ref={wrapperRef} style={{ height: chartSettings.height }}>
                <svg width="100%" height={dms.height}>
                    <g transform={`translate(${dms.marginLeft}, ${dms.marginTop})`}>

                        {/* Create Y-Axis */}
                        <YAxisLinear
                            dms={dms}
                            domain={yScale.domain()}
                            range={yScale.range()}
                            labelSuffix=" %">
                        </YAxisLinear>

                        {/* Create X-Axis */}
                        <g className="x-axis">
                            {/* Generate middle Line */}
                            <line x1="0" x2={dms.innerWidth} stroke="currentColor" transform={`translate(0, ${dms.innerHeight / 2})`} />

                            {/* Generate Ticks */}
                            {ticks.map(({ value, xOffset }) => (
                                <g key={value} transform={`translate(${xOffset + xScale.bandwidth() / 2}, ${dms.innerHeight})`}>
                                    <line y1="0" y2="6" stroke="currentColor" />
                                    <text style={{ fontSize: "11px", textAnchor: "middle", fontWeight: "500", transform: "translateY(16px)" }}>
                                        {value}
                                    </text>
                                </g>
                            ))}
                        </g>

                        {/* Create Prozent Bars */}
                        {insolvenzData.map((row, i) => (
                            <g key={i}
                                onMouseEnter={(e) => mouseEnterEvent(e, row)}
                                onMouseMove={(e) => onMouseMove(e, row)}
                                onMouseLeave={(e) => mouseLeaveEvent(e)}
                                style={{ opacity: calculateOpacity(row.Branche_Code), transition: "opacity 0.2s ease-in-out 0s" }}
                            >

                                <rect className="bar"
                                    key={i}
                                    x={xScale(row.Branche_Label)}
                                    y={100}
                                    width={xScale.bandwidth()}
                                    height={Math.abs(yScale(row.InsolvenzenVeraenderung) - yScale(0))}
                                    style={{
                                        ...transitionStyle,
                                        fill: getFill(row),
                                        transform: (yScale(row.InsolvenzenVeraenderung) - yScale(0)) < 0 ? `translateY(${yScale(row.InsolvenzenVeraenderung) - yScale(0)}px)` : ""

                                    }}
                                />

                                {/* To debug - show labels */}
                                {/* <text x={xScale(row.Branche_Label) + 3} y={yScale(row.InsolvenzenVeraenderung) + 10} style={{ ...transitionStyle, fontSize: "11px" }} >{row.InsolvenzenVeraenderung}</text> */}

                            </g>
                        ))}

                    </g>
                </svg>
            </div >


            <Legend
                vertical={false}
                legendItems={legendItems}
                selected={selectedBranchen}
                setSelected={setSelectedBranchen}
                hovered={hoveredBranche}
                setHovered={setHoveredBranche}
            />


            <div className='tooltip' ref={tooltipRef} style={{ top: "0px", left: "0px", opacity: showTooltip ? "1" : "0", display: showTooltip ? "inline-block" : "none" }}>
                <h3>{hoveredBar?.Branche_Label}</h3>
                <p>Veränderung zu 2015: {Math.round((hoveredBar?.InsolvenzenVeraenderung + Number.EPSILON) * 100) / 100}%</p>
                <p>Insolvenzen: {hoveredBar?.Insolvenzen}</p>
                <p>Davon abgewiesen: {hoveredBar?.Ins_rejected}</p>
            </div>

        </>
    )
}

export default InsolvenzenProzent