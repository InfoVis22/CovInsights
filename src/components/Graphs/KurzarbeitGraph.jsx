import { useEffect, useMemo, useRef, useState } from "react"
import { useAppContext } from "../../contexts/appContext"
import useChartDimensions from "../../hooks/useChartDimensions"
import XAxisTime from "../D3Elements/XAxisTime"
import YAxisLinear from "../D3Elements/YAxisLinear"
import Line from "../D3Elements/Line"
import Legend from "../D3Elements/Legend.jsx";
import { categories } from "../../settings.js"
import * as d3 from 'd3'
import {Button, Popover, Text} from "@nextui-org/react";
import {AiOutlineInfoCircle} from "react-icons/ai";


//set margins of Graph
const chartSettings = {
    height: 150,
    marginTop: 20,
    marginRight: 30,
    marginBottom: 20,
    marginLeft: 45
}

const KurzarbeitGraph = () => {
    const svgRef = useRef()
    const [wrapperRef, dms] = useChartDimensions(chartSettings)
    const { kurzarbeitData, setShowTooltipsTime, hoveredTime, setHoveredTime, showTooltipsTime, selectedDate, setSelectedDate } = useAppContext()
    const [closestXValueBeherbergung, setClosestXValueBeherbergung] = useState(0)
    const [closestYValueBeherbergung, setClosestYValueBeherbergung] = useState(0)
    const [closestXValueGastronomie, setClosestXValueGastronomie] = useState(0)
    const [closestYValueGastronomie, setClosestYValueGastronomie] = useState(0)



    const xAccessor = (d) => d.Date;
    const yAccessor = (d) => d.Kurzarbeiter;


    //X-Scale for graph
    const xScale = useMemo(() => (
        d3.scaleTime()
            .domain([new Date(2018, 1), new Date(2022, 12)])
            // .domain([new Date(2018, 1), d3.max(insolvenzData, (d) => d.Date)])
            .range([0, dms.innerWidth])
            .nice()
    ), [dms.innerWidth])


    //Y-Scale for graph
    const yScale = useMemo(() => (d3.scaleLinear()
        .domain([0, d3.max(kurzarbeitData, (d) => yAccessor(d))])
        .range([dms.innerHeight, 0])
        .nice()
    ), [dms.innerWidth])

    const lineGenerator = d3.line(d => xScale(d.Date), d => yScale(d.Kurzarbeiter)).curve(d3.curveMonotoneX)


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

        console.log("LEAVE COVV")
    }

    useMemo(() => {
        //calculate closest data point from mouse position
        //get the date closest to the hovered date
        const getDistanceFromHoveredDate = (d) => Math.abs(d.Date - selectedDate);

        //Beherbergung: WZ08-55; Gastronomie: WZ08-56
        const BeherbergungSubset = kurzarbeitData.filter(row => row.Branche_Code === "WZ08-55")
        const GastronomieSubset = kurzarbeitData.filter(row => row.Branche_Code === "WZ08-56")

        const closestIndexBeherbergung = d3.scan(BeherbergungSubset, (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b));
        const closestIndexGastronomie = d3.scan(GastronomieSubset, (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b));

        //Grab the data point at that index
        const closestDataPointBeherbergung = BeherbergungSubset[closestIndexBeherbergung];
        const closestDataPointGastronomie = GastronomieSubset[closestIndexGastronomie];

        setClosestXValueBeherbergung(closestDataPointBeherbergung.Date)
        setClosestYValueBeherbergung(closestDataPointBeherbergung.Kurzarbeiter)
        setClosestXValueGastronomie(closestDataPointGastronomie.Date)
        setClosestYValueGastronomie(closestDataPointGastronomie.Kurzarbeiter)
    }, [selectedDate])



    return (
        <>
            <div className="Graph" ref={wrapperRef} style={{ height: chartSettings.height }}>
                <svg width={dms.width} height={dms.height} ref={svgRef}>
                    <g transform={`translate(${dms.marginLeft}, ${dms.marginTop})`}>

                        <XAxisTime
                            dms={dms}
                            domain={xScale.domain()}
                            range={xScale.range()}>
                        </XAxisTime>

                        <YAxisLinear
                            dms={dms}
                            domain={yScale.domain()}
                            range={yScale.range()}
                            labelSuffix=" T"
                            >
                        </YAxisLinear>

                        {/* Line Graph for Gastronomie */}
                        <path
                            stroke={categories.Gastronomie.color}
                            strokeWidth={2.5}
                            fill="none"
                            d={lineGenerator(kurzarbeitData.filter(row => row.Branche_Code === "WZ08-56"))}
                            style={{ transition: "all 1s ease-in-out" }}
                        />

                        {/* Line for Beherbergung */}
                        <path
                            stroke={categories.Beherbergung.color}
                            d={lineGenerator(kurzarbeitData.filter(row => row.Branche_Code === "WZ08-55"))}
                            strokeWidth={2.5}
                            fill="none"
                            style={{ transition: "all 1s ease-in-out" }}
                        />



                        {/* selected grey rectangle */}
                        <rect x={xScale(selectedDate)-12} style={{ width: "20px", fill: '#B8B8B87f', height: dms.innerHeight }} />

                        {showTooltipsTime && <>
                            {/* hover dotted line */}
                            <rect x={xScale(hoveredTime)} style={{ width: ".5px", height: dms.innerHeight, stroke: '#5c5c5c', strokeDasharray: '1 1', strokeWidth: "1px" }} />
                        </>}


                        {/* hover Beherbergung circle*/}
                        <circle cx={xScale(closestXValueBeherbergung)} cy={yScale(closestYValueBeherbergung)} r="3" style={{ stroke: '#5c5c5c', fill: '#fff', opacity: 1, transition: "all 0.2s ease-in-out" }} />

                        {/* hover Gastronomie circle*/}
                        <circle cx={xScale(closestXValueGastronomie)} cy={yScale(closestYValueGastronomie)} r="3" style={{ stroke: '#5c5c5c', fill: '#fff', opacity: 1, transition: "all 0.2s ease-in-out" }} />



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
            <div style={{ height: "20px" }}></div>
            <Legend vertical={false} />

            <div className="InfoButtonGraph">
                <Popover isBordered disableShadow>
                    <Popover.Trigger>
                        <Button auto flat color="white"  size = "xxs"><AiOutlineInfoCircle /></Button>
                    </Popover.Trigger>
                    <Popover.Content>
                        <Text css={{ p: "$8" }}>Kurzarbeit in absoluten Zahlen (in Tsd Mitarbeiter) unterteilt in Gastronomie und Beherbergung</Text>
                    </Popover.Content>
                </Popover>
            </div>
        </>
    )
}

export default KurzarbeitGraph