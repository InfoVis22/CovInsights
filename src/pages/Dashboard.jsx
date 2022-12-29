import './Dashboard.scss'
import Card from '../components/Card/Card'
import Timeline from '../components/Timeline/Timeline'
import * as d3 from 'd3'
import { useAppContext } from '../contexts/appContext'
import { useEffect, useState } from 'react'
import CoronaGraph from '../components/Graphs/CoronaGraph'
import InsolvenzenGraph from '../components/Graphs/InsolvenzenGraph'
import UmsatzGraph from '../components/Graphs/UmsatzGraph'
import moment from 'moment'
import DateControls from '../components/DateControls/DateControls'
import Insolvenzen_Barchart from "../components/Graphs/Insolvenzen_Barchart";
import BeschäftigungsGraphNeu from '../components/Graphs/BeschäftigungsGraphNeu'


const Dashboard = () => {

    //---- define AppContext ----
    const { hoveredTime, setGastgewerbeData, setCoronaData, setInsolvenzData, setTimeFrame, setUmsatzData } = useAppContext()

    //---- Dashboard State ----
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [selectedDate, setSelectedDate] = useState(new Date("2018-01-01"))

    //---- load different data ----
    const loadData = async () => {
        console.log("Load Data...")

        //load Gastgewerbe (general) Data 2005 - 2022
        const rawGastgewerbeData = await d3.dsv(";", "../data/Gastgewerbe05-22.csv")
        const gastgewerbeData = rawGastgewerbeData.filter(d => d.Zeit == 2019)
        console.log("heuir")
        console.log(gastgewerbeData)
        setGastgewerbeData(gastgewerbeData)


        //load Umsatz Data - 2022
        const rawUmsatzData = await d3.dsv(";", "../cleaned_data/Umsatz.csv")
        const umsatzData = rawUmsatzData
            .filter(d => +d.Jahr >= 2018 && d.Preisart === "REAL")
            .map(d => ({ ...d, Date: new Date(d.Jahr, d.Monat - 1), Umsatz: +d.Umsatz, Umsatz_Veraenderung: +d.Umsatz_Veraenderung }))
        setUmsatzData(umsatzData)


        //load Insolvenz data 2013-2022
        const rawInsolvenzData = await d3.dsv(";", "../data/Insolvenzverfahren_2008_2022.csv")

        //Beherbergung: WZ08-55; Gastronomie: WZ08-56
        let insolvenzData = rawInsolvenzData.filter(d => d["3_Auspraegung_Label"] == "eröffnet" && (d["4_Auspraegung_Code"] == "WZ08-55" || d["4_Auspraegung_Code"] == "WZ08-56")) //
        insolvenzData = insolvenzData.map(d => {
            const month = +d["2_Auspraegung_Code"].slice(-2) - 1
            const date = new Date(d.Zeit, month)
            return ({
                ...d,
                Date: date,
                Insolvenzverfahren: +d.Insolvenzverfahren
            })
        })
        setInsolvenzData(insolvenzData)


        //load Corona Data 2020-2022
        const rawCoronaInzidenzData = await d3.dsv(";", "../data/Coronainfektionen_7-Tage_Trend_DE20_22.csv")
        const coronaData = rawCoronaInzidenzData.map(d => ({
            Date: new Date(d.Date),
            Inzidenz: +d.Inzidenz
        }))
        setCoronaData(coronaData)

        setIsLoadingData(false)
        console.log("loading complete!")
    }

    useEffect(() => {
        //---- Initialize State ----
        setTimeFrame({ min: new Date(2018, 0), max: new Date() })

        loadData()
    }, [])

    if (isLoadingData) return

    return (
        <div className="Page Home">
            <div className="Top">
                <Card title="Beschäftigung im Gastgewerbe" subtitle="In tausend, gegliedert in Vollzeit, Teilzeit und Kurzarbeit">
                    
                </Card>
                <Card title="Umsatz im Gastgewerbe" subtitle={"in Mio € ( " + selectedDate.toLocaleString("de-DE", {month: "short",year: "numeric"})+" )"}>
                    <UmsatzGraph selectedDate={selectedDate} />
                </Card>
                <Card title="Insolvenzen im Gastgewerbe" subtitle="Anzahl der Insolvenzen nach Gewerbekategorie">
                    <Insolvenzen_Barchart/>
                </Card>
            </div>
            <div className="Middle">
                <Timeline title="Insolvenzen" subtitle="in Anzahl">
                    <InsolvenzenGraph selectedDate={selectedDate} />
                </Timeline>
            </div>
            <div className="Bottom">
                <Timeline title="Coronainfektionen in Deutschland" subtitle="als 7-Tage-Inzidenz je 100.000 Einwohner">
                    <CoronaGraph selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                </Timeline>
                <DateControls selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            </div>

            <div className="Debug visible">
                <h3>Debug</h3>
              
            </div>
        </div>
    )
}

export default Dashboard
