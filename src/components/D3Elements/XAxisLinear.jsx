import { useMemo, useRef } from "react"
import * as d3 from 'd3'

//domain: data values
//range: pixel values
const XAxisLinear = ({ dms, domain = [0, 100], range = [0, 300], labelSuffix }) => {

    const axisRef = useRef()

    const ticks = useMemo(() => {

        const pixelsPerTick = 70
        const numberOfTicksTarget = Math.max(1, Math.floor(dms.innerWidth / pixelsPerTick))

        const xScale = d3.scaleLinear()
            .domain(domain)
            .range(range)

        const ticks = xScale.ticks(numberOfTicksTarget).map(value => ({ value, xOffset: xScale(value) }))
        return ticks
    }, [domain.join("-"), range.join("-")])



    return (
        <g className="x-axis" transform={`translate(0,${dms.innerHeight})`} ref={axisRef}>

            {/* Generate Line */}
            <path d={`M ${range[0]} 6 v -6 H ${dms.innerWidth} v 0`} fill="none" stroke="#626262" strokeWidth={1.5} />

            {/* Generate Ticks */}
            {ticks.map(({ value, xOffset }) => (
                <g key={value} transform={`translate(${xOffset}, 0)`} style={{ transition: "all 0.5s ease-in-out 0s" }}>
                    <line y2="6" stroke="#626262" />
                    <text key={value} style={{ fontSize: "11px", textAnchor: "middle", transform: "translate(5px, 17px)" }}>
                        {value}{labelSuffix}
                    </text>
                </g>
            ))}
        </g>
    )
}

export default XAxisLinear