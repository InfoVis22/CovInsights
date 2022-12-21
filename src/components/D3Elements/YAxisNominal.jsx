import { useMemo, useRef } from "react"
import * as d3 from 'd3'

//domain: data values
//range: pixel values
const YAxisNominal = ({ dms, domain = ["item1", "item2", "item3"], range = [0, 300] }) => {

    const axisRef = useRef()

    const ticks = useMemo(() => {
        const yScale = d3.scaleBand()
            .domain(domain)
            .range(range)
            .padding(0.4)

        return yScale.domain().map(value => ({ value, yOffset: yScale(value) }))

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

export default YAxisNominal