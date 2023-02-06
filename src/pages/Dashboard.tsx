import './Dashboard.scss'
import Card from '../components/Card/Card'
import Timeline from '../components/Timeline/Timeline'
import * as d3 from 'd3'
import { useAppContext } from '../contexts/appContext'
import { useEffect, useState } from 'react'
import moment from 'moment'

//Barcharts
import RevenueBarChart from '../components/Graphs/RevenueBarChart'
import EmploymentBarChart from '../components/Graphs/EmploymentBarChart'
import InsolvenzenProzent from '../components/Graphs/InsolvenzenProzent'

//Timeline
import InsolvenzenGraph from '../components/Graphs/InsolvenzenGraph'
import CoronaGraph from '../components/Graphs/CoronaGraph'
import KurzarbeitGraph from '../components/Graphs/KurzarbeitGraph'

//Controls
import DateControls from '../components/DateControls/DateControls'


const Dashboard = () => {

    //---- define AppContext ----
    const { setEmploymentData, setInsolvencyBarData, setCoronaData, setKurzarbeitData, insolvenzenData, setInsolvenzenData, setTimeFrame, setUmsatzData, selectedDate, verticalLayout, } = useAppContext()

    //---- Dashboard State ----
    const [isLoadingData, setIsLoadingData] = useState(true)

    //---- load different data ----
    const loadData = async () => {

        //load Employment BarChart
        const rawEmployment = await d3.dsv(";", "../data/BeschäftigungGastgewerbe.csv")
        const employmentData = rawEmployment
            .filter(d => +d.Jahr >= 2018 && (d.Branche_Code !== "WZ08-55" && d.Branche_Code !== "WZ08-56"))
            .map((row) => ({ ...row, Date: new Date(row.Jahr, (+row.Monat - 1)), Beschaeftigte: +row.Beschaeftigte, Vollzeitbeschaeftigte: +row.Vollzeitbeschaeftigte, Teilzeitbeschaeftigte: +row.Teilzeitbeschaeftigte }))
        setEmploymentData(employmentData)


        //load Revenue BarChart
        const rawUmsatzData = await d3.dsv(";", "../data/UmsatzGastgewerbe.csv")
        const umsatzData = rawUmsatzData
            .filter(row => +row.Jahr >= 2018 && (row.Branche_Code !== "WZ08-55" && row.Branche_Code !== "WZ08-56"))
            .map(row => ({ ...row, Date: new Date(row.Jahr, (+row.Monat - 1)), Umsatz: +row.Umsatz, Veraenderung: +row.Veraenderung }))
        setUmsatzData(umsatzData)


        //load Insolvency BarChart
        const rawInsolvencyBarData = await d3.dsv(";", "../data/InsolvenzenGastgewerbe.csv")
        const data = rawInsolvencyBarData
            .filter(row => +row.Jahr >= 2018)
            .map((row) => ({ ...row, Date: new Date(row.Jahr, (+row.Monat - 1)), Ins_opened: +row.Ins_opened, Ins_rejected: +row.Ins_rejected, Insolvenzen: +row.Insolvenzen, Arbeitnehmer: +row.Arbeitnehmer, Forderungen: +row.Forderungen, InsolvenzenVeraenderung: (+row.InsolvenzenVeraenderung * 100) }))
        setInsolvenzenData(data)


        //load Corona Data 2020-2022
        const rawCoronaInzidenzData = await d3.dsv(";", "../data/Coronainfektionen_7-Tage_Trend_DE20_22.csv")
        const coronaData = rawCoronaInzidenzData.map(row => ({ Date: new Date(row.Date), Inzidenz: +row.Inzidenz }))
        setCoronaData(coronaData)


        //load Kurzarbeit Data
        const rawKurzarbeitData = await d3.dsv(";", "../data/KurzarbeitGastgewerbe.csv")
        let kurzarbeitData = rawKurzarbeitData
            .map(row => ({ ...row, Date: new Date(row.Jahr, (+row.Monat - 1)), BetriebeKurzarbeit: +row.BetriebeKurzarbeit, Kurzarbeiter: +row.Kurzarbeiter }))

        setKurzarbeitData(kurzarbeitData)

        // if everything is loaded, set loading to false
        setIsLoadingData(false)
    }

    useEffect(() => {
        //---- Initialize State ----
        setTimeFrame({ min: new Date(2018, 0), max: new Date() })

        //---- Load Data ----
        loadData()
    }, [])

    if (isLoadingData) return <div className='loading-div'><div className="lds-dual-ring"></div></div>

    return (
        <div className={"Page dashboard " + (verticalLayout && "vertical")}>
            <div className={"BarCards " + (verticalLayout && "vertical")}>
                <Card
                    title="Umsatz im Gastgewerbe"
                    description="Umsatz im Gastgewerbe in Millionen Euro unterteilt in Beherbergung und Gastronomie"
                    subtitle={"in Mio € (" + selectedDate?.toLocaleString("de-DE", { month: "short", year: "numeric" }) + ")"}>
                    <RevenueBarChart />
                </Card>
                <Card title="Beschäftigung im Gastgewerbe"
                    description="Anzahl der Beschäftigen in Prozent verglichen mit der durchschnittlichen Beschäftigung in 2015, unterteilt nach Gastronomie und Beherbergung"
                    subtitle={"in % im Vergleich zum Jahr 2015 (" + selectedDate?.toLocaleString("de-DE", { month: "short", year: "numeric" }) + ")"}>
                    <EmploymentBarChart />
                </Card>
                <Card title="Insolvenzen im Gastgewerbe"
                    description="Insolvenzen im Gastgewerbe in Prozent verglichen mit den durchschnittlichen Insolvenzen von 2013 bis 2019"
                    subtitle={"in % im Vergleich zum Jahr 2015 (" + selectedDate?.toLocaleString("de-DE", { month: "short", year: "numeric" }) + ")"}>
                    <InsolvenzenProzent />
                </Card>
            </div>

            <div className={"GraphCards " + (verticalLayout && "vertical")}>

                <Timeline title="Coronainfektionen in Deutschland" subtitle="als 7-Tage-Inzidenz je 100.000 Einwohner">
                    <CoronaGraph />
                    <DateControls />
                </Timeline>

                <Timeline title="Kurzarbeit im Gastgewerbe" subtitle="in Tausend Mitarbeiter">
                    <KurzarbeitGraph />
                </Timeline>

                <Timeline title="Insolvenzen im Gastgewerbe" subtitle="in Anzahl der eingereichten? Insolvenzen">
                    <InsolvenzenGraph />
                </Timeline>

            </div>


        </div>
    )
}

export default Dashboard
