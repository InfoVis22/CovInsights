import { useEffect, useMemo, useRef, useState } from "react"
import { useAppContext } from "../../contexts/appContext"
import useChartDimensions from "../../hooks/useChartDimensions"
import * as d3 from 'd3'
import XAxisTime from "../D3Elements/XAxisTime"
import YAxisLinear from "../D3Elements/YAxisLinear"
import Line from "../D3Elements/Line"
import {Button, Popover, Text} from "@nextui-org/react";
import {AiOutlineInfoCircle} from "react-icons/ai";

//set margins of Graph
const chartSettings = {
    height: 150,
    marginTop: 1,
    marginRight: 30,
    marginBottom: 57,
    marginLeft: 30
}

const CoronaGraph = () => {

    //App context
    const { setHoveredTime, hoveredTime, coronaData, showTooltipsTime, setShowTooltipsTime, selectedDate, setSelectedDate } = useAppContext()

    //Component State
    const [wrapperRef, dms] = useChartDimensions(chartSettings)
    const [closestXValue, setClosestXValue] = useState(0)
    const [closestYValue, setClosestYValue] = useState(0)
    const [closestYValueToSelected, setclosestYValueToSelected] = useState(0)
    const [subventionsEvents, setSubventionsEvents] = useState([])
    

    //refs
    const svgRef = useRef();

    //Accessors and Constants
    const xAccessor = (d) => d.Date;
    const yAccessor = (d) => d.Inzidenz;

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        //load Subventions Events to display
        let subventionsEvents = await d3.dsv(";", "../../data/SubventionEvents.csv")
        subventionsEvents = subventionsEvents
            .map((row) => ({ ...row, Date: new Date(row.Date), Display: row.EventNameShort}))

        console.log(subventionsEvents)
        setSubventionsEvents(subventionsEvents)
    }

    //X-Scale for graph
    const xScale = useMemo(() => (
        d3.scaleTime()
            .domain([new Date(2018, 1), new Date(2022, 12)])
            // .domain([new Date(2018, 1), d3.max(coronaData, d => xAccessor(d))])
            .range([0, dms.innerWidth])
            .nice()
    ), [dms.innerWidth])

    //Y-Scale for graph
    const yScale = useMemo(() => (
        d3.scaleLinear()
            .domain([0, d3.max(coronaData, d => yAccessor(d))])
            .range([dms.innerHeight, 0])
            .nice()
    ), [dms.innerHeight])

    //define lineGenerator for the graphs line
    const lineGenerator = d3.line(d => xScale(xAccessor(d)), d => yScale(yAccessor(d)))

    //mouse events
    const mouseEnterEvent = (e) => {
        setShowTooltipsTime(true)
    }

    const mouseEventDown = (e) => {
        setSelectedDate(hoveredTime);
    }

    const mouseEnterCoronaEvent = (event, i) => {
        const oldSubventionEvents = subventionsEvents;
        const newSubventionEvents = oldSubventionEvents.map((e, j) => {
            if(e.EventNameShort === event.EventNameShort)
            {
                e.Display = e.EventName;
            }else if(j % 2 == i  % 2){
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


    useMemo(() => {
        //calculate closest data point from mouse position
        const getDistanceFromHoveredDate = (d) => Math.abs(xAccessor(d) - hoveredTime);
        const closestIndex = d3.scan(coronaData, (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b));

        //Grab the data point at that index
        const closestDataPoint = coronaData[closestIndex];
        setClosestXValue(xAccessor(closestDataPoint))
        setClosestYValue(yAccessor(closestDataPoint))

    }, [hoveredTime])

    useMemo(() => {
        //calculate closest data point from mouse position
        const getDistanceFromHoveredDate = (d) => Math.abs(xAccessor(d) - selectedDate);
        const closestIndexToSelected = d3.scan(coronaData, (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b));

        //Grab the data point at that index
        const closestDataPointToSelected = coronaData[closestIndexToSelected];
        setclosestYValueToSelected(yAccessor(closestDataPointToSelected))
    }, [selectedDate])


    return (
        <>
        <div className="Graph" ref={wrapperRef} style={{ height: chartSettings.height }}>

            <svg width={dms.width} height={dms.height} ref={svgRef}
            >
                <g transform={`translate(${dms.marginLeft}, ${dms.marginTop})`}>

                    <XAxisTime
                        dms={dms}
                        domain={xScale.domain()}
                        range={xScale.range()}>
                    </XAxisTime>

                    {/* <YAxisLinear
                        dms={dms}
                        domain={yScale.domain()}
                        range={yScale.range()}>
                    </YAxisLinear> */}

                    {/* Corona Trendlinie */}
                    <Line
                        data={coronaData}
                        lineGenerator={lineGenerator}
                        color={'#BB5160'}
                        strokeWidth={2}
                    />


                    {/* selected grey rectangle */}
                    <rect x={xScale(selectedDate)} style={{ width: "10px", fill: '#B8B8B87f', height: dms.innerHeight }} />

                    {/* selected dot */}
                    <circle cx={xScale(selectedDate) + 2} cy={yScale(closestYValueToSelected)} r="3" style={{ stroke: '#5c5c5c', fill: '#fff', opacity: 1 }} />


                    {showTooltipsTime && <>
                        {/* hover line */}
                        <rect x={xScale(hoveredTime)} style={{ width: ".5px", height: dms.innerHeight, stroke: '#5c5c5c', strokeDasharray: '1 1', strokeWidth: "1px" }} />
                        {/* hover circle*/}
                        <circle cx={xScale(closestXValue)} cy={yScale(closestYValue)} r="3" style={{ stroke: '#5c5c5c', fill: '#fff', opacity: 1 }} />
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
                        onMouseEnter={()=>{console.log("Mouse enter"); mouseEnterCoronaEvent(event, i)}}
                        onMouseLeave={()=>{console.log("Mouse leave"); mouseLeaveCoronaEvent(event, i)}}
                        >
                            <rect x={xScale(event.Date)} y={i % 2 === 0 ? 95 : 0} style={{ visibility:event.Display === "" ? "hidden" : "unset", width: ".5px", height:i % 2 === 0 ? 50 : 90, fill: "none", stroke: '#00000085', strokeDasharray: '1 1', strokeWidth: "1px" }} />
                            <text x={xScale(event.Date) + 5} y={i % 2 === 0 ? dms.innerHeight + 50 : 15} style={{ fontSize: "0.8rem" }}
                            
                        >{event.Display}</text>
                        </g>
                    )}

                </g>
            </svg>
        </div >
            <div className="CoronaGraphInfo">
                <Popover isBordered disableShadow>
                    <Popover.Trigger>
                        <Button auto flat color="white"  size = "xxs"><AiOutlineInfoCircle /></Button>
                    </Popover.Trigger>
                    <Popover.Content>
                        <Text css={{ p: "$8" }}>Coronainfektionen in absoluten Zahlen. Nutzen Sie die Play, Reset Buttons um den Zeitverlauf zu kontrollieren. Klicken Sie auf die Zeitachse um einen Zeitpunkt zu markieren</Text>
                    </Popover.Content>
                </Popover>
            </div>
        </>
    )
}

export default CoronaGraph