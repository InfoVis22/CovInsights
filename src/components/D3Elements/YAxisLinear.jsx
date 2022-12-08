import { useMemo, useRef } from "react"
import * as d3 from 'd3'

//domain: data values
//range: pixel values
const YAxisLinear = ({ dms, domain = [0, 100], range = [0, 300] }) => {

    const axisRef = useRef()

    const ticks = useMemo(() => {

        console.log(domain)

        const yScale = d3.scaleLinear()
            .domain(domain)
            .range(range)

        return yScale.ticks().map(value => ({ value, yOffset: yScale(value) }))

    }, [domain.join("-"), range.join("-")])


    return (
        <g className="y-axis" ref={axisRef}>

            {/* Generate Line */}
            <path d={`M -6 0 h 6 V ${dms.innerHeight} h -6`} fill="none" stroke="currentColor" />

            {/* Generate Ticks */}
            {ticks.map(({ value, yOffset }) => (
                <g key={value} transform={`translate(0, ${yOffset})`}>
                    <line x2="-6" stroke="currentColor" />
                    <text key={value} style={{ fontSize: "8px", textAnchor: "end", transform: "translate(-10px, 0.32em)" }}>
                        {value}
                    </text>
                </g>
            ))}
        </g>
    )
}

export default YAxisLinear