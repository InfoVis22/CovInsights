
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
    const { InsolvencyBarData, hoveredTime, selectedDate } = useAppContext()
    const [insolvenzData, setInsolvenzData] = useState([])
    const [hoveredBar, setHoveredBar] = useState(null)
    const [showTooltip, setShowTooltip] = useState(false)

    //to select and deselect Sectors
    const legendItems = [{ name: "Beherbergung", code: "WZ08-55", color: categories.Beherbergung.color }, { name: "Restaurants & Cafes", code: "WZ08-561", color: categories.Gastronomie.subCategories.Restaurant }, { name: "Caterer", code: "WZ08-562", color: categories.Gastronomie.subCategories.Caterer }, { name: "Bars & Clubs", code: "WZ08-563", color: categories.Gastronomie.subCategories.Bars }]
    const [selectedBranchen, setSelectedBranchen] = useState(legendItems)

    //refs
    const tooltipRef = useRef();

    useEffect(() => {
        const yearMonthTime = [selectedDate.getFullYear(), selectedDate.getMonth() + 1].join("-")

        const filteredData = InsolvencyBarData
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

    //helper functions & constants
    const getFill = (row) => selectedBranchen.find(b => row.Branche_Code.includes(b.code)) ? selectedBranchen.find(b => row.Branche_Code.includes(b.code)).color : "#909090"
    const transitionStyle = { transition: "all 0.5s ease-in-out 0s" }


    const mouseEnterEvent = (e, row) => {
        setShowTooltip(true)
        setHoveredBar(row)
    }

    const onMouseMove = (e, row) => {
        //get x and y position relative to hovered event element
        const [x, y] = d3.pointer(e)

        console.log(x, y)

        console.log(row)

        //set the position of the tooltip
        const tooltipX = x + 130
        const tooltipY = y + 70

        console.log("Tooltip: ", tooltipX, tooltipY)

        //tooltipRef.current.style.transform = `translate(${mousePosition[0] + 10}px, ${mousePosition[1] + 10}px)`
        //tooltipRef.current.style.transform = `translate(${tooltipX}px, ${tooltipY}px)`

        tooltipRef.current.style.top = tooltipY + "px"
        tooltipRef.current.style.left = tooltipX + "px"
    }

    const mouseLeaveEvent = () => {
        setShowTooltip(false)
    }

    return (
        <>
            <div className="graph" ref={wrapperRef} style={{ height: chartSettings.height }}>
                <svg width={dms.width} height={dms.height}>
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
                            <g key={i}>
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
                                        //transform: `translateY(-58px)`
                                    }}
                                    onMouseEnter={(e) => mouseEnterEvent(e, row)}
                                    onMouseMove={(e) => onMouseMove(e, row)}
                                    onMouseLeave={(e) => mouseLeaveEvent(e)}
                                />

                                {/* To debug - show labels */}
                                {/* <text x={xScale(row.Branche_Label) + 3} y={yScale(row.InsolvenzenVeraenderung) + 10} style={{ ...transitionStyle, fontSize: "11px" }} >{row.InsolvenzenVeraenderung}</text> */}

                            </g>
                        ))}


                        {/* Tooltip */}
                        {/* <g className="tooltip" ref={tooltipRef} style={{ opacity: showTooltip ? "1" : "0", transition: "all 0.15s ease-in-out 0s" }}>
                            <rect width="180" height="80" fill="#ffffff" stroke="#bbb" strokeWidth="1" filter="drop-shadow( 0px 0px 1px rgba(0, 0, 0, 0.2))" rx="5" ry="5" style={{ backdropFilter: "blur(10px)" }} />
                            <text x={10} y={20} style={{ fontSize: "0.8rem", fontWeight: "900" }}>
                                {hoveredBar?.Branche_Label}
                            </text>
                            <text x={10} y={20} style={{ fontSize: "0.7rem" }}>
                                <tspan x="10" dy="1.2em">Veränderung zu 2015: {Math.round((hoveredBar?.InsolvenzenVeraenderung + Number.EPSILON) * 100) / 100}%</tspan>
                                <tspan x="10" dy="1.2em">Insolvenzen: {hoveredBar?.Insolvenzen}%</tspan>
                                <tspan x="10" dy="1.2em">Davon abgewiesen: {hoveredBar?.Ins_rejected}</tspan>
                            </text>
                        </g> */}

                    </g>
                </svg>
            </div >


            <Legend
                vertical={false}
                legendItems={legendItems}
                selected={selectedBranchen}
                setSelected={setSelectedBranchen}
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