import './Dashboard.scss'
import Card from '../components/Card/Card'
import Timeline from '../components/Timeline/Timeline'
import BeschäftigungGraph from '../components/Graphs/BeschäftigungGraph'
import ChartWithDim from '../components/Graphs/ChartWithDim'
import * as d3 from 'd3'
import { useAppContext } from '../contexts/AppContext'
import { useEffect, useState } from 'react'

const Dashboard = () => {

    //---- define AppContext ----
    const { setGastgewerbeData } = useAppContext()

    //---- Dashboard State ----
    const [isLoadingData, setIsLoadingData] = useState(true)

    //---- load different data ----
    const loadData = async () => {
        console.log("Load Data...")

        //load Gastgewerbe (general) Data 2005 - 2022
        const gastgewerbeData = await d3.dsv(";", "../data/Gastgewerbe05-22.csv")
        console.log(gastgewerbeData);
        setGastgewerbeData(gastgewerbeData)

        //load Insolvenz data 2013-2022


        //load Corona Data 2020-2022

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
                    <ChartWithDim />
                </Card>
                <Card title="Subventionen im Gastgewerbe" subtitle="Einfluss aus Umsatz und Mitarbeiter">

                </Card>
            </div>
            <div className="Middle">
                <Timeline />
            </div>
            <div className="Bottom">
                <Timeline />
            </div>
        </div>
    )
}

export default Dashboard
