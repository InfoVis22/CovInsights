import { useMemo, useRef } from "react"
import * as d3 from 'd3'

//domain: data values
//range: pixel values
const XAxisTime = ({ dms, domain = [0, 100], range = [0, 300] }) => {

    const axisRef = useRef()

    const ticks = useMemo(() => {

        const pixelsPerTick = 70
        const numberOfTicksTarget = Math.max(1, Math.floor(dms.innerWidth / pixelsPerTick))

        const xScale = d3.scaleTime()
            .domain(domain)
            .range(range)

        const ticks = xScale.ticks(numberOfTicksTarget).map(value => ({ value, xOffset: xScale(value) }))
        return ticks
    }, [domain.join("-"), range.join("-")])

    const pad = (d) => {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }

    return (
        <g className="x-axis" transform={`translate(0,${dms.innerHeight})`} ref={axisRef}>

            {/* Generate Line */}
            <path d={`M ${range[0]} 6 v -6 H ${dms.innerWidth} v 6`} fill="none" stroke="#626262" strokeWidth={1.5} />

            {/* Generate Ticks */}
            {ticks.map(({ value, xOffset }) => (
                <g key={value} transform={`translate(${xOffset}, 0)`}>
                    <line y2="6" stroke="currentColor" />
                    <text key={value} style={{ fontSize: "11px", textAnchor: "middle", transform: "translateY(16px)" }}>
                        {pad(value.getMonth() + 1) + "." + value.getFullYear()}
                    </text>
                </g>
            ))}
        </g>
    )
}

export default XAxisTime