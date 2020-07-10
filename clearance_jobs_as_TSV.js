var reg = (o, n) => o ? o[n] : '';
var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));


function convert2TsvAndDownload(records, named_file){
    var fileArray = records;
    var tsvReady = (s) => s ? s.replace(/\t|\u0009/g, ' ').replace(/\r|\n/g, '↵').replace(/"/g, "'") : s;
    var unqHsh = (a, o) => a.filter(i => o.hasOwnProperty(i) ? false : (o[i] = true));
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


async function getClearenceJobsByPage(page){
  var res = await fetch(`https://www.clearancejobs.com/api/v1/company-directory?per_page=500&page=${page}&q=&starts_with=`);
  var jdat = await res.json();
  return jdat;
}

async function loopThroughPages(){
 var parseRes = (d)=> d.data && d.data.length ? d.data.map(r=> r ? {...r,...{initial:r.employer.initial, profile_pic_url: r.employer.profile_pic_url}} : {}) : [];
  var contain_arr = [];
  var d = await getClearenceJobsByPage(1);
  
  contain_arr.push(parseRes(d));
  var pages = d && d.meta && d.meta.pagination && d.meta.pagination.total_pages ? d.meta.pagination.total_pages : 1;
  console.log(pages)
  for(var i = 2; i<=pages; i++){
    var data = await getClearenceJobsByPage(i);
    await delay(rando(1500)+1500);
  contain_arr.push(parseRes(data));
    
  }
  var output = contain_arr.flat().map(r=> {
    delete r.employer;
    return r;
  })
 console.log(output);
 convert2TsvAndDownload(output,'clearance_jobs.tsv');
}

loopThroughPages()
