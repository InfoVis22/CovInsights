import { useEffect, useMemo, useRef, useState } from "react"
import { useAppContext } from "../../contexts/appContext"
import useChartDimensions from "../../hooks/useChartDimensions"
import * as d3 from 'd3'
import XAxisTime from "../D3Elements/XAxisTime"
import YAxisLinear from "../D3Elements/YAxisLinear"
import Line from "../D3Elements/Line"

//set margins of Graph
const chartSettings = {
    height: 150,
    marginTop: 20,
    marginRight: 30,
    marginBottom: 20,
    marginLeft: 40
}

const CoronaGraph = (props) => {
    const svgRef = useRef();
    const [wrapperRef, dms] = useChartDimensions(chartSettings)
    const { setHoveredTime, hoveredTime, coronaData, showTooltipsTime, setShowTooltipsTime } = useAppContext()
    const [closestXValue, setClosestXValue] = useState(0)
    const [closestYValue, setClosestYValue] = useState(0)

    const [closestYValueToSelected, setclosestYValueToSelected] = useState(0)

    const xAccessor = (d) => d.Date;
    const yAccessor = (d) => d.Inzidenz;

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

    const mouseMoveEvent = (e) => {
        //get x and y position relative to hovered event element
        const mousePosition = d3.pointer(e)
        //get date from x and y coordinates
        const hoveredDate = xScale.invert(mousePosition[0]);

        //set global state of selected line
        setHoveredTime(hoveredDate)
    }

    const mouseLeaveEvent = (e) => {
        setShowTooltipsTime(false)
    }

    const mouseEventDown = (e) => {
        const clickedDate = hoveredTime;
        props.setSelectedDate(clickedDate);
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
        const getDistanceFromHoveredDate = (d) => Math.abs(xAccessor(d) - props.selectedDate);
        const closestIndexToSelected = d3.scan(coronaData, (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b));

        //Grab the data point at that index
        const closestDataPointToSelected = coronaData[closestIndexToSelected];
        setclosestYValueToSelected(yAccessor(closestDataPointToSelected))
    }, [props.selectedDate])

    const dateToX = (date) => {
        console.log(date)
        //Todo convert a date into the X value on the graph

        return 100;
    }

    return (
        <div className="Graph" ref={wrapperRef} style={{ height: chartSettings.height }}>

            <svg width={dms.width} height={dms.height} ref={svgRef}
            >
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

                    <rect x={xScale(props.selectedDate)} style={{ width: "3px", fill:'red', height: dms.innerHeight, stroke: '#B8B8B8', strokeWidth: "3px", transform: "translateY(-3px)" }} />
     
                    <Line
                        data={coronaData}
                        lineGenerator={lineGenerator}
                        color={'#2D2327'}
                        strokeWidth={3}
                    />

                    <circle cx={xScale(props.selectedDate)+2}  cy={yScale(closestYValueToSelected)}r="3" style={{ stroke: '#5c5c5c', fill: '#fff', opacity: 1 }} />

    
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

                </g>
            </svg>
        </div >
    )
}

export default CoronaGraph