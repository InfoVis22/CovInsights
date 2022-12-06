import * as d3 from 'd3'
import { useState, useEffect, useRef, useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext'
import useChartDimensions from '../../hooks/useChartDimensions';
import { useD3 } from '../../hooks/useD3';

const BeschäftigungGraph = () => {

    const data = [
        { year: 2004, efficiency: 29.5, sales: 7483000 },
        { year: 2005, efficiency: 30.3, sales: 7660000 },
        { year: 2006, efficiency: 30.1, sales: 7762000 },
        { year: 2007, efficiency: 31.2, sales: 7562000 },
        { year: 2008, efficiency: 31.5, sales: 6769000 },
        { year: 2009, efficiency: 32.9, sales: 5402000 },
        { year: 2010, efficiency: 33.9, sales: 5636000 },
        { year: 2011, efficiency: 33.1, sales: 6093000 },
        { year: 2012, efficiency: 35.3, sales: 7245000 },
        { year: 2013, efficiency: 36.4, sales: 7586000 },
        { year: 2014, efficiency: 36.5, sales: 7708000 },
        { year: 2015, efficiency: 37.2, sales: 7517000 },
        { year: 2016, efficiency: 37.7, sales: 6873000 },
        { year: 2017, efficiency: 39.4, sales: 6081000 },
    ]

    //set margins of Graph
    const chartSettings = {
        "marginTop": 20,
        "marginRight": 30,
        "marginBottom": 30,
        "marginLeft": 40
    }

    const [dataset, setDataset] = useState(data)
    const [ref, dms] = useChartDimensions(chartSettings)
    const svgRef = useRef()
    const { time } = useAppContext()

    const xScale = useMemo(() => (
        d3.scaleLinear()
            .domain([0, d3.max(dataset, (d) => d.sales)]) //array from min to max
            .rangeRound([0, dms.innerWidth])
            .nice()
    ), [dms.innerWidth])

    const yScale = useMemo(() => (d3.scaleBand()
        .domain(dataset.map((d) => d.year))
        .rangeRound([dms.innerHeight, 0])
        .padding(0.1)
    ), [dms.innerHeight])


    const xAxis = (g) => g
        .attr("transform", `translate(0,${dms.innerHeight})`)
        .call(d3.axisBottom(xScale))

    const yAxis = (g) => g
        .call(d3.axisLeft(yScale))


    useEffect(() => {

        const svgElement = d3.select(svgRef.current)

        //apply styles to X-Axis
        svgElement.select(".x-axis").call(xAxis);

        //apply styles to Y-Axis
        svgElement.select(".y-axis").call(yAxis);
        console.log("run!")

    }, [dms]);


    return (
        <div ref={ref} style={{ height: "100%" }}>
            <svg width={dms.width} height={dms.height} ref={svgRef}>
                <g transform={`translate(${dms.marginLeft}, ${dms.marginTop})`}>
                    <g className="x-axis" />
                    <g className="y-axis" />
                    <g className="plot" />
                </g>
            </svg>
        </div>
    )
}

export default BeschäftigungGraph

