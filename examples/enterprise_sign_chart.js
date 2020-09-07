import ImageCharts from 'image-charts';

const chart_url = ImageCharts({secret: 'SECRET_KEY'})
.icac('ACCOUNT_ID')
.cht('p3') // pie chart
.chs('700x190') // 700px x 190px
.chd('t:60,40') // 2 data points: 60 and 40
.chl('Hello|World') // 1 label per pie slice : "Hello" and "World"
.chf('ps0-0,lg,45,ffeb3b,0.2,f44336,1|ps0-1,lg,45,8bc34a,0.2,009688,1') // 1 gradient per pie slice
.icretina('1') // enable paid-only features like high-resolution charts
.toURL(); // get the whole (HMAC signed) URL

console.log(chart_url);
// https://image-charts.com/chart?chd=t%3A60%2C40&chf=ps0-0%2Clg%2C45%2Cffeb3b%2C0.2%2Cf44336%2C1%7Cps0-1%2Clg%2C45%2C8bc34a%2C0.2%2C009688%2C1&chl=Hello%7CWorld&chs=700x190&cht=p3&icac=documentation&icretina=1&ichm=122242bb700d825d69b3fafe4ec67193b45dcfe0ed93fcca307e0d0a84b73ea2
