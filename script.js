const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    const fileStream = fs.createReadStream('index.html', 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fileStream.pipe(res);
  } else if (req.url === '/search' && req.method === 'POST') {
    const dataStream = [];
    req.on('data', chunk => {
      dataStream.push(chunk);
    });
    req.on('end', () => {
      const requestBody = Buffer.concat(dataStream).toString();
      const keyword = JSON.parse(requestBody).keyword;
      const dictionary = {
        'шляпа': ['https://www.wildberries.ru/catalog/aksessuary/golovnye-ubory/tags/zhenskie-shlyapy?page=1', 'https://porusski.me/2020/08/07/041-shlyapa-vybirayem/'],
        'кунжут': ['https://www.mentoday.ru/food/food-faq/5-samyh-poleznyh-vidov-semyan-kotorye-stoit-est-regulyarno/', 'https://m.sushivostok.com/products/rolly/dostavka-sushi-novosibirsk-pervomajskij-rajon/']
      };
      const urls = dictionary[keyword] || [];

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(urls));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});