import './Dashboard.scss'
import Card from '../components/Card/Card'
import Timeline from '../components/Timeline/Timeline'
import * as d3 from 'd3'
import { useAppContext } from '../contexts/appContext'
import { useEffect, useState } from 'react'
import moment from 'moment'

//Barcharts
import InsolvenciesBarChart from "../components/Graphs/InsolvenciesBarChart";
import EmploymentBarChart from '../components/Graphs/EmploymentBarChart'
import RevenueBarChart from '../components/Graphs/RevenueBarChart'

//Timeline
import InsolvenzenGraph from '../components/Graphs/InsolvenzenGraph'
import CoronaGraph from '../components/Graphs/CoronaGraph'

//Controls
import DateControls from '../components/DateControls/DateControls'
import InsolvenzenProzent from '../components/Graphs/InsolvenzenProzent'


const Dashboard = () => {

    //---- define AppContext ----
    const { hoveredTime, setEmploymentData, setInsolvencyBarData, setCoronaData, setInsolvenzData, setTimeFrame, setUmsatzData, selectedDate, setSelectedDate } = useAppContext()

    //---- Dashboard State ----
    const [isLoadingData, setIsLoadingData] = useState(true)

    //---- load different data ----
    const loadData = async () => {
        console.log("Load Data...")

        //load Employment BarChart
        const rawEmployment = await d3.dsv(";", "../data/BeschäftigungGastgewerbe.csv")
        const employmentData = rawEmployment
            .filter(d => +d.Jahr >= 2018 && (d.Branche_Code !== "WZ08-55" && d.Branche_Code !== "WZ08-56"))
            .map((row) => ({ ...row, Date: new Date(row.Jahr, (+row.Monat - 1)), Beschaeftigte: +row.Beschaeftigte, Vollzeitbeschaeftigte: +row.Vollzeitbeschaeftigte, Teilzeitbeschaeftigte: +row.Teilzeitbeschaeftigte }))

        console.log("Beschäftigte Bar")
        console.log(employmentData)
        setEmploymentData(employmentData)


        //load Revenue BarChart
        const rawUmsatzData = await d3.dsv(";", "../data/UmsatzGastgewerbe.csv")
        const umsatzData = rawUmsatzData
            .filter(row => +row.Jahr >= 2018 && (row.Branche_Code !== "WZ08-55" && row.Branche_Code !== "WZ08-56"))
            .map(row => ({ ...row, Date: new Date(row.Jahr, (+row.Monat - 1)), Umsatz: +row.Umsatz, Veraenderung: +row.Veraenderung }))

        console.log("Umsatz Bar")
        console.log(umsatzData)
        setUmsatzData(umsatzData)


        //load Insolvency BarChart
        const rawInsolvencyBarData = await d3.dsv(";", "../data/InsolvenzenGastgewerbe.csv")
        const InsolvencyBarData = rawInsolvencyBarData
            .filter(row => +row.Jahr >= 2018)
            .map((row) => ({ ...row, Date: new Date(row.Jahr, (+row.Monat - 1)), Ins_opened: +row.Ins_opened, Ins_rejected: +row.Ins_rejected, Insolvenzen: +row.Insolvenzen, Arbeitnehmer: +row.Arbeitnehmer, Forderungen: +row.Forderungen, InsolvenzenVeraenderung: (+row.InsolvenzenVeraenderung * 100) }))

        console.log("Insolvencies Bar")
        console.log(InsolvencyBarData)
        setInsolvencyBarData(InsolvencyBarData)


        //load Insolvenz data timeline
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
                <Card title="Umsatz im Gastgewerbe" subtitle={"in Mio € (" + selectedDate.toLocaleString("de-DE", { month: "short", year: "numeric" }) + ")"}>
                    <RevenueBarChart />
                </Card>
                <Card title="Beschäftigung im Gastgewerbe" subtitle={"Im Vergleich zum Jahr 2015 (" + selectedDate.toLocaleString("de-DE", { month: "short", year: "numeric" }) + ")"}>
                    <EmploymentBarChart />
                </Card>
                <Card title="Insolvenzen im Gastgewerbe" subtitle={"in Anzahl der Insolvenzen (" + selectedDate.toLocaleString("de-DE", { month: "short", year: "numeric" }) + ")"}>
                    <InsolvenzenProzent />
                </Card>
            </div>
            <div className="Middle">
                <Timeline title="Insolvenzen" subtitle="in Anzahl">
                    <InsolvenzenGraph />
                </Timeline>
            </div>
            <div className="Bottom">
                <Timeline title="Coronainfektionen in Deutschland" subtitle="als 7-Tage-Inzidenz je 100.000 Einwohner">
                    <CoronaGraph />
                </Timeline>
                <DateControls />

            </div>
        </div>
    )
}

export default Dashboard
