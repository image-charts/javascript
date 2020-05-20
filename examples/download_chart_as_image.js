import ImageCharts from 'image-charts';

const chart_path = '/tmp/chart.png';

ImageCharts()
.cht('bvg') // vertical bar chart
.chs('300x300') // 300px x 300px
.chd('a:60,40') // 2 data points: 60 and 40
.toFile(chart_path)
.then(() => console.log('Image chart written at %s', chart_path))
