let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData;
let educationData;

let canvas = d3.select('#canvas');
let tooltip = d3.select('#tooltip');

let drawMap = () => {

    // My choropleth should have counties with a corresponding class="county" that represent the data.
    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (countyDataItem) => {
                // There should be at least 4 different fill colors used for the counties.
                let id = countyDataItem["id"];
                let county = educationData.find((item) => {
                    return item["fips"] === id;
                })
                let percentage = county["bachelorsOrHigher"];
                if (percentage <= 15) {
                    return "tomato";
                } else if (percentage <= 30) {
                    return "orange";
                } else if (percentage <= 45) {
                    return "lightgreen";
                } else {
                    return "limegreen";
                }
            })
            // My counties should each have data-fips and data-education properties containing their corresponding fips and education values.
            .attr('data-fips', (countyDataItem) => {
                return countyDataItem["id"];
            })
            .attr('data-education', (countyDataItem) => {
                let id = countyDataItem["id"];
                let county = educationData.find((item) => {
                    return item["fips"] === id;
                });
                return county["bachelorsOrHigher"];
            })
            // I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.
            .on('mouseover', (countyDataItem)=> {
                tooltip.transition()
                    .style('visibility', 'visible');

                let id = countyDataItem['id'];
                let county = educationData.find((item) => {
                    return item['fips'] === id;
                });

                tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + county['state'] + ' : ' + county['bachelorsOrHigher'] + '%');

                tooltip.attr('data-education', county['bachelorsOrHigher'] );   // My tooltip should have a data-education property that corresponds to the data-education of the active area.
            })
            .on('mouseout', (countyDataItem) => {
                tooltip.transition()
                    .style('visibility', 'hidden');
            })
}

d3.json(countyURL).then(
    (data, error) => {
        if (error) {
            console.log(error);
        }else {
            countyData = topojson.feature(data, data.objects.counties).features;  // Convert Topojson to Geojson for better use.
            console.log("County Data");
            console.log(countyData);

            d3.json(educationURL).then(
                (data, error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        educationData = data;
                        console.log("Education Data")
                        console.log(educationData);
                        drawMap();
                    }
                }
            )
        }
    }
)