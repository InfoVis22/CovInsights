<!-- PROJECT LOGO -->
<a name="readme-top"></a>
<div align="center">

  <a href="https://github.com/InfoVis22/CovInsights/tree/main"><img src="./src/images/Logo.png"></a>

  <h3 align="center">Informationvisualisation WS22/23</h3>

  <p align="center">
    A project to visualize datasets of the german gastronomy industry in relation to the global COVID-19 pandemic.
    <br />
    <a href="https://github.com/InfoVis22/CovInsights"><strong>GitHub Repo »</strong></a>
    <br />
    <br />
    <a href="https://covinsight.mmt-lmu.de/">View Demo</a>
    ·
    <a href="https://github.com/InfoVis22/CovInsights/issues">Report Bug</a>
    ·
    <a href="https://github.com/InfoVis22/CovInsights/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#implemented-features">Implemented Features</a></li>
    <li><a href="#features-in-progress">Features in Progress</a></li>
    <li><a href="#planned-features">Planned Features</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
This project is done as part of the lecture Data Visualization (DataVis) at the LMU Munich. Our goal is to visualize the effects of the covid pandemic on the german gastronomy industry with respect to insolvency, turnover and subventions.

<!-- Installation -->
### Installation
To run this application node.js and npm is required.
node.js can be downloaded here -> https://nodejs.org/en/download/
The installer also contains the npm package manager.
Run npm install to install the packages specified in the dependencies

<!-- Usage -->
### Usage
Run the following commands to start the app locally
- npm run dev
- npm run build and open the index.html
- npm run preview

### Demo Application
See the Demo: [CovInsight Demo](https://covinsight.mmt-lmu.de/) ✅


<!-- ROADMAP -->
## Roadmap

![Gant Chart](./public/images/Gant.png)

<!-- Implemented Features -->
### Implemented Features
- [x] About Us Page with short descriptions about project members
- [x] Source collection for displayed datasets on About Page
- [x] Displaying employment as bar chart 
- [x] Displaying change in bankrupt businesses in percentages represented as bar chart 
- [x] Displaying revenue figures as bar chart 
- [x] COVID infections from 2018 to 2023 on a timeline
- [x] Bankrupt businesses in numbers from 2018 to 2023 on a timeline
- [x] Tooltip: Chart details on hovering over bars in bar charts
- [x] Synchronized cursors of COVID, bankruptcies and short time work x-axis
- [x] All charts synchronize with the current cursor state on the timelines and are animated
- [x] Play Pause and Reset functionality of the timeline cursors
- [x] Important events on timeline are marked and labeled
- [x] Interactive legend on all bar charts: Legend features can be hide/unhide per click
- [x] Short time work employment numbers from 2018 to 2023 in a timeline
- [x] Refining and combine Play and Pause buttons
- [x] Chart explanation if the user clicks on the info icon
- [x] Opportunity to manually select the time period which should be displayed in all graphs (right upper corner)
- [x] Implementation of a second Dashboard layout logic: User can switch between two options based on preferences (right upper corner)

<!-- Features in Progress -->
### Features in Progress
- [ ] HotJar User Testing: Rich user interaction analysis
- [ ] User Guide: User Tutorial


<!-- Planned Features -->
### Planned Features
No planned Feature

<!-- CONTACT -->
## Contact
Alexander Welling - j.welling@campus.lmu.de <br/>
Lennard Greve - l.greve@campus.lmu.de <br/>
Sofie Henghuber - sofie.henghuber@campus.lmu.de <br/>
Manuel Totzauer - m.totzauer@campus.lmu.de <br/>
Maximilian Brandmaier - m.brandmaier@campus.lmu.de


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments
* [React Icons](https://react-icons.github.io/react-icons/search)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/