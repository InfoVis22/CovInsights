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

const RevenueBarChart = () => {

    //Context
    const { umsatzData, hoveredTime, selectedDate } = useAppContext()

    //Component State
    const [wrapperRef, dms] = useChartDimensions(chartSettings)
    const [showTooltip, setShowTooltip] = useState(false)
    const [filteredData, setFilteredData] = useState([])
    const [hoveredBar, setHoveredBar] = useState(null)

    //to select and deselect Sectors
    const legendItems = categories.filter(c => c.name === "Beherbergung" || c.name === "Gastronomie")
    const [selectedBranchen, setSelectedBranchen] = useState(legendItems)
    const [hoveredBranche, setHoveredBranche] = useState(null)

    //refs
    const tooltipRef = useRef();

    //initialize component
    useEffect(() => {
        const yearMonthTime = [selectedDate.getFullYear(), selectedDate.getMonth() + 1].join("-")
        const filteredData = umsatzData.filter((row) => (
            (row.Jahr + "-" + row.Monat) === yearMonthTime &&
            selectedBranchen.find(b => row.Branche_Code.includes(b.code))))

        setFilteredData(filteredData)
    }, [selectedDate.getMonth() + selectedDate.getFullYear(), selectedBranchen])

    //X-Scale for graph
    const xScale = useMemo(() => {
        return (d3.scaleLinear()
            .domain([0, d3.max(umsatzData, d => d.Umsatz)])
            .range([0, dms.innerWidth])
            .nice())
    }, [dms.innerWidth])

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
    }

    const mouseMoveEvent = (e) => {
        //get x and y position relative to hovered event element
        const [x, y] = d3.pointer(e)

        //set the position of the tooltip
        const tooltipX = x + 130
        const tooltipY = y + 70

        tooltipRef.current.style.top = tooltipY + "px"
        tooltipRef.current.style.left = tooltipX + "px"
    }

    const mouseLeaveEvent = () => {
        setShowTooltip(false)
    }

    //helper functions & constants
    const getFill = (row) => categories.find(c => row.Branche_Code.includes(c.code)).color
    const transitionStyle = { transition: "all 1s ease-in-out 0s" }
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

                        <XAxisLinear
                            dms={dms}
                            domain={xScale.domain()}
                            range={xScale.range()}
                            labelSuffix=" M€"
                        >

                        </XAxisLinear>

                        <YAxisNominal
                            dms={dms}
                            domain={yScale.domain()}
                            range={yScale.range()}>
                        </YAxisNominal>

                        {filteredData.map((row, i) =>
                            <g key={i}
                                onMouseEnter={(e) => mouseEnterEvent(e, row)}
                                onMouseMove={(e) => mouseMoveEvent(e, row)}
                                onMouseLeave={(e) => mouseLeaveEvent(e)}
                                style={{ opacity: calculateOpacity(row.Branche_Code), transition: "opacity 0.2s ease-in-out 0s" }}
                            >
                                <rect className="bar"
                                    key={i}
                                    x={0}
                                    y={yScale(row.Branche_Label) - yScale.bandwidth() / 2}
                                    width={xScale(row.Umsatz)}
                                    height={yScale.bandwidth()}
                                    style={{ ...transitionStyle, fill: getFill(row) }} />

                                <text x={0} y={yScale(row.Branche_Label) + yScale.bandwidth() / 4} style={{ ...transitionStyle, fontSize: "11px", transform: `translateX(${xScale(row.Umsatz) + 8}px)` }} >{row.Umsatz} M€</text>
                            </g>

                        )}
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


            <div className='tooltip' ref={tooltipRef} style={{ top: "0px", left: "0px", opacity: showTooltip ? "1" : "0" }}>
                <h3>{hoveredBar?.Branche_Label}</h3>
                <p>Umsatz: {hoveredBar?.Umsatz}M€</p>
                <p>Δ zur Vorjahresperiode: {hoveredBar?.Veraenderung}%</p>
            </div>
        </>
    )
}

export default RevenueBarChart