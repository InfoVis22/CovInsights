import React, { useEffect, useMemo, useRef } from 'react'
import * as d3 from 'd3'



const Line = ({ data, lineGenerator }) => {

    const lineRef = useRef()

    useEffect(() => {
        const transition = d3.transition().duration(1000);

        const line = d3.select('#line');
        line
            .datum(data)
            .transition(transition)
            .attr('d', lineGenerator);
    }, [data])


    return (
        <path id="line" ref={lineRef} stroke="black" strokeWidth="1.5" fill="none" />
    )
}

export default Line