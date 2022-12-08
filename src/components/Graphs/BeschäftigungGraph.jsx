import * as d3 from 'd3'
import { useState, useEffect, useRef, useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext'
import useChartDimensions from '../../hooks/useChartDimensions';
import { useD3 } from '../../hooks/useD3';

const BeschäftigungGraph = () => {

    //set margins of Graph
    const chartSettings = {
        "marginTop": 20,
        "marginRight": 30,
        "marginBottom": 30,
        "marginLeft": 200
    }

    //2_Auspraegung_Label
    const svgRef = useRef()
    const tooltip = useRef()
    const [ref, dms] = useChartDimensions(chartSettings)
    const { time, gastgewerbeData } = useAppContext()

    const xScale = useMemo(() => (
        d3.scaleLinear()
            .domain([0, d3.max(gastgewerbeData, (d) => d["ERW012__Beschaeftigte__Anzahl"])]) //array from min to max
            .range([0, dms.innerWidth])
            .nice()
    ), [dms.innerWidth])

    const yScale = useMemo(() => (d3.scaleBand()
        .domain(gastgewerbeData.map((d) => d["2_Auspraegung_Label"]))
        .range([dms.innerHeight, 0])
        .padding(0.4)
    ), [dms.innerHeight])


    const xAxis = (g) => g
        .attr("transform", `translate(0,${dms.innerHeight})`)
        .call(d3.axisBottom(xScale))

    const yAxis = (g) => g
        .call(d3.axisLeft(yScale));


    useEffect(() => {

        // create a tooltip
        const Tooltip = d3.select(svgRef.current)
            .append("div")
            .style("opacity", 1)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")


        const svgElement = d3.select(svgRef.current)

        //apply styles to X-Axis
        svgElement.select(".x-axis").call(xAxis);

        //apply styles to Y-Axis
        svgElement.select(".y-axis").call(yAxis);


    }, [dms]);


    return (
        <div className="Graph" ref={ref}>
            <svg width={dms.width} height={dms.height} ref={svgRef}>
                <g transform={`translate(${dms.marginLeft}, ${dms.marginTop})`}>
                    <g className="x-axis" />
                    <g className="y-axis" />
                    <g className="plot">
                        {gastgewerbeData.map((d, i) => (
                            <rect
                                key={i}
                                x={0}
                                y={yScale(d["2_Auspraegung_Label"])}
                                height={yScale.bandwidth()}
                                width={xScale(d["ERW012__Beschaeftigte__Anzahl"])}
                                fill={"#69b3a2"}
                            />
                        ))}
                    </g>
                </g>
            </svg>

            <div className="tooltip" ref={tooltip} style={{ backgroundColor: "white", borderRadius: "5px", height: "100px", width: "100px" }}>
                Beschäftigte: {2342}
            </div>

        </div>
    )
}

export default BeschäftigungGraph

