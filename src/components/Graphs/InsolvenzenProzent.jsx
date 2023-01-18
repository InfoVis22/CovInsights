
import React, { useMemo, useRef, useState } from 'react'
import { useAppContext } from '../../contexts/appContext';
import useChartDimensions from '../../hooks/useChartDimensions';
import * as d3 from 'd3'
import YAxisLinear from '../D3Elements/YAxisLinear';
import { useEffect } from 'react';
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


    useEffect(() => {
        const yearMonthTime = [selectedDate.getFullYear(), selectedDate.getMonth() + 1].join("-")

        const filteredData = InsolvencyBarData
            .filter(row => (row.Branche_Code !== "WZ08-55" && row.Branche_Code !== "WZ08-56") &&
                ((row.Jahr + "-" + row.Monat) === yearMonthTime))

        setInsolvenzData(filteredData)


    }, [InsolvencyBarData, selectedDate])


    //X-Scale for graph
    const xScale = d3.scaleBand()
        .domain(insolvenzData.map(d => d.Branche_Lable))
        .range([0, dms.innerWidth])
        .padding(0.6)


    //Y-Scale for graph
    const yScale = d3.scaleLinear()
        .domain([100, -100])
        .range([0, dms.innerHeight])
        .nice()

    const ticks = xScale.domain().map(value => ({ value, xOffset: xScale(value) }))

    const transitionStyle = { transition: "all 0.5s ease-in-out 0s" }

    return (
        <div className="graph" ref={wrapperRef} style={{ height: chartSettings.height }}>
            <svg width={dms.width} height={dms.height}>
                <g transform={`translate(${dms.marginLeft}, ${dms.marginTop})`}>

                    {/* Create Y-Axis */}
                    <YAxisLinear
                        dms={dms}
                        domain={yScale.domain()}
                        range={yScale.range()}
                        labelSuffix="%">
                    </YAxisLinear>

                    {/* Create X-Axis */}
                    <g className="x-axis">
                        {/* Generate middle Line */}
                        <line x1="0" x2={dms.innerWidth} stroke="currentColor" transform={`translate(0, ${dms.innerHeight / 2})`} />

                        {/* Generate Ticks */}
                        {ticks.map(({ value, xOffset }) => (
                            <g key={value} transform={`translate(${xOffset}, ${dms.innerHeight})`}>
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
                                x={xScale(row.Branche_Lable)}
                                y={100}
                                width={xScale.bandwidth()}
                                height={Math.abs(yScale(row.InsolvenzenVeraenderung) - yScale(0))}
                                style={{
                                    ...transitionStyle,
                                    fill: (row.Branche_Code.includes("WZ08-56")) ? categories.Gastronomie.color : categories.Beherbergung.color,
                                    transform: (yScale(row.InsolvenzenVeraenderung) - yScale(0)) < 0 ? `translateY(${yScale(row.InsolvenzenVeraenderung) - yScale(0)}px)` : ""
                                    //transform: `translateY(-58px)`
                                }} />

                            {/* To debug - show labels */}
                            {/* <text x={xScale(row.Branche_Lable) + 3} y={yScale(row.InsolvenzenVeraenderung) + 10} style={{ ...transitionStyle, fontSize: "11px" }} >{row.InsolvenzenVeraenderung}</text> */}

                        </g>
                    ))}

                </g>
            </svg>
        </div >
    )
}

export default InsolvenzenProzent