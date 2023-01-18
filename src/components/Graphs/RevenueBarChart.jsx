import { useEffect, useMemo, useRef, useState } from "react"
import useChartDimensions from "../../hooks/useChartDimensions";
import { useAppContext } from "../../contexts/appContext"
import * as d3 from 'd3'
import YAxisNominal from "../D3Elements/YAxisNominal";
import XAxisLinear from "../D3Elements/XAxisLinear";
import { filter } from "d3";
import Legend from "../D3Elements/Legend.jsx";
import { categories } from "../../settings.js"


//set margins of Graph
const chartSettings = {
    height: 250,
    marginTop: 20,
    marginRight: 30,
    marginBottom: 30,
    marginLeft: 100
}

const RevenueBarChart = () => {

    const tooltipRef = useRef();

    const [wrapperRef, dms] = useChartDimensions(chartSettings)
    const { umsatzData, hoveredTime, selectedDate } = useAppContext()
    const [showTooltip, setShowTooltip] = useState(false)
    const [filteredData, setFilteredData] = useState([])
    const [hoveredBar, setHoveredBar] = useState(null)

    //to select and deselect Sectors
    const legendItems = [{ name: "Beherbergung", code: "WZ08-55", color: categories.Beherbergung.color }, { name: "Gastronomie", code: "WZ08-56", color: categories.Gastronomie.color }]
    const [selectedBranchen, setSelectedBranchen] = useState(legendItems)


    useEffect(() => {
        const yearMonthTime = [selectedDate.getFullYear(), selectedDate.getMonth() + 1].join("-")
        const filteredData = umsatzData.filter((row) => ((row.Jahr + "-" + row.Monat) === yearMonthTime))
        //to filter out not selected
        //&& selectedBranchen.find(b => row.Branche_Code.includes(b.code))


        setFilteredData(filteredData)
    }, [selectedDate.getMonth(), selectedBranchen])

    //X-Scale for graph
    const xScale = useMemo(() => {
        return (d3.scaleLinear()
            .domain([0, d3.max(umsatzData, d => d.Umsatz)])
            .range([0, dms.innerWidth])
            .nice())
    }, [dms.innerWidth, selectedBranchen])

    //Y-Scale for graph
    const yScale = useMemo(() => (
        d3.scaleBand()
            .domain(umsatzData.map(d => d.Branche_Label))
            .range([dms.innerHeight, 0])
            .padding(0.4)
    ), [dms.innerHeight, selectedBranchen])

    //mouse events
    const mouseEnterEvent = (e) => {
        setShowTooltip(true)
    }

    const mouseMoveEvent = (e) => {
        //get x and y position relative to hovered event element
        const mousePosition = d3.pointer(e)

        const eachBand = yScale.step();
        const index = Math.max(yScale.domain().length - 1 - Math.floor((mousePosition[1] / eachBand)), 0)

        //set the hovered bar to the string e.g. Ferienunterkunft
        const hoveredDomain = yScale.domain()[index]
        setHoveredBar(hoveredDomain)

        //set the position of the tooltip
        const tooltipX = xScale(filteredData.find(d => d.Branche_Label === hoveredBar)?.Umsatz) + 6
        const tooltipY = yScale(hoveredDomain) - 25 //25: half width of tooltip

        console.log(tooltipRef.current.style.height)
        //tooltipRef.current.style.transform = `translate(${mousePosition[0] + 10}px, ${mousePosition[1] + 10}px)`
        tooltipRef.current.style.transform = `translate(${tooltipX}px, ${tooltipY}px)`
    }

    const mouseLeaveEvent = (e) => {
        setShowTooltip(false)
    }

    const getFill = (row) => selectedBranchen.find(b => row.Branche_Code.includes(b.code)) ? selectedBranchen.find(b => row.Branche_Code.includes(b.code)).color : "#909090"


    const transitionStyle = { transition: "all 1s ease-in-out 0s" }

    return (
        <>
            <div className="graph" ref={wrapperRef} style={{ height: chartSettings.height }}>
                <svg width={dms.width} height={dms.height}>
                    <g transform={`translate(${dms.marginLeft}, ${dms.marginTop})`}>

                        <XAxisLinear
                            dms={dms}
                            domain={xScale.domain()}
                            range={xScale.range()}>
                        </XAxisLinear>

                        <YAxisNominal
                            dms={dms}
                            domain={yScale.domain()}
                            range={yScale.range()}>
                        </YAxisNominal>

                        {filteredData.map((row, i) =>
                            <g key={i}>
                                <rect className="bar"
                                    key={i}
                                    x={0}
                                    y={yScale(row.Branche_Label) - yScale.bandwidth() / 2}
                                    width={xScale(row.Umsatz)}
                                    height={yScale.bandwidth()}
                                    style={{ ...transitionStyle, fill: getFill(row) }} />

                                <text x={0} y={yScale(row.Branche_Label) + yScale.bandwidth() / 4} style={{ ...transitionStyle, fontSize: "11px", transform: `translateX(${xScale(row.Umsatz) + 8}px)` }} >{row.Umsatz}</text>
                            </g>

                        )}

                        {/* Tooltip */}
                        <g className="tooltip" ref={tooltipRef} style={{ display: showTooltip ? "block" : "none", transition: "all 0.1s ease-in-out 0s" }}>
                            <rect width="200" height="50" fill="#ffffffc0" stroke="black" strokeWidth="1" rx="5" ry="5" />
                            <text x={10} y={20} style={{ fontSize: "1rem", fontWeight: "bold" }}>
                                {hoveredBar}
                            </text>
                            <text x={10} y={40} style={{ fontSize: "0.9rem" }}>
                                Umsatz: {filteredData.find(d => d.Branche_Label === hoveredBar)?.Umsatz}
                            </text>
                        </g>


                        {/* actionListener rect over graph area*/}
                        <rect className="actionListener" width={dms.innerWidth} height={dms.innerHeight}
                            fill='transparent'
                            onMouseEnter={mouseEnterEvent}
                            onMouseMove={mouseMoveEvent}
                            onMouseLeave={mouseLeaveEvent}
                        />

                    </g>
                </svg>
            </div >

            <Legend
                vertical={false}
                legendItems={legendItems}
                selected={selectedBranchen}
                setSelected={setSelectedBranchen} />
        </>
    )
}

export default RevenueBarChart