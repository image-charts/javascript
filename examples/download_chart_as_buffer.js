import ImageCharts from 'image-charts';

const chart_url = ImageCharts()
.cht('bvg') // vertical bar chart
.chs('300x300') // 300px x 300px
.chd('a:60,40') // 2 data points: 60 and 40
.toBuffer(); // download chart image as a buffer

console.log(chart_url); // <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 ...
