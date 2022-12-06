import { useMemo } from "react"
import * as d3 from 'd3'

//domain: data values
//range: pixel values
const YAxis = ({ domain = [0, 100], range = [150, 0], }) => {

    const ticks = useMemo(() => {
        //the scale to convert from data range to pixel range
        const yScale = d3.scaleLinear()
            .domain(domain)
            .range(range)

        const height = range[1] - range[0]
        const pixelsPerTick = 30
        const numberOfTicksTarget = Math.max(1, Math.floor(height / pixelsPerTick))

        return yScale.ticks(numberOfTicksTarget).map(value => ({ value, yOffset: yScale(value) }))

    }, [domain.join("-"), range.join("-")])

    return (
        <svg>
            <path
                d={["M", -6, -range[0], "h", 6, "V", -range[1], "h", -6,].join(" ")}
                fill="none"
                stroke="currentColor"
            />

            {ticks.map(({ value, yOffset }) => (
                <g key={value} transform={`translate(0, ${-yOffset})`}>
                    <line x2="6" stroke="currentColor" />
                    <text key={value} style={{
                        fontSize: "10px",
                        textAnchor: "start",
                        transform: "translateX(-20px)"
                    }}>
                        {value}
                    </text>
                </g>
            ))}


        </svg>
    )
}

export default YAxis