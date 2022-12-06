import { useMemo } from 'react'
import useChartDimensions from '../../hooks/useChartDimensions'
import XAxis from '../D3Elements/XAxis'
import * as d3 from 'd3'
import YAxis from '../D3Elements/YAxis'


const chartSettings = {
}

const ChartWithDim = () => {
    const [ref, dms] = useChartDimensions(chartSettings)

    const xScale = useMemo(() => (
        d3.scaleLinear()
            .domain([0, 100])
            .range([0, dms.boundedWidth])
    ), [dms.boundedWidth])

    const yScale = useMemo(() => (
        d3.scaleLinear()
            .domain([0, 100])
            .range([0, dms.boundedHeight])
    ), [dms.boundedHeight])

    return (
        <div
            className="Chart__wrapper"
            ref={ref}
            style={{ height: "300px" }}>
            <svg width={dms.width} height={dms.height}>

                <g transform={`translate(${[dms.marginLeft, dms.marginTop].join(",")})`}>

                    <rect width={dms.boundedWidth} height={dms.boundedHeight} fill="lavender" />

                    {/* X-Axis */}
                    <g transform={`translate(${[0, dms.boundedHeight].join(",")})`}>
                        <XAxis domain={xScale.domain()} range={xScale.range()} />
                    </g>

                    {/* Y-Axis */}
                    <g transform={`translate(${[0, dms.boundedHeight].join(",")})`}>
                        <YAxis domain={yScale.domain()} range={yScale.range()} />
                    </g>

                </g>
            </svg>
        </div>
    )
}

export default ChartWithDim