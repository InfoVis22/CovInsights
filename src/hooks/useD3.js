import { useEffect, useRef } from 'react';
import * as d3 from 'd3'

//renderChartFn: callback renderFn of each graph
//dependencies: set of objects that when changed let the graph rerender
export const useD3 = (renderChartFn, dependencies) => {

    //ref object
    const ref = useRef();

    //gets called when first assigned in a graph component
    useEffect(() => {
        renderChartFn(d3.select(ref.current));
    }, dependencies);

    //the react ref is returned
    return ref;
}