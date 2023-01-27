import './DateControls.scss'
import { useEffect, useState, useRef } from 'react'
import { useAppContext } from '../../contexts/appContext'

const DateControls = () => {

    let timer
    const [count, setCount] = useState(0)
    const [isPlaying, setPlaying] = useState(false)
    const { selectedDate, setSelectedDate } = useAppContext();

    const updateCount = () => {
        timer = !timer && setInterval(() => {
            setCount(prevCount => prevCount + 1)
        }, 100)

        //Limit of five years in days
        //if (count === 1835) clearInterval(timer)
    }

    const handleSpacebar = (e) => {
        if (e.keyCode === 32) {
            setPlaying(old => !old)
        }
    }

    useEffect(() => {
        if (isPlaying) {
            updateCount()

            //Here is the magic, adding 2 day every second
            let newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() + 2);
            setSelectedDate(newDate);

            //Here is the reset if the date goes at the end
            const cutoffDate = new Date("2023-01-01")
            if (newDate > cutoffDate) {
                handleReset();
            }

            return () => {
                clearInterval(timer)
            }
        }
    }, [isPlaying, count])

    useEffect(() => {
        //add eventlistener to spacebar
        document.addEventListener("keyup", handleSpacebar);
        console.log("Adding eventHandler")

        return () => {
            document.removeEventListener("keyup", handleSpacebar);
            console.log("Removing eventHandler")
        }
    }, [])

    const handleReset = () => {
        const resetDate = new Date("2018-01-01")
        setSelectedDate(resetDate)
        setPlaying(false)
    }
    return (
        <div className="DateControls">
            <div className="buttons">
                {!isPlaying ?
                    (<button onClick={() => setPlaying(true)}>Play</button>) :
                    (<button onClick={() => setPlaying(false)}>Pause</button>)}

                <button onClick={() => handleReset()}>Reset</button>
            </div>

            <p>{selectedDate.toLocaleString("de-DE", {
                day: "numeric",
                month: "short",
                year: "numeric",
            })}</p>

        </div>
    )
}

export default DateControls
