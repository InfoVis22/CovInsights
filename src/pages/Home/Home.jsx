import './Home.scss'
import Card from '../../components/Card/Card'
import Timeline from '../../components/Timeline/Timeline'
import BeschäftigungGraph from '../../components/Graphs/BeschäftigungGraph'
import ChartWithDim from '../../components/Graphs/ChartWithDim'

const Home = () => {

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
                    <BeschäftigungGraph />
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

export default Home
