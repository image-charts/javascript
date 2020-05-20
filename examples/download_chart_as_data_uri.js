import ImageCharts from 'image-charts';

const chart_url = ImageCharts()
.cht('bvg') // vertical bar chart
.chs('300x300') // 300px x 300px
.chd('a:60,40') // 2 data points: 60 and 40
.toDataURI(); // download chart image and generate a data URI string

console.log(chart_url); // "data:image/png;base64,iVBORw0KGgo...
