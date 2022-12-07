import './Dashboard.scss'
import Card from '../components/Card/Card'
import Timeline from '../components/Timeline/Timeline'
import BeschäftigungGraph from '../components/Graphs/BeschäftigungGraph'
import * as d3 from 'd3'
import { useAppContext } from '../contexts/AppContext'
import { useEffect, useState } from 'react'
import CoronaGraph from '../components/Graphs/CoronaGraph'
import InsolvenzenGraph from '../components/Graphs/InsolvenzenGraph'

const Dashboard = () => {

    //---- define AppContext ----
    const { setGastgewerbeData, setCoronaData } = useAppContext()

    //---- Dashboard State ----
    const [isLoadingData, setIsLoadingData] = useState(true)

    //---- load different data ----
    const loadData = async () => {
        console.log("Load Data...")

        //load Gastgewerbe (general) Data 2005 - 2022
        const rawGastgewerbeData = await d3.dsv(";", "../data/Gastgewerbe05-22.csv")


        const gastgewerbeData = rawGastgewerbeData.filter(d => d.Zeit == 2019)
        console.log(gastgewerbeData);

        setGastgewerbeData(gastgewerbeData)

        //load Insolvenz data 2013-2022


        //load Corona Data 2020-2022
        const rawCoronaInzidenzData = await d3.dsv(";", "../data/Coronainfektionen_7-Tage_Trend_DE20_22.csv")
        const coronaData = rawCoronaInzidenzData.map(d => ({
            Date: new Date(d.Date),
            Inzidenz: +d.Inzidenz
        }))

        console.log(coronaData)

        setCoronaData(coronaData)


        setIsLoadingData(false)
        console.log("loading complete!")
    }

    useEffect(() => {
        loadData()
    }, [])

    if (isLoadingData) return

    return (
        <div className="Page Home">
            <div className="Top">
                <Card title="Beschäftigung im Gastgewerbe" subtitle="In tausend, gegliedert in Vollzeit, Teilzeit und Kurzarbeit">
                    <BeschäftigungGraph />
                </Card>
                <Card title="Umsatz im Gastgewerbe" subtitle="In Mio €">
                </Card>
                <Card title="Subventionen im Gastgewerbe" subtitle="Einfluss aus Umsatz und Mitarbeiter">
                </Card>
            </div>
            <div className="Middle">
                <Timeline title="Insolvenzen" subtitle="im Gastgewerbe zwischen 2010 und 2022">
                    <InsolvenzenGraph />
                </Timeline>
            </div>
            <div className="Bottom">
                <Timeline title="Coronainfektionen in Deutschland" subtitle="7-Tage-Inzidenz COVID-19 Infektionen je 100.000 Einwohner">
                    <CoronaGraph />
                </Timeline>
            </div>
        </div>
    )
}

export default Dashboard
