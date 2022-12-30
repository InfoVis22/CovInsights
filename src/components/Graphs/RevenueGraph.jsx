import { useEffect, useMemo, useRef, useState } from "react"
import useChartDimensions from "../../hooks/useChartDimensions";
import { useAppContext } from "../../contexts/appContext"
import * as d3 from 'd3'
import YAxisNominal from "../D3Elements/YAxisNominal";
import XAxisLinear from "../D3Elements/XAxisLinear";

//set margins of Graph
const chartSettings = {
    height: 300,
    marginTop: 20,
    marginRight: 30,
    marginBottom: 30,
    marginLeft: 100
}

const RevenueGraph = () => {

    const svgRef = useRef();
    const [wrapperRef, dms] = useChartDimensions(chartSettings)
    const { umsatzData, hoveredTime, selectedDate, setSelectedDate } = useAppContext()
    const [closestXValue, setClosestXValue] = useState(0)
    const [closestYValue, setClosestYValue] = useState(0)
    const [showTooltip, setShowTooltip] = useState(false)
    const [filteredUmsatzData, setFilteredUmsatzData] = useState([])

    const xAccessor = (d) => d.Umsatz;
    const yAccessor = (d) => d.Branche;

    useEffect(() => {

        const yearMonthTime = [selectedDate.getFullYear(), selectedDate.getMonth()+1].join("-")
        const filteredData = umsatzData.filter(d => (d.Date.getFullYear() + "-" + d.Date.getMonth()) === yearMonthTime)
        
        setFilteredUmsatzData(filteredData)
    }, [selectedDate])

    //X-Scale for graph
    const xScale = useMemo(() => (
        d3.scaleLinear()
            .domain([0, d3.max(umsatzData, d => xAccessor(d))])
            .range([0, dms.innerWidth])
            .nice()
    ), [dms.innerWidth])

    //Y-Scale for graph
    const yScale = useMemo(() => (
        d3.scaleBand()
            .domain(umsatzData.map(d => d.Branche_Label))
            .range([dms.innerHeight, 0])
            .padding(0.4)

    ), [dms.innerHeight])

    //mouse events
    const mouseEnterEvent = (e) => {
        setShowTooltip(true)
    }

    const mouseMoveEvent = (e) => {
        //get x and y position relative to hovered event element
        const mousePosition = d3.pointer(e)
        //get date from x and y coordinates
        //const hoveredSector = yScale.invert(mousePosition[1]);
        //console.log(yScale.step())

        //const band = d3.select(this.parentNode).datum().key;
        console.log(e)
    }

    const mouseLeaveEvent = (e) => {
        setShowTooltip(false)
    }


    const transitionStyle = { transition: "all 0.5s ease-in-out 0s" }

    const getFill = (IndustryType) => {
        if(IndustryType == "Beherbergung"){
            return "#56A3A6";
        }else if(IndustryType == "Gastronomie"){
            return "#EAA361";
        }
    }

    return (
        <div className="graph" ref={wrapperRef} style={{ height: chartSettings.height }}>
            <svg width={dms.width} height={dms.height} ref={svgRef}>
                <g transform={`translate(${dms.marginLeft}, ${dms.marginTop})`}>

     
                    {filteredUmsatzData.map((d, i) =>
                    
                        <rect className="bar"
                            key={i}
                            x={0}
                            y={yScale(d.Branche_Label) - yScale.bandwidth() / 2}
                            width={xScale(xAccessor(d))}
                            height={yScale.bandwidth()}
                            style={{ ...transitionStyle, fill: getFill(d.Type)}} />
                    )}

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

                    {/* Tooltip */}
                    <div className="tooltip" style={{ display: showTooltip ? "block" : "none" }}>
                        <p>Tooltip</p>
                    </div>

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
    )
}

export default RevenueGraph