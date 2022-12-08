import { useEffect, useMemo, useRef } from "react"
import { useAppContext } from "../../contexts/AppContext"
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

const CoronaGraph = () => {
    const svgRef = useRef()
    const [wrapperRef, dms] = useChartDimensions(chartSettings)
    const { time, coronaData } = useAppContext()

    //X-Scale for graph
    const xScale = useMemo(() => (
        d3.scaleTime()
            .domain([new Date(2018, 1), d3.max(coronaData, (d) => d.Date)])
            .range([0, dms.innerWidth])
            .nice()
    ), [dms.innerWidth])

    //Y-Scale for graph
    const yScale = useMemo(() => (
        d3.scaleLinear()
            .domain([0, d3.max(coronaData, (d) => d.Inzidenz)])
            .range([dms.innerHeight, 0])
            .nice()
    ), [dms.innerWidth])


    const lineGenerator = d3.line()
        .x(d => xScale(d.Date))
        .y(d => yScale(d.Inzidenz));

    return (
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

                    <Line
                        dms={dms}
                        xScale={xScale}
                        yScale={yScale}
                        data={coronaData}
                        lineGenerator={lineGenerator}
                    />
                </g>
            </svg>
        </div >
    )
}

export default CoronaGraph