import { useEffect, useMemo, useRef, useState } from "react"
import { Button, Popover, Text } from "@nextui-org/react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useAppContext } from "../../contexts/appContext"
import useChartDimensions from "../../hooks/useChartDimensions"
import XAxisTime from "../D3Elements/XAxisTime"
import YAxisLinear from "../D3Elements/YAxisLinear"
import Line from "../D3Elements/Line"
import moment from "moment"
import * as d3 from 'd3'


const CoronaGraph = () => {

    //App context
    const { setHoveredTime, hoveredTime, coronaData, showHoveredTimeLine, setShowHoveredTimeLine, selectedDate, setSelectedDate, verticalLayout, timeFrame } = useAppContext()

    //set margins of Graph
    const chartSettings = {
        height: verticalLayout ? 250 : 150,
        marginTop: 10,
        marginRight: 30,
        marginBottom: 43,
        marginLeft: 45
    }

    //Component State
    const [wrapperRef, dms] = useChartDimensions(chartSettings)
    const [closestXValue, setClosestXValue] = useState(0)
    const [closestYValue, setClosestYValue] = useState(0)
    const [closestYValueToSelected, setClosestYValueToSelected] = useState(0)
    const [subventionsEvents, setSubventionsEvents] = useState([])
    const [covDataFiltered, setCovDataFiltered] = useState([])
    const [showTooltip, setShowTooltip] = useState(false)
    const [hoveredDataPoint, setHoveredDataPoint] = useState({ Date: timeFrame.min, Inzidenz: 0 })

    //refs
    const svgRef = useRef();
    const tooltipRef = useRef();

    //Accessors and Constants
    const xAccessor = (d) => d.Date;
    const yAccessor = (d) => d.Inzidenz;

    useEffect(() => {

        //set filteredData by timeFrame
        const filtered = coronaData.filter((row) => row.Date >= timeFrame.min && row.Date <= timeFrame.max)
        setCovDataFiltered(filtered)

        loadEventData()
    }, [timeFrame])

    const loadEventData = async () => {

        //load Subventions Events to display
        let subventionsEvents = await d3.dsv(";", "../../data/SubventionEvents.csv")
        subventionsEvents = subventionsEvents
            .map((row) => ({ ...row, Date: new Date(row.Date), Display: row.EventNameShort }))
            .filter((row) => row.Date >= timeFrame.min && row.Date <= timeFrame.max)

        setSubventionsEvents(subventionsEvents)
    }

    //X-Scale for graph
    const xScale = useMemo(() => (
        d3.scaleTime()
            .domain([timeFrame.min, timeFrame.max])
            // .domain([new Date(2018, 1), d3.max(coronaData, d => xAccessor(d))])
            .range([0, dms.innerWidth])

    ), [dms.innerWidth, timeFrame])


    //Y-Scale for graph
    const yScale = useMemo(() => (
        d3.scaleLinear()
            .domain([0, d3.max(covDataFiltered, d => yAccessor(d))])
            .range([dms.innerHeight, 0])
            .nice()
    ), [dms.innerHeight, covDataFiltered])

    //define lineGenerator for the graphs line
    const lineGenerator = d3.line(d => xScale(xAccessor(d)), d => yScale(yAccessor(d)))

    //mouse events
    const mouseEnterEvent = (e) => {
        setShowTooltip(true)
        setShowHoveredTimeLine(true)
    }

    const mouseMoveEvent = (e) => {
        //get x and y position relative to hovered event element
        const [x, y] = d3.pointer(e)

        //set the position of the tooltip
        const tooltipX = x + 70
        const tooltipY = y + 50

        tooltipRef.current.style.top = tooltipY + "px"
        tooltipRef.current.style.left = tooltipX + "px"


        //get date from x and y coordinates
        const hoveredDate = xScale.invert(x);

        //set global state of selected line
        setHoveredTime(hoveredDate)
    }

    const mouseLeaveEvent = (e) => {
        setHoveredTime(null)
        setShowTooltip(false)
    }

    const mouseEventDown = (e) => {
        setSelectedDate(hoveredTime);
    }
    const mouseEnterCoronaEvent = (event, i) => {
        const oldSubventionEvents = subventionsEvents;
        const newSubventionEvents = oldSubventionEvents.map((e, j) => {
            if (e.EventNameShort === event.EventNameShort) {
                e.Display = e.EventName;
            } else {
                e.Display = "";
            }
            return e;
        })

        setSubventionsEvents(newSubventionEvents);
    }

    const mouseLeaveCoronaEvent = (event, i) => {
        const oldSubventionEvents = subventionsEvents;
        const newSubventionEvents = oldSubventionEvents.map((e) => {
            e.Display = e.EventNameShort;
            return e;
        })

        setSubventionsEvents(newSubventionEvents);
    }


    useMemo(() => {
        //calculate closest data point from mouse position
        const getDistanceFromHoveredDate = (d) => Math.abs(xAccessor(d) - hoveredTime);
        const closestIndex = d3.scan(coronaData, (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b));

        //Grab the data point at that index
        const closestDataPoint = coronaData[closestIndex];
        setClosestXValue(xAccessor(closestDataPoint))
        setClosestYValue(yAccessor(closestDataPoint))

        setHoveredDataPoint({ Date: closestDataPoint.Date, Inzidenz: closestDataPoint.Inzidenz })

    }, [hoveredTime])

    useMemo(() => {
        //calculate closest data point from mouse position
        const getDistanceFromHoveredDate = (d) => Math.abs(xAccessor(d) - selectedDate);
        const closestIndexToSelected = d3.scan(coronaData, (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b));

        //Grab the data point at that index
        const closestDataPointToSelected = coronaData[closestIndexToSelected];
        setClosestYValueToSelected(yAccessor(closestDataPointToSelected))
    }, [selectedDate])


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

                        {/* Corona Trendlinie */}
                        <Line
                            data={covDataFiltered}
                            lineGenerator={lineGenerator}
                            color={'#464646'}
                            strokeWidth={2.5}
                        />


                        {/* selected grey rectangle */}
                        <rect
                            x={xScale(moment(selectedDate).startOf('month').toDate())}
                            style={{ width: (xScale(moment(selectedDate).endOf('month').toDate()) - xScale(moment(selectedDate).startOf('month').toDate())) + "px", fill: '#B8B8B87f', height: dms.innerHeight, transition: "all 0.25s ease-in-out" }}
                        />



                        {showHoveredTimeLine && <>
                            {/* hover line */}
                            <rect x={xScale(hoveredTime)} style={{ width: ".5px", height: dms.innerHeight, stroke: '#5c5c5c', strokeDasharray: '1 1', strokeWidth: "1px" }} />
                            {/* hover circle*/}
                            <circle cx={xScale(closestXValue)} cy={yScale(closestYValue)} r="3" style={{ stroke: '#5c5c5c', fill: '#fff', opacity: 1 }} />
                        </>}

                        {selectedDate && <>
                            {/* hover dotted line */}
                            <rect x={xScale(selectedDate)} style={{ width: "0.8px", height: dms.innerHeight, fill: "#585858" }} />
                            {/* selected dot */}
                            <circle cx={xScale(selectedDate)} cy={yScale(closestYValueToSelected) ? yScale(closestYValueToSelected) : 0} r="3" style={{ stroke: '#5c5c5c', fill: '#fff', opacity: 1 }} />
                        </>}


                        {/* actionListener rect over graph area*/}
                        <rect className="actionListener" width={dms.innerWidth} height={dms.innerHeight}
                            fill='transparent'
                            onMouseEnter={mouseEnterEvent}
                            onMouseMove={mouseMoveEvent}
                            onMouseLeave={mouseLeaveEvent}
                            onMouseDown={mouseEventDown}
                        />

                        {/* Subventions Events */}
                        {subventionsEvents.map((event, i) =>
                            <g key={i}
                                onMouseEnter={() => { mouseEnterCoronaEvent(event, i) }}
                                onMouseLeave={() => { mouseLeaveCoronaEvent(event, i) }}
                            >

                                <rect x={xScale(event.Date)} y={dms.innerHeight}
                                    style={{ visibility: event.Display === "" ? "hidden" : "unset", width: ".5px", height: 40, fill: "none", stroke: '#00000085', strokeDasharray: '1 1', strokeWidth: "1px" }} />

                                <text x={xScale(event.Date) + 5} y={dms.innerHeight + 40} style={{ fontSize: "0.8rem", fill: "#636060" }}>
                                    {event.Display}
                                </text>

                            </g>
                        )}

                    </g>
                </svg>
            </div >

            <div className="CoronaGraphInfo">
                <Popover isBordered disableShadow>
                    <Popover.Trigger>
                        <Button auto flat color="white" size="xxs"><AiOutlineInfoCircle /></Button>
                    </Popover.Trigger>
                    <Popover.Content>
                        <Text css={{ p: "$8" }}>Coronainfektionen in absoluten Zahlen. Nutzen Sie die Play, Reset Buttons um den Zeitverlauf zu kontrollieren. Klicken Sie auf die Zeitachse um einen Zeitpunkt zu markieren</Text>
                    </Popover.Content>
                </Popover>
            </div>

            <div className='tooltip' ref={tooltipRef} style={{ top: "0px", left: "0px", opacity: showTooltip ? "1" : "0", zIndex: showTooltip ? "20" : "-100" }}>
                <h3>7-Tage Inzidenz DE</h3>
                <p>{moment(hoveredDataPoint.Date).format("DD MMMM YYYY")}: {hoveredDataPoint.Inzidenz}</p>
            </div>
        </>
    )
}

export default CoronaGraph