import React from 'react'
import { useAppContext } from '../../contexts/appContext'

const BeschäftigungGraph = () => {

    const { time } = useAppContext()

    return (
        <>
            {time}
            < div > beschaeftigung</div >
        </>
    )
}

export default BeschäftigungGraph