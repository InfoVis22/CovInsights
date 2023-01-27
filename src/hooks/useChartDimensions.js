import { ResizeObserver } from '@juggle/resize-observer';
import { useEffect, useRef, useState } from 'react'

const useChartDimensions = (passedSettings) => {

    //callback ref
    const wrapperRef = useRef()

    const dimensions = combineChartDimensions(passedSettings)

    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)

    useEffect(() => {

        //return if width and height are set
        if (dimensions.width && dimensions.height) return [wrapperRef, dimensions]

        //select the current element
        const element = wrapperRef.current

        //rerender graph if size of container changes
        const resizeObserver = new ResizeObserver(
            entries => {
                console.log("CHANGE")
                if (!Array.isArray(entries)) return
                if (!entries.length) return
                const entry = entries[0]
                if (width != entry.contentRect.width)
                    setWidth(entry.contentRect.width)
                if (height != entry.contentRect.height)
                    setHeight(entry.contentRect.height)
            }
        )
        //observe chart wrapper
        resizeObserver.observe(element)

        //unobserve after component dismounts
        return () => resizeObserver.unobserve(element)
    }, [])


    const newSettings = combineChartDimensions({
        ...dimensions,
        width: dimensions.width || width,
        height: dimensions.height || height,
    })


    return [wrapperRef, newSettings]
}


const combineChartDimensions = (dimensions) => {

    //default margins
    const parsedDimensions = {
        ...dimensions,
        marginTop: dimensions.marginTop || 10,
        marginRight: dimensions.marginRight || 10,
        marginBottom: dimensions.marginBottom || 40,
        marginLeft: dimensions.marginLeft || 75,
    }

    return {
        ...parsedDimensions,
        innerHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
        innerWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
    }
}

export default useChartDimensions