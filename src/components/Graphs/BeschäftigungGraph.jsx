import { max, scaleBand, scaleLinear } from 'd3'
import { useState } from 'react';
import { useAppContext } from '../../contexts/appContext'
import { useD3 } from '../../hooks/useD3';

const BeschäftigungGraph = () => {

    const data = [
        { year: 1988, efficiency: 24.3, sales: 8949000 },
        { year: 1989, efficiency: 27.6, sales: 10979000 },
        { year: 1990, efficiency: 28, sales: 9303000 },
        { year: 1991, efficiency: 28.4, sales: 8185000 },
        { year: 1992, efficiency: 27.9, sales: 8213000 },
        { year: 1993, efficiency: 28.4, sales: 8518000 },
        { year: 1994, efficiency: 28.3, sales: 8991000 },
        { year: 1995, efficiency: 28.6, sales: 8620000 },
        { year: 1996, efficiency: 28.5, sales: 8479000 },
        { year: 1997, efficiency: 28.7, sales: 8217000 },
        { year: 1998, efficiency: 28.8, sales: 8085000 },
        { year: 1999, efficiency: 28.3, sales: 8638000 },
        { year: 2000, efficiency: 28.5, sales: 8778000 },
        { year: 2001, efficiency: 28.8, sales: 8352000 },
        { year: 2002, efficiency: 29, sales: 8042000 },
        { year: 2003, efficiency: 29.5, sales: 7556000 },
        { year: 2004, efficiency: 29.5, sales: 7483000 },
        { year: 2005, efficiency: 30.3, sales: 7660000 },
        { year: 2006, efficiency: 30.1, sales: 7762000 },
        { year: 2007, efficiency: 31.2, sales: 7562000 },
        { year: 2008, efficiency: 31.5, sales: 6769000 },
        { year: 2009, efficiency: 32.9, sales: 5402000 },
        { year: 2010, efficiency: 33.9, sales: 5636000 },
        { year: 2011, efficiency: 33.1, sales: 6093000 },
        { year: 2012, efficiency: 35.3, sales: 7245000 },
        { year: 2013, efficiency: 36.4, sales: 7586000 },
        { year: 2014, efficiency: 36.5, sales: 7708000 },
        { year: 2015, efficiency: 37.2, sales: 7517000 },
        { year: 2016, efficiency: 37.7, sales: 6873000 },
        { year: 2017, efficiency: 39.4, sales: 6081000 },
    ]


    //set margins of Graph
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };


    const width = 400
    const height = 300
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom


    const [dataset, setDataset] = useState(data)
    const { time } = useAppContext()


    const yScale = scaleBand()
        .domain(dataset.map((d) => d.year))
        .rangeRound([innerHeight, 0])
        .padding(0.1)

    const xScale = scaleLinear()
        .domain([0, max(dataset, (d) => d.sales)]) //array from min to max
        .rangeRound([0, innerWidth])
        .nice()





    return (
        <>
            <svg width={width} height={height}>

                <g transform={`translate(${margin.left}, ${margin.top})`} >



                    {/* X-Axis */}
                    <g transform={`translate(0, ${innerHeight})`} >
                        <line x1={0} x2={innerWidth} stroke='black' />
                        {xScale.ticks().map((tickValue) =>
                            <g key={tickValue} transform={`translate(${xScale(tickValue)}, 0)`}>
                                <line y1={-innerHeight} y2={-1} stroke='lightgray' />
                                <line y1={0} y2={6} stroke='black' />
                                <text style={{ textAnchor: 'middle' }} dy='25'>{tickValue}</text>
                            </g>)
                        }

                    </g>

                </g>
            </svg>
        </>
    )
}

export default BeschäftigungGraph