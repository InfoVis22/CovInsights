import { useEffect, useMemo, useRef, useState } from "react"
import useChartDimensions from "../../hooks/useChartDimensions";
import { useAppContext } from "../../contexts/appContext"
import * as d3 from 'd3'
import YAxisNominal from "../D3Elements/YAxisNominal";
import XAxisLinear from "../D3Elements/XAxisLinear";
import { filter } from "d3";
import Legend from "../D3Elements/Legend.jsx";
import { categories } from "../../settings.js";
import { Popover, Button, Text } from "@nextui-org/react";
import { AiOutlineInfoCircle } from 'react-icons/ai';


//set margins of Graph
const chartSettings = {
    height: 250,
    marginTop: 20,
    marginRight: 30,
    marginBottom: 30,
    marginLeft: 100
}

const EmploymentBarChart = () => {

    //App context
    const { employmentData, selectedDate } = useAppContext()

    //Component State
    const [wrapperRef, dms] = useChartDimensions(chartSettings)
    const [showTooltip, setShowTooltip] = useState(false)
    const [filteredData, setFilteredData] = useState([])
    const [hoveredBar, setHoveredBar] = useState(null)

    //to select and deselect Sectors
    const legendItems = [{ name: "Beherbergung", code: "WZ08-55", color: categories.Beherbergung.color }, { name: "Gastronomie", code: "WZ08-56", color: categories.Gastronomie.color }]
    const [selectedBranchen, setSelectedBranchen] = useState(legendItems)

    //refs
    const tooltipRef = useRef();

    //Accessors
    const xAccessor = (d) => d.Beschaeftigte;

    //initialize component
    useEffect(() => {
        const yearMonthTime = [selectedDate.getFullYear(), selectedDate.getMonth() + 1].join("-")
        const filteredDataCreate = employmentData.filter((row) => (
            (row.Jahr + "-" + row.Monat) === yearMonthTime &&
            selectedBranchen.find(b => row.Branche_Code.includes(b.code))
        ))
        setFilteredData(filteredDataCreate)
    }, [selectedDate.getMonth(), selectedBranchen])

    //X-Scale for graph
    const xScale = useMemo(() => (
        d3.scaleLinear()
            .domain([0, d3.max(employmentData, row => xAccessor(row))])
            .range([0, dms.innerWidth])
            .nice()
    ), [dms.innerWidth])

    //Y-Scale for graph
    const yScale = useMemo(() => (
        d3.scaleBand()
            .domain(filteredData.map(d => d.Branche_Label))
            .range([dms.innerHeight, 0])
            .padding(0.4)

    ), [dms.innerHeight, filteredData])

    //mouse events
    const mouseEnterEvent = (e, row) => {
        setShowTooltip(true)
        setHoveredBar(row)
        console.log(row)
    }

    const mouseMoveEvent = (e) => {
        //get x and y position relative to hovered event element
        const [x, y] = d3.pointer(e)

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


    //helper functions & constants
    const getFill = (row) => selectedBranchen.find(b => row.Branche_Code.includes(b.code)) ? selectedBranchen.find(b => row.Branche_Code.includes(b.code)).color : "#909090"
    const transitionStyle = { transition: "all 1s ease-in-out 0s" }

    return (
        <>
            <div className="graph" ref={wrapperRef} style={{ height: chartSettings.height }}>
                <svg width={dms.width} height={dms.height} >
                    <g transform={`translate(${dms.marginLeft}, ${dms.marginTop})`}>

                        <path d={`M ${xScale(100)} 0 h 0 V ${dms.innerHeight} h 0`} fill="none" stroke="#aaa" strokeWidth={1.5} />


                        {filteredData.map((row, i) =>
                            <g key={i}>
                                <rect className="bar"
                                    x={0}
                                    y={yScale(row.Branche_Label) - yScale.bandwidth() / 2}
                                    width={xScale(xAccessor(row))}
                                    height={yScale.bandwidth()}
                                    style={{ ...transitionStyle, fill: getFill(row) }}
                                    onMouseEnter={(e) => mouseEnterEvent(e, row)}
                                    onMouseMove={(e) => mouseMoveEvent(e, row)}
                                    onMouseLeave={(e) => mouseLeaveEvent(e)}
                                />

                                <text x={0} y={yScale(row.Branche_Label) + yScale.bandwidth() / 4} style={{ ...transitionStyle, fontSize: "11px", transform: `translateX(${xScale(row.Beschaeftigte) + 8}px)` }} >{row.Beschaeftigte} %</text>

                            </g>
                        )}

                        <XAxisLinear
                            dms={dms}
                            domain={xScale.domain()}
                            range={xScale.range()}
                            labelSuffix=" %">
                        </XAxisLinear>

                        <YAxisNominal
                            dms={dms}
                            domain={yScale.domain()}
                            range={yScale.range()}>
                        </YAxisNominal>



                        {/* Tooltip */}
                        {/* <g className="tooltip" ref={tooltipRef} style={{ opacity: showTooltip ? 1 : 0, transition: "all 0.15s ease-in-out 0s" }}>
                            <rect width="180" height="80" fill="#ffffff" stroke="#bbb" strokeWidth="1" filter="drop-shadow( 0px 0px 1px rgba(0, 0, 0, 0.2))" rx="5" ry="5" style={{ backdropFilter: "blur(10px)" }} />
                            <text x={10} y={20} style={{ fontSize: "0.7rem", fontWeight: "bold" }}>
                                {hoveredBar}
                            </text>
                            <text x={10} y={20} style={{ fontSize: "0.7rem" }}>
                                <tspan x="10" dy="1.2em">Beschäftigte: {filteredData.find(d => d.Branche_Label === hoveredBar)?.Beschaeftigte}%</tspan>
                                <tspan x="10" dy="1.2em">Vollzeitbeschäftigte: {filteredData.find(d => d.Branche_Label === hoveredBar)?.Vollzeitbeschaeftigte}%</tspan>
                                <tspan x="10" dy="1.2em">Teilzeitbeschaeftigte: {filteredData.find(d => d.Branche_Label === hoveredBar)?.Teilzeitbeschaeftigte}%</tspan>
                            </text>
                        </g> */}

                        {/* actionListener rect over graph area*/}
                        {/* <rect className="actionListener" width={dms.innerWidth} height={dms.innerHeight}
                            fill='transparent'
                            onMouseEnter={mouseEnterEvent}
                            onMouseMove={mouseMoveEvent}
                            onMouseLeave={mouseLeaveEvent}
                        /> */}

                    </g>
                </svg>
            </div >
            <Legend
                vertical={false}
                legendItems={legendItems}
                selected={selectedBranchen}
                setSelected={setSelectedBranchen} />



            <div className='tooltip' ref={tooltipRef} style={{ top: "0px", left: "0px", opacity: showTooltip ? "1" : "0", display: showTooltip ? "inline-block" : "none" }}>
                <h3>{hoveredBar?.Branche_Label}</h3>
                <p>Beschäftigte zu 2015: {hoveredBar?.Beschaeftigte}%</p>
                <p>Vollzeitbeschäftigte: {hoveredBar?.Vollzeitbeschaeftigte}%</p>
                <p>Teilzeitbeschaeftigte: {hoveredBar?.Teilzeitbeschaeftigte}%</p>
            </div>
        </>
    )
}

export default EmploymentBarChart