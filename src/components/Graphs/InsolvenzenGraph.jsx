import { useEffect, useMemo, useRef } from "react"
import { useAppContext } from "../../contexts/AppContext"
import useChartDimensions from "../../hooks/useChartDimensions"
import XAxisTime from "../D3Elements/XAxisTime"
import YAxisLinear from "../D3Elements/YAxisLinear"
import Line from "../D3Elements/Line"
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
    const { time, insolvenzData } = useAppContext()

    //X-Scale for graph
    const xScale = useMemo(() => (
        d3.scaleTime()
            .domain([new Date(2018, 1), d3.max(insolvenzData, (d) => d.Date)])
            .range([0, dms.innerWidth])
            .nice()
    ), [dms.innerWidth])

    //Y-Scale for graph
    const yScale = useMemo(() => (d3.scaleLinear()
        .domain([0, d3.max(insolvenzData, (d) => d.Insolvenzverfahren)])
        .range([dms.innerHeight, 0])
        .nice()
    ), [dms.innerWidth])

    const lineGenerator = d3.line(d => xScale(d.Date), d => yScale(d.Insolvenzverfahren)).curve(d3.curveMonotoneX)

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
                        data={insolvenzData.filter(d => d["4_Auspraegung_Code"] !== "WZ08-56")}
                        lineGenerator={lineGenerator}
                        color={'#B3E2D5'}
                    />

                    <Line
                        data={insolvenzData.filter(d => d["4_Auspraegung_Code"] === "WZ08-56")}
                        lineGenerator={lineGenerator}
                        color={'#FE99BD'}
                    />


                </g>
            </svg>
        </div >
    )
}

export default InsolvenzGraph