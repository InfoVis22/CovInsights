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


    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = (d, Tooltip) => {
        Tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }

    const mousemove = (d, Tooltip) => {
        Tooltip
            .html("The exact value of<br>this cell is: " + d?.value)
            .style("left", (d.clientX + 70) + "px")
            .style("top", (d.clientY) + "px")
    }

    const mouseleave = (d, Tooltip) => {
        Tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }






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

        const bars = (r) => r.data(gastgewerbeData)
            .enter()
            .append("rect")
            .attr("x", dms.marginLeft)
            .attr("y", (d) => yScale(d["2_Auspraegung_Label"]) + dms.marginTop)
            .attr("width", (d) => xScale(d["ERW012__Beschaeftigte__Anzahl"]))
            .attr("height", yScale.bandwidth())
            .attr("fill", "#69b3a2")
            .on("mouseover", (d) => mouseover(d, Tooltip))
            .on("mousemove", (d) => mousemove(d, Tooltip))
            .on("mouseleave", (d) => mouseleave(d, Tooltip))



        const svgElement = d3.select(svgRef.current)

        //apply styles to X-Axis
        svgElement.select(".x-axis").call(xAxis);

        //apply styles to Y-Axis
        svgElement.select(".y-axis").call(yAxis);

        //Bars
        svgElement.selectAll("myRect").call(bars);



    }, [dms]);


    return (
        <div className="Graph" ref={ref}>

            <svg width={dms.width} height={dms.height} ref={svgRef}>
                <g transform={`translate(${dms.marginLeft}, ${dms.marginTop})`}>
                    <g className="x-axis" />
                    <g className="y-axis" />
                    <g className="plot" />
                </g>
            </svg>

            <div className="tooltip" ref={tooltip} style={{ backgroundColor: "white", borderRadius: "5px", height: "100px", width: "100px" }}>
                Beschäftigte: {2342}
            </div>

        </div>
    )
}

export default BeschäftigungGraph

