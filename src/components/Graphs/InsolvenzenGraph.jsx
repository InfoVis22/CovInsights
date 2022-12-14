import { useEffect, useMemo, useRef, useState } from "react"
import { useAppContext } from "../../contexts/appContext"
import useChartDimensions from "../../hooks/useChartDimensions"
import XAxisTime from "../D3Elements/XAxisTime"
import YAxisLinear from "../D3Elements/YAxisLinear"
import Line from "../D3Elements/Line"
import Legend from "../D3Elements/Legend.jsx";
import { categories } from "../../settings.js"
import * as d3 from 'd3'



//set margins of Graph
const chartSettings = {
    height: 150,
    marginTop: 20,
    marginRight: 30,
    marginBottom: 20,
    marginLeft: 40
}

const InsolvenzGraph = () => {
    const svgRef = useRef()
    const [wrapperRef, dms] = useChartDimensions(chartSettings)
    const { insolvenzData, setShowTooltipsTime, hoveredTime, setHoveredTime, showTooltipsTime, selectedDate, setSelectedDate } = useAppContext()
    const [closestXValueBeherbergung, setClosestXValueBeherbergung] = useState(0)
    const [closestYValueBeherbergung, setClosestYValueBeherbergung] = useState(0)
    const [closestXValueGastronomie, setClosestXValueGastronomie] = useState(0)
    const [closestYValueGastronomie, setClosestYValueGastronomie] = useState(0)

    const xAccessor = (d) => d.Date;
    const yAccessor = (d) => d.Insolvenzverfahren;


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
        .domain([0, d3.max(insolvenzData, (d) => yAccessor(d))])
        .range([dms.innerHeight, 0])
        .nice()
    ), [dms.innerWidth])

    const lineGenerator = d3.line(d => xScale(xAccessor(d)), d => yScale(yAccessor(d))).curve(d3.curveMonotoneX)


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
        setHoveredTime(null)
        setShowTooltipsTime(false)
    }

    useMemo(() => {
        //calculate closest data point from mouse position
        const getDistanceFromHoveredDate = (d) => Math.abs(xAccessor(d) - selectedDate);

        //Beherbergung: WZ08-55; Gastronomie: WZ08-56
        const closestIndexBeherbergung = d3.scan(insolvenzData, (a, b) => getDistanceFromHoveredDate(a) - getDistanceFromHoveredDate(b));
        const closestIndexGastronomie = closestIndexBeherbergung + 1 //hahah shitty quick fix aber funktioniert

        //Grab the data point at that index
        const closestDataPointBeherbergung = insolvenzData[closestIndexBeherbergung];
        const closestDataPointGastronomie = insolvenzData[closestIndexGastronomie];

        setClosestXValueBeherbergung(xAccessor(closestDataPointBeherbergung))
        setClosestYValueBeherbergung(yAccessor(closestDataPointBeherbergung))
        setClosestXValueGastronomie(xAccessor(closestDataPointGastronomie))
        setClosestYValueGastronomie(yAccessor(closestDataPointGastronomie))
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
                        range={yScale.range()}>
                    </YAxisLinear>

                    {/* Line for Beherbergung */}
                    <Line
                        data={insolvenzData.filter(d => d["4_Auspraegung_Code"] === "WZ08-56")}
                        lineGenerator={lineGenerator}
                        color={categories.Beherbergung.color}
                        strokeWidth={3}
                    />

                    {/* Line Graph for Gastgewerbe */}
                    <Line
                        data={insolvenzData.filter(d => d["4_Auspraegung_Code"] !== "WZ08-56")}
                        lineGenerator={lineGenerator}
                        color={categories.Gastronomie.color}
                        strokeWidth={3}
                    />


                    {/* selected grey rectangle */}
                    <rect x={xScale(selectedDate)} style={{ width: "10px", fill: '#B8B8B87f', height: dms.innerHeight }} />

                    {showTooltipsTime && <>
                        {/* hover dotted line */}
                        <rect x={xScale(hoveredTime)} style={{ width: ".5px", height: dms.innerHeight, stroke: '#5c5c5c', strokeDasharray: '1 1', strokeWidth: "1px" }} />
                    </>}

                    {/* hover Beherbergung circle*/}
                    <circle cx={xScale(closestXValueBeherbergung)} cy={yScale(closestYValueBeherbergung)} r="3" style={{ stroke: '#5c5c5c', fill: '#fff', opacity: 1 }} />

                    {/* hover Gastronomie circle*/}
                    <circle cx={xScale(closestXValueGastronomie)} cy={yScale(closestYValueGastronomie)} r="3" style={{ stroke: '#5c5c5c', fill: '#fff', opacity: 1 }} />





                    {/* actionListener rect over graph area*/}
                    <rect className="actionListener" width={dms.innerWidth} height={dms.innerHeight}
                        fill='transparent'
                        onMouseEnter={mouseEnterEvent}
                        onMouseMove={mouseMoveEvent}
                        onMouseLeave={mouseLeaveEvent}
                    // onTouchStart={mouseEnterEvent}
                    // onTouchMove={mouseMoveEvent}
                    // onTouchEnd={mouseLeaveEvent}
                    />

                </g>
            </svg>
        </div >
        <div style={{height: "20px"}}></div>
        <Legend vertical={false} />
        </>
    )
}

export default InsolvenzGraph