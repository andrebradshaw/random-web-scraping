
 function convert2TsvAndDownload(records, named_file){
      var fileArray = records;
      //https://medium.com/enigma-engineering/the-secret-world-of-newline-characters-bfdad0a4ddd9
      var tsvReady = (s) => s ? s.replace(/\t|\u0009|&#9;/g, ' ').replace(/[\r\n]+/g, '↵').replace(/\u2029|\u2028|\x85|\x1e|\x1d|\x1c|\x0c|\x0b/g,'↵').replace(/"/g, "'") : s;
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

     async function handleFetch(url,params_obj,type){ //all arguments are required
         async function handleResponse(res,type){
           if(type == 'json') return await res.json().catch(err=> { console.log([err,url,params_obj]); return false });
           if(type == 'text') return await res.text().catch(err=> { console.log([err,url,params_obj]); return false });
           if(type == 'html') {
             let text = await res.text().catch(err=> { console.log([err,url,params_obj]); return false }); 
             return new DOMParser().parseFromString(text,'text/html');
           }else{ return false }
         }
         if(params_obj && url){
           var res = await fetch(url,params_obj).catch(err=> { console.log([err,url,params_obj]); return false });
           if(res.status > 199 && res.status < 300) return await handleResponse(res,type);
   
           if(res.status == 429) {
             await delay(300000);
             let res = await fetch(url,params_obj).catch(err=> { console.log([err,url,params_obj]); return false });
             if(res.status > 199 && res.status < 300) return await handleResponse(res,type);
             else return {action: 'stop', status: res.status};
           }
           if(res.status > 399 && res.status < 900){
             await delay(4410);
             let res = await fetch(url,params_obj).catch(err=> { console.log([err,url,params_obj]); return false });
             if(res.status > 199 && res.status < 300) return await handleResponse(res,type);
             else return {action: 'stop', status: res.status};
           }
           if(res.status > 899) return {action: 'stop', status: res.status};
         } else {return false;}
       }
   

async function getAttendees(p){
    const reg = (o, n) => o ? o[n] : '';
    const event_id = reg(/(?<=whova\.com\/portal\/webapp\/)\w+(?=\/Attendees)/.exec(window.location.href),0);
    const d = await handleFetch(`https://whova.com/webapp/api/attendees/?event_id=${event_id}&page_num=${p}&filter=`, {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrftoken": reg(/(?<=csrftoken=).+/.exec(document.cookie),0)
      },

      "referrer": `https://whova.com/portal/webapp/${event_id}/Attendees`,
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    },'json');
    return d;
}

function parseAttendeesResponse(d){
    const fixNameCase = (s) => s && typeof s == 'string' ? s.split(/(?=[^ğᴀғʀńŃŌŌŚŠśšŪūÿłžźżŁŽŹŻçćčÇĆČáāàâäãåÁÀÂÄÃĀĀÅĀÆæéèêëęēėÉÈÊËíìîïīįñÑóòôöõøœÓÒÔÖÕØŒßÚÙÛÜúùûüřa-zA-Z])\b/).map(el=> el.replace(/\w\S*/g, txt=> txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())).join('').replace(/(?<=\bMc)\w/ig, t=> t.charAt(0).toUpperCase()) : s;
    const tsvReady = (s) => s?.replace(/\t|\u0009|&#9;/g, ' ').replace(/[\r\n]+/g, 'â†µ').replace(/\u2029|\u2028|\x85|\x1e|\x1d|\x1c|\x0c|\x0b/g,'â†µ').replace(/"/g, "'");
    return d?.result?.attendees?.map(a=> {
        return {
            img: a?.pic,
            full_name: fixNameCase(a?.name),
            last_name: fixNameCase(a?.sort_lname),
            company: a?.aff ? tsvReady(a?.aff) : '',
            title: a?.title ? tsvReady(a?.title) : '',
            categories: a?.categories,
            profile_id: a?.profile_id,
            hash_id: a?.jid,
            thread: a?.thread,
        }
    })
}

async function loopThroughAttendees(){
    const reg = (o, n) => o ? o[n] : '';
    const event_id = reg(/(?<=whova\.com\/portal\/webapp\/)\w+(?=\/Attendees)/.exec(window.location.href),0);
    function unqKey(array,key){  var q = [];  var map = new Map();  for (const item of array) {    if(!map.has(item[key])){        map.set(item[key], true);        q.push(item);    }  }  return q;}
    const rando = (n) => Math.round(Math.random() * n);
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    const unqHsh = (a,o) => a.filter(i=> o.hasOwnProperty(i) ? false : (o[i] = true));
    const page1 = await getAttendees(1);
    const contain_arr = [parseAttendeesResponse(page1)];

    for(let i=0; i<page1?.result?.num_pages; i++){
        let res = await getAttendees(i)
        contain_arr.push(parseAttendeesResponse(res));
        await delay(2000+rando(2000)) //avoid spamming servers 2-4 seconds for each page
    }
    const attendees = unqKey(contain_arr.flat().flat().filter(r=> r),'profile_id');
    convert2TsvAndDownload(attendees,`${event_id}_whova_Attendees.tsv`);
}
loopThroughAttendees() //run on https://whova.com/portal/webapp/YOUR_EVENT_HERE/Attendees/
