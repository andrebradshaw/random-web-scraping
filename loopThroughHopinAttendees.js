var reg = (o, n) => o ? o[n] : '';
var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var unqHsh = (a,o) => a.filter(i=> o.hasOwnProperty(i) ? false : (o[i] = true));


function convert2TsvAndDownload(records, named_file){
  var fileArray = records;
  var tsvReady = (s) => s ? s.replace(/\t|\u0009/g, ' ').replace(/\r|\n/g, '↵').replace(/"/g, "'") : s;
  var unqHsh = (a, o) => a.filter(i => o.hasOwnProperty(i) ? false : (o[i] = true));
  var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);
  var str = (o) => typeof o == 'object' ? tsvReady(JSON.stringify(o).replace(/\n|\r/g, ' ')) : o;
  var firstLevel = fileArray.map(el => Object.entries(el));
  var header = unqHsh(firstLevel.map(el => el.map(itm => itm[0])).flat(),{});
  var table = [header];
  for (var i = 0; i < firstLevel.length; i++) {
    var arr = [];
    var row = [];
    var record = firstLevel[i];
    for (var s = 0; s < record.length; s++) {
      var record_kv = record[s];
      var col_key = record_kv[0];      
      var place = header.indexOf(col_key);
      arr[place] = record_kv[1];
    }
    for (var a = 0; a < arr.length; a++) {
      if (arr[a]) {
        row.push(arr[a]);
      } else {
        row.push('');
      }
    }
    table.push(row);
  }
  function downloadr(arr2D, filename) {
    var data = /\.json$|.js$/.test(filename) ? JSON.stringify(arr2D) : arr2D.map(el => el.reduce((a, b) => a + '\t' + b)).reduce((a, b) => a + '\r' + b);
    var type = /\.json$|.js$/.test(filename) ? 'data:application/json;charset=utf-8,' : 'data:text/plain;charset=utf-8,';
    var file = new Blob([data], {
      type: type
    });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(file, filename);
    } else {
      var a = document.createElement('a'),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 10);
    }
  }
  var output_ = table.map(el => el.map(itm => str(itm)));
  downloadr(output_, named_file);
}

// "z0jKfCmz0bnv1Cii5kWrw1yE0
async function getAttendees(next){
  var res = await fetch(`https://hopin.com/api/v2/events/170497/users/paginated?${next}`, {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxNmQxYjdmYy00NGQwLTRkMzUtYWIyZC01ZDUzYTUyOThkZWYiLCJzdWIiOjMwNTcyNTIsInBlcnNvbmFfaWQiOjU0MDAwNywicmVnaXN0cmF0aW9uX2lkIjo5MzIyNTM5LCJldmVudF9pZCI6MTcwNDk3LCJyb2xlIjoiYXR0ZW5kZWUiLCJtdWx0aXBsZV9jb25uIjp0cnVlLCJkYXRhX3NlZ3JlZ2F0ZWQiOmZhbHNlfQ.etTvLrrIrYsYCr-4nOIRfBLQyHRXCjOx6nPH9QFl6Lk",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
      },
      "referrer": "https://app.hopin.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });
  var d = await res.json();
  return d;
}
async function loopThroughAttendees(){
  const contain_arr = [];
  var next = ''
  for(let i=0; i<5000; i++){ //1000
    var attendees = await getAttendees(next);
    next = `page[after]=${attendees?.meta?.page?.cursor}`;
    if(attendees?.users)contain_arr.push(attendees?.users);
    await delay(rando(2111)+1000);
    if(attendees?.users.length < 1) break;
    if(!attendees?.meta?.page?.cursor) break;
  }
  console.log(contain_arr.flat());
  var cleaned = cleanObjectsInArray(contain_arr.flat());
  console.log(cleaned);
  convert2TsvAndDownload(cleaned,'hopin_attendees.tsv');
}
function cleanObjectsInArray(arr){
  const tsvReady = (s) => s?.replace(/\t|\u0009|&#9;/g, ' ').replace(/[\r\n]+/g, '↵').replace(/\u2029|\u2028|\x85|\x1e|\x1d|\x1c|\x0c|\x0b/g,'↵').replace(/"/g, "'");
  const contain_arr = [];
  arr.forEach(rec=> {
    var obj = {};
    Object.entries(rec).forEach(r=> {
      obj[r[0]] = typeof r[1] == 'string' ? tsvReady(r[1]) : r[1];
    })
    contain_arr.push(obj);
  })
  return contain_arr;
}

loopThroughAttendees()
