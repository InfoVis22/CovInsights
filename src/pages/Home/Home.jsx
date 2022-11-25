// IMPORTS
import './Home.scss'
import Visual from '../../components/Visual/Visual'
import Timeline from '../../components/Timeline/Timeline'

function Home() {
    

    // RENDER

    return (
        <div className="Page Home">
           <div className="Top">
                <Visual />
                <Visual />
                <Visual />
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
