import * as d3 from 'd3'
import { useState } from 'react';
import { useAppContext } from '../../contexts/appContext'
import { useD3 } from '../../hooks/useD3';

const Insolvenzen_Barchart = () => {

    //Testdata (grouped by year)
    const data = [
        {
            "FIELD1": 0,
            "Klassifikation": "I",
            "Wirtschaftsbereich": "Gastgewerbe",
            "Ins_opened": 63,
            "Ins_rejected": 25,
            "Ins_total": 88,
            "Ins_total(t-1)": 96,
            "Delta(t-1)": -8.3,
            "Arbeitnehmer": "337",
            "Forderungen": 11.9,
            "Jahr": 2022,
            "Monat": "August"
        },
        {
            "FIELD1": 1,
            "Klassifikation": "I55",
            "Wirtschaftsbereich": "Beherbergung",
            "Ins_opened": 4,
            "Ins_rejected": 1,
            "Ins_total": 5,
            "Ins_total(t-1)": 4,
            "Delta(t-1)": 25,
            "Arbeitnehmer": "75",
            "Forderungen": 2.1,
            "Jahr": 2022,
            "Monat": "August"
        },
        {
            "FIELD1": 2,
            "Klassifikation": "I551",
            "Wirtschaftsbereich": "Hotels, Gasthöfe u. Pensionen",
            "Ins_opened": 3,
            "Ins_rejected": 1,
            "Ins_total": 4,
            "Ins_total(t-1)": 4,
            "Delta(t-1)": 0,
            "Arbeitnehmer": "75",
            "Forderungen": 2.1,
            "Jahr": 2022,
            "Monat": "August"
        },
        {
            "FIELD1": 3,
            "Klassifikation": "I5510",
            "Wirtschaftsbereich": "Hotels, Gasthöfe u. Pensionen",
            "Ins_opened": 3,
            "Ins_rejected": 1,
            "Ins_total": 4,
            "Ins_total(t-1)": 4,
            "Delta(t-1)": 0,
            "Arbeitnehmer": "75",
            "Forderungen": 2.1,
            "Jahr": 2022,
            "Monat": "August"
        },
        {
            "FIELD1": 4,
            "Klassifikation": "I55101",
            "Wirtschaftsbereich": "Hotels (oh. Hotels garnis)",
            "Ins_opened": 3,
            "Ins_rejected": 1,
            "Ins_total": 4,
            "Ins_total(t-1)": 2,
            "Delta(t-1)": 100,
            "Arbeitnehmer": "",
            "Forderungen": null,
            "Jahr": 2022,
            "Monat": "August"
        },
        {
            "FIELD1": 128,
            "Klassifikation": "I",
            "Wirtschaftsbereich": "Gastgewerbe",
            "Ins_opened": 65,
            "Ins_rejected": 21,
            "Ins_total": 86,
            "Ins_total(t-1)": 118,
            "Delta(t-1)": -27.1,
            "Arbeitnehmer": "174",
            "Forderungen": 12.8,
            "Jahr": 2021,
            "Monat": "Dezember"
        },
        {
            "FIELD1": 129,
            "Klassifikation": "I55",
            "Wirtschaftsbereich": "Beherbergung",
            "Ins_opened": 4,
            "Ins_rejected": 1,
            "Ins_total": 5,
            "Ins_total(t-1)": 12,
            "Delta(t-1)": -58.3,
            "Arbeitnehmer": "12",
            "Forderungen": 1,
            "Jahr": 2021,
            "Monat": "Dezember"
        },
        {
            "FIELD1": 130,
            "Klassifikation": "I551",
            "Wirtschaftsbereich": "Hotels, Gasthöfe u. Pensionen",
            "Ins_opened": 3,
            "Ins_rejected": 1,
            "Ins_total": 4,
            "Ins_total(t-1)": 12,
            "Delta(t-1)": -66.7,
            "Arbeitnehmer": "12",
            "Forderungen": 1,
            "Jahr": 2021,
            "Monat": "Dezember"
        },
        {
            "FIELD1": 131,
            "Klassifikation": "I5510",
            "Wirtschaftsbereich": "Hotels, Gasthöfe u. Pensionen",
            "Ins_opened": 3,
            "Ins_rejected": 1,
            "Ins_total": 4,
            "Ins_total(t-1)": 12,
            "Delta(t-1)": -66.7,
            "Arbeitnehmer": "12",
            "Forderungen": 1,
            "Jahr": 2021,
            "Monat": "Dezember"
        },
        {
            "FIELD1": 132,
            "Klassifikation": "I55101",
            "Wirtschaftsbereich": "Hotels (oh. Hotels garnis)",
            "Ins_opened": 3,
            "Ins_rejected": 1,
            "Ins_total": 4,
            "Ins_total(t-1)": 7,
            "Delta(t-1)": -42.9,
            "Arbeitnehmer": "12",
            "Forderungen": 1,
            "Jahr": 2021,
            "Monat": "Dezember"
        },
        {
            "FIELD1": 320,
            "Klassifikation": "I",
            "Wirtschaftsbereich": "Gastgewerbe",
            "Ins_opened": 83,
            "Ins_rejected": 35,
            "Ins_total": 118,
            "Ins_total(t-1)": 140,
            "Delta(t-1)": -15.7,
            "Arbeitnehmer": "464",
            "Forderungen": 24,
            "Jahr": 2020,
            "Monat": "Dezember"
        },
        {
            "FIELD1": 321,
            "Klassifikation": "I55",
            "Wirtschaftsbereich": "Beherbergung",
            "Ins_opened": 9,
            "Ins_rejected": 3,
            "Ins_total": 12,
            "Ins_total(t-1)": 4,
            "Delta(t-1)": 200,
            "Arbeitnehmer": "62",
            "Forderungen": 3.4,
            "Jahr": 2020,
            "Monat": "Dezember"
        },
        {
            "FIELD1": 322,
            "Klassifikation": "I551",
            "Wirtschaftsbereich": "Hotels, Gasthöfe u. Pensionen",
            "Ins_opened": 9,
            "Ins_rejected": 3,
            "Ins_total": 12,
            "Ins_total(t-1)": 3,
            "Delta(t-1)": 300,
            "Arbeitnehmer": "62",
            "Forderungen": 3.4,
            "Jahr": 2020,
            "Monat": "Dezember"
        },
        {
            "FIELD1": 323,
            "Klassifikation": "I5510",
            "Wirtschaftsbereich": "Hotels, Gasthöfe u. Pensionen",
            "Ins_opened": 9,
            "Ins_rejected": 3,
            "Ins_total": 12,
            "Ins_total(t-1)": 3,
            "Delta(t-1)": 300,
            "Arbeitnehmer": "62",
            "Forderungen": 3.4,
            "Jahr": 2020,
            "Monat": "Dezember"
        },
        {
            "FIELD1": 324,
            "Klassifikation": "I55101",
            "Wirtschaftsbereich": "Hotels (oh. Hotels garnis)",
            "Ins_opened": 5,
            "Ins_rejected": 2,
            "Ins_total": 7,
            "Ins_total(t-1)": 2,
            "Delta(t-1)": 250,
            "Arbeitnehmer": "50",
            "Forderungen": 2.4,
            "Jahr": 2020,
            "Monat": "Dezember"
        }]
    // whole dataset
    const data_all = d3.json("C:/Users/mtanf/OneDrive/InfoVis - CovInsights/Data/Manu/output.json", function (data){})

    const [dataset, setDataset] = useState(data)
    const { time } = useAppContext()

// Graphsize
    const ref = useD3(
        (svg) => {
            const height = 300;
            // const width = svg.style.offsetWidth;
            const width = 400;
            const margin = { top: 20, right: 30, bottom: 30, left: 40 };

            const x = d3
                .scaleBand()
                .domain(dataset.map((d) => d.Klassifikation))
                .rangeRound([margin.left, width - margin.right])
                .padding(0.1);

            const y1 = d3
                .scaleLinear()
                .domain([0, d3.max(dataset, (d) => d.Ins_total)]) //array from min to max
                .rangeRound([height - margin.bottom, margin.top]);

            const xAxis = (g) =>
                g
                    .attr("transform", `translate(0,${height - margin.bottom})`)
                    .call(d3.axisBottom(x)
                        .tickValues(d3.ticks(...d3.extent(x.domain()), width / 40).filter((v) => x(v) !== undefined))
                        .tickSizeOuter(0));

            const y1Axis = (g) =>
                g
                    .attr("transform", `translate(${margin.left},0)`)
                    .style("color", "steelblue")
                    .call(d3.axisLeft(y1).ticks(null, "s"))
                    .call((g) => g.select(".domain").remove())
                    .call((g) =>
                        g
                            .append("text")
                            .attr("x", -margin.left)
                            .attr("y", 10)
                            .attr("fill", "currentColor")
                            .attr("text-anchor", "start")
                            .text(dataset.y1)
                    );

            //apply styles to X-Axis
            svg.select(".x-axis").call(xAxis);

            //apply styles to Y-Axis
            svg.select(".y-axis").call(y1Axis);

            //apply styles to plot
            svg.select(".plot-area")
                .attr("fill", "steelblue")
                .selectAll(".bar")
                .data(dataset)
                .join("rect")
                .attr("class", "bar")
                .attr("x", (d) => x(d.Klassifikation))
                .attr("y", (d) => y1(d.Ins_total))
                .attr("width", x.bandwidth())
                .attr("height", (d) => y1(0) - y1(d.Ins_total));
        },
        [dataset.length]
    );


    return (
        <>
            <svg
                ref={ref}
                style={{
                    height: 300,
                    width: "100%",
                    marginRight: "0px",
                    marginLeft: "0px",
                }}
            >
                <g className="plot-area" />
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </>
    )
}

export default Insolvenzen_Barchart