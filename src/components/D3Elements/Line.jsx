import React, { useEffect, useMemo, useRef } from 'react'
import * as d3 from 'd3'



const Line = ({ data, lineGenerator }) => {

    const lineRef = useRef()
    const transition = d3.transition().ease(d3.easeCubic).duration(1000);

    const updateLine = useMemo(() => (
        //draws line to canvas
        d3.select(lineRef.current)
            .datum(data)
            .transition(transition)
            .attr('d', lineGenerator)
    ), [data])

    useEffect(() => {
        d3.select(lineRef.current)
            .datum(data)
            .attr('d', lineGenerator)
    }, [])

    d3.select(lineRef.current)
        .datum(data)
        .transition(transition)
        .attr('d', lineGenerator)

    return (
        <path ref={lineRef} stroke="darkblue" strokeWidth="1.5" fill="none" />
    )
}

export default Line