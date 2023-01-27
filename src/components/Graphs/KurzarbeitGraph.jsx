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




const KurzarbeitGraph = () => {
    //Context hook
    const { kurzarbeitData, setShowTooltipsTime, hoveredTime, setHoveredTime, showTooltipsTime, selectedDate, setSelectedDate, verticalLayout } = useAppContext()

    //set margins of Graph
    const chartSettings = {
        height: verticalLayout ? 250 : 150,
        marginTop: 20,
        marginRight: 30,
        marginBottom: 30,
        marginLeft: 45
    }

    //hooks
    const svgRef = useRef()
    const [wrapperRef, dms] = useChartDimensions(chartSettings)

    //Component State
    const [closestXValueBeherbergung, setClosestXValueBeherbergung] = useState(0)
    const [closestYValueBeherbergung, setClosestYValueBeherbergung] = useState(0)
    const [closestXValueGastronomie, setClosestXValueGastronomie] = useState(0)
    const [closestYValueGastronomie, setClosestYValueGastronomie] = useState(0)
    const [kurzarbeitDataFiltered, setKurzarbeitDataFiltered] = useState([])

    //to select and deselect Sectors
    const legendItems = categories.filter(c => c.name === "Beherbergung" || c.name === "Gastronomie")
    const [selectedBranchen, setSelectedBranchen] = useState(legendItems)
    const [hoveredBranche, setHoveredBranche] = useState(null)

    //accessors
    const xAccessor = (d) => d.Date;
    const yAccessor = (d) => d.Kurzarbeiter;

    useEffect(() => {
        const filtered = kurzarbeitData.fil

    }, [])



    //X-Scale for graph
    const xScale = useMemo(() => (
        d3.scaleTime()
            .domain([new Date(2018, 1), new Date(2022, 12)])
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
    }

    useMemo(() => {
        //calculate closest data point from mouse position
        //get the date closest to the hovered date
        const getDistanceFromDate = (d) => Math.abs(d.Date - selectedDate);

        //Beherbergung: WZ08-55; Gastronomie: WZ08-56
        const BeherbergungSubset = kurzarbeitData.filter(row => row.Branche_Code === "WZ08-55")
        const GastronomieSubset = kurzarbeitData.filter(row => row.Branche_Code === "WZ08-56")

        //calculate the index of the closest data point
        const closestIndexBeherbergung = d3.scan(BeherbergungSubset, (a, b) => getDistanceFromDate(a) - getDistanceFromDate(b));
        const closestIndexGastronomie = d3.scan(GastronomieSubset, (a, b) => getDistanceFromDate(a) - getDistanceFromDate(b));

        //Grab the data point at that index
        const closestDataPointBeherbergung = BeherbergungSubset[closestIndexBeherbergung];
        const closestDataPointGastronomie = GastronomieSubset[closestIndexGastronomie];

        //set state of closest data point
        setClosestXValueBeherbergung(closestDataPointBeherbergung.Date)
        setClosestYValueBeherbergung(closestDataPointBeherbergung.Kurzarbeiter)
        setClosestXValueGastronomie(closestDataPointGastronomie.Date)
        setClosestYValueGastronomie(closestDataPointGastronomie.Kurzarbeiter)

    }, [selectedDate])

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
                            range={yScale.range()}
                            labelSuffix="T"
                        >
                        </YAxisLinear>


                        {/* Line for WZ08-55 – Beherbergung and WZ08-56 – Gastronomie*/}
                        {categories.map((category, i) =>
                            <path
                                key={i}
                                stroke={category.color}
                                d={lineGenerator(kurzarbeitData.filter(row => row.Branche_Code === category.code))}
                                strokeWidth={2.5}
                                fill="none"
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


                        {/* selected Beherbergung circle*/}
                        {/* <circle cx={xScale(closestXValueBeherbergung)} cy={yScale(closestYValueBeherbergung)} r="3" style={{ stroke: '#5c5c5c', fill: '#fff', opacity: 1, transition: "all 0.2s ease-in-out" }} /> */}

                        {/* selected Gastronomie circle*/}
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
                        <Text css={{ p: "$8" }}>Kurzarbeit in absoluten Zahlen (in Tsd Mitarbeiter) unterteilt in Gastronomie und Beherbergung</Text>
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

export default KurzarbeitGraph