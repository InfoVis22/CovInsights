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
            <path d={`M 0 0 h 0 V ${dms.innerHeight} h 0`} fill="none" stroke="#626262" strokeWidth={1.5} />

            {/* Generate Ticks */}
            {ticks.map(({ value, yOffset }) => (
                <g key={value} transform={`translate(-10, ${yOffset}) rotate(-45)`}>
                    <text key={value} style={{ fontSize: "11px", textAnchor: "end", transform: "translate(0px, 0.32em)", fontWeight: "500" }}>
                        {value}
                    </text>
                </g>
            ))}
        </g>
    )
}

export default YAxisNominal