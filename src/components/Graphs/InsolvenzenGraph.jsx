import { useEffect, useMemo, useRef, useState } from "react"
import { useAppContext } from "../../contexts/appContext"
import useChartDimensions from "../../hooks/useChartDimensions"
import XAxisTime from "../D3Elements/XAxisTime"
import YAxisLinear from "../D3Elements/YAxisLinear"
import Line from "../D3Elements/Line"
import Legend from "../D3Elements/Legend.jsx";
import { categories } from "../../settings.js"
import * as d3 from 'd3'
import { Button, Popover, Text } from "@nextui-org/react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import moment from "moment"



const InsolvenzGraph = () => {

    const { insolvenzenData, setShowTooltipsTime, hoveredTime, setHoveredTime, showTooltipsTime, selectedDate, setSelectedDate, verticalLayout, timeFrame } = useAppContext()

    //set margins of Graph
    const chartSettings = {
        height: verticalLayout ? 250 : 150,
        marginTop: 20,
        marginRight: 30,
        marginBottom: 30,
        marginLeft: 45
    }
    const [wrapperRef, dms] = useChartDimensions(chartSettings)

    const [insolvenzenDataFiltered, setInsolvenzenDataFiltered] = useState([])

    //to select and deselect Sectors
    //to select and deselect Sectors
    const legendItems = [...categories, ...categories.flatMap(c => c.subCategories)]
        .filter(c => c.name === "Beherbergung" || c.name === "Gastronomie" || c.name === "Hotels" || c.name === "Restaurants & Cafes" || c.name === "Caterer" || c.name === "Bars & Clubs")
    const [selectedBranchen, setSelectedBranchen] = useState(legendItems.filter(c => c.name === "Beherbergung" || c.name === "Gastronomie"))
    const [hoveredBranche, setHoveredBranche] = useState(null)


    const svgRef = useRef()

    const xAccessor = (d) => d.Date;
    const yAccessor = (d) => d.Insolvenzen;

    useEffect(() => {
        const filtered = insolvenzenData.filter((row) => row.Date >= timeFrame.min && row.Date <= timeFrame.max)
        setInsolvenzenDataFiltered(filtered)
    }, [timeFrame])



    //X-Scale for graph
    const xScale = useMemo(() => (
        d3.scaleTime()
            .domain([timeFrame.min, timeFrame.max])
            // .domain([new Date(2018, 1), d3.max(insolvenzData, (d) => d.Date)])
            .range([0, dms.innerWidth])
    ), [dms.innerWidth, timeFrame])

    //Y-Scale for graph
    const yScale = useMemo(() => (d3.scaleLinear()
        .domain([0, d3.max(insolvenzenData, (d) => yAccessor(d))])
        .range([dms.innerHeight, 0])
        .nice()
    ), [dms.innerWidth])

    const lineGenerator = d3.line(d => xScale(d.Date), d => yScale(d.Insolvenzen)).curve(d3.curveMonotoneX)

    const mouseEnterEvent = (e) => {
        setShowTooltipsTime(true)
    }

    const mouseEventDown = (e) => {
        setSelectedDate(hoveredTime);
    }

    const mouseMoveEvent = (e) => {
        //get x and y position relative to hovered event element
        const mousePosition = d3.pointer(e)
        //get date from x and y coordinates
        const hoveredDate = xScale.invert(mousePosition[0]);
        //set global state of selected line
        setHoveredTime(hoveredDate)
    }

    const mouseLeaveEvent = (e) => {
        setHoveredTime(null)
        setShowTooltipsTime(false)
    }


    const calculateOpacity = (branchenCode) => {
        if (!selectedBranchen.find(b => b.code === branchenCode)) return 0
        if (hoveredBranche && hoveredBranche.code !== branchenCode && selectedBranchen.find(b => b.code === hoveredBranche.code)) return 0.2
        return 1
    }

    return (
        <>

            <div className="Graph" ref={wrapperRef} style={{ height: chartSettings.height }}>
                <svg width="100%" height={dms.height} ref={svgRef}>
                    <g transform={`translate(${dms.marginLeft}, ${dms.marginTop})`}>

                        <XAxisTime
                            dms={dms}
                            domain={xScale.domain()}
                            range={xScale.range()}>
                        </XAxisTime>

                        <YAxisLinear
                            dms={dms}
                            domain={yScale.domain()}
                            range={yScale.range()}>
                        </YAxisLinear>


                        {/* Line Graph for Gastronomie */}
                        {legendItems.map((category, i) => <path key={i}
                            stroke={category.color}
                            strokeWidth={2.5}
                            fill="none"
                            d={lineGenerator(insolvenzenDataFiltered.filter(row => row.Branche_Code === category.code))}
                            style={{ opacity: calculateOpacity(category.code), transition: "all 0.2s ease-in-out" }}
                        />
                        )}


                        {/* selected grey rectangle */}
                        <rect
                            x={xScale(moment(selectedDate).startOf('month').toDate())}
                            style={{ width: (xScale(moment(selectedDate).endOf('month').toDate()) - xScale(moment(selectedDate).startOf('month').toDate())) + "px", fill: '#B8B8B87f', height: dms.innerHeight, transition: "all 0.25s ease-in-out" }}
                        />


                        {showTooltipsTime && <>
                            {/* hover dotted line */}
                            <rect x={xScale(hoveredTime)} style={{ width: ".5px", height: dms.innerHeight, stroke: '#5c5c5c', strokeDasharray: '1 1', strokeWidth: "1px" }} />
                        </>}

                        {selectedDate && <>
                            {/* hover dotted line */}
                            <rect x={xScale(selectedDate)} style={{ width: "0.8px", height: dms.innerHeight, fill: "#585858" }} />
                        </>}


                        {/* hover Beherbergung circle*/}
                        {/* <circle cx={xScale(closestXValueBeherbergung)} cy={yScale(closestYValueBeherbergung)} r="3" style={{ stroke: '#5c5c5c', fill: '#fff', opacity: 1, transition: "all 0.2s ease-in-out" }} /> */}

                        {/* hover Gastronomie circle*/}
                        {/* <circle cx={xScale(closestXValueGastronomie)} cy={yScale(closestYValueGastronomie)} r="3" style={{ stroke: '#5c5c5c', fill: '#fff', opacity: 1, transition: "all 0.2s ease-in-out" }} /> */}


                        {/* actionListener rect over graph area*/}
                        <rect className="actionListener" width={dms.innerWidth} height={dms.innerHeight}
                            fill='transparent'
                            onMouseEnter={mouseEnterEvent}
                            onMouseMove={mouseMoveEvent}
                            onMouseLeave={mouseLeaveEvent}
                            onMouseDown={mouseEventDown}
                        />

                    </g>
                </svg>
            </div >

            <div className="InfoButtonGraph">
                <Popover isBordered disableShadow>
                    <Popover.Trigger>
                        <Button auto flat color="white" size="xxs"><AiOutlineInfoCircle /></Button>
                    </Popover.Trigger>
                    <Popover.Content>
                        <Text css={{ p: "$8" }}>Insolvenzen in absoluten Zahlen für Beherbergung und Gastronomie</Text>
                    </Popover.Content>
                </Popover>
            </div>

            <Legend
                vertical={false}
                legendItems={legendItems}
                selected={selectedBranchen}
                setSelected={setSelectedBranchen}
                hovered={hoveredBranche}
                setHovered={setHoveredBranche}
            />

        </>
    )
}

export default InsolvenzGraph