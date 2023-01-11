
import React, { useMemo, useRef, useState } from 'react'
import { useAppContext } from '../../contexts/appContext';
import useChartDimensions from '../../hooks/useChartDimensions';
import * as d3 from 'd3'
import YAxisLinear from '../D3Elements/YAxisLinear';
import { useEffect } from 'react';


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
    const svgRef = useRef();
    const [wrapperRef, dms] = useChartDimensions(chartSettings)
    const { InsolvencyBarData, hoveredTime, selectedDate } = useAppContext()
    const [insolvenzData, setInsolvenzData] = useState([])


    useEffect(() => {
        const filteredData = InsolvencyBarData.filter((d) => {
            return (d.Wirtschaftsbereich !== "Beherbergung" && d.Wirtschaftsbereich !== "Gastronomie" && (d.Date.getMonth() + "-" + d.Date.getYear() === selectedDate.getMonth() + "-" + selectedDate.getYear()))
        })

        setInsolvenzData(filteredData)

    }, [InsolvencyBarData, selectedDate])


    //X-Scale for graph
    const xScale = d3.scaleBand()
        .domain(insolvenzData.map(d => d.Wirtschaftsbereich))
        .range([0, dms.innerWidth])
        .padding(0.6)


    //Y-Scale for graph
    const yScale = d3.scaleLinear()
        .domain([-100, 100])
        .range([0, dms.innerHeight])
        .nice()

    const ticks = xScale.domain().map(value => ({ value, xOffset: xScale(value) }))

    console.log(xScale.bandwidth())
    yScale(insolvenzData[0]?.Veraenderung)

    const transitionStyle = { transition: "all 1s ease-in-out 0s" }

    return (
        <div className="graph" ref={wrapperRef} style={{ height: chartSettings.height }}>
            <svg width={dms.width} height={dms.height} ref={svgRef}>
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
                        <rect className="bar"
                            key={i}
                            x={xScale(row.Wirtschaftsbereich)}
                            y={dms.innerHeight / 2}
                            width={xScale.bandwidth()}
                            height={yScale(row.Veraenderung ? row.Veraenderung : 0)}
                            style={{ ...transitionStyle, fill: "#000" }} />
                    )
                    )}

                </g>
            </svg>
        </div >
    )
}

export default InsolvenzenProzent