var reg = (o, n) => o ? o[n] : '';

var speaker_list = ["venetia de wit","todd davis","kale panoho","garick chan","erin mathew","morgane conrad","jonathan kidder","andrea mato","greg savage","charlotte harris","mike cohen","anastasiia holub","denis dinkevich","vanessa raath","glenn gutmacher","alexandru badaluta","wim dammans","susanna frazier","sarah goldberg","rick sherlock","andré bradshaw","bret feig","shally steckerl","adriaan kolff","yulia bondar","eva balúchová","hung lee","maggie kramar","anastasia pshegodskaya","teddy dimitrova","anna stenbeck","elizabeth lembke","marcel van der meer","ronnie bratcher","kim lokenberg","caroline stokes","pierre-andré fortin","iker jusue","irina shamaeva","balazs paroczay","josef kadlec","bas westland","laura stoker","max schwarz","david galley","julien frank","mark lundgren","renita käsper","barbara braehmer","gordon lokenberg","troy hammond","aaron lintz","ivan stojanovic","jan tegze","guillaume alexandre","rachel kemp","tangie pettis","klara hermesz","jessica gibson-jones","dov zavadskis","yulia bondar","kim lokenberg","john rose","mateusz macha","jessie caudron","phil tusing","chris long"];

function parseVideoPageDetails(data){
 return data.data.map(r=> {
    return {
      speaker_name: reg(new RegExp(speaker_list.reduce((a,b)=> a+'|'+b), 'i').exec(r.name),0),
      url: 'https://vimeo.com/showcase/'+reg(/(?<=albums\/)\d+.+?\/\d+/.exec(r.uri.replace(/videos/, 'video')),0),
      video_name: r.name,
      duration: r.duration,
    }
  })
} 

async function getVideoDetails(){
  var res = await fetch("https://api.vimeo.com/albums/7317727/videos?page=1&sort=manual&fields=description%2Cduration%2Cis_free%2Clive%2Cname%2Cpictures.sizes.link%2Cpictures.sizes.width%2Cpictures.uri%2Cprivacy.download%2Cprivacy.view%2Ctype%2Curi%2Cuser.link%2Cuser.name%2Cuser.pictures.sizes.link%2Cuser.pictures.sizes.width%2Cuser.uri&per_page=100&filter=&_hashed_pass=4fd363d31b1e176b3fabdbb31bb74606807cc268.1594682050", {
  "headers": {
    "accept": "application/vnd.vimeo.video;version=3.4.1",
    "accept-language": "en-US,en;q=0.9",
    "authorization": "jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1OTQ2ODQ2ODAsInVzZXJfaWQiOm51bGwsImFwcF9pZCI6NTg0NzksInNjb3BlcyI6InB1YmxpYyIsInRlYW1fdXNlcl9pZCI6bnVsbH0.03liR4O9z2dA-090Ws6wumEVfA1BCkasz3711bqUOZE",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "vimeo-page": "/"
  },
  "referrer": "https://vimeo.com/showcase/7317727?page=5",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});
 var jdat = await res.json();
 var data = parseVideoPageDetails(jdat);
  convert2TsvAndDownload(data,'SOSUV_presentations.tsv');
  console.log(data);
}

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
getVideoDetails();//run on the api url







// run this to get the VOD file out 
async function getVODById(id){
  var res = await fetch(`https://player.vimeo.com/video/${id}/config?autopause=1&autoplay=0&background=0&badge=0&byline=0&bypass_privacy=1&collections=0&context=Vimeo%5CController%5CAlbumController.embed_clip&controls=1&like=0&logo=0&loop=0&muted=0&outro_new=0&playbar=1&portrait=0&share=0&speed=0&title=0&watch_later=0&s=0b90cfb79e938235f3a62cf78d143f4ef61b97c5_1594782969`, {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://vimeo.com/showcase/7317727/video/"+id+"/embed?hash=4fd363d31b1e176b3fabdbb31bb74606807cc268.1594682050",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});
  var jdat = await res.json();
  var files = jdat.request.files.progressive;
  var quality = Math.max(...files.map(r=> r.height));
  var target_url = files.filter(r=> r.height == quality)[0].url;
  return target_url;  
    
}

var videos = `https://vimeo.com/showcase/7317727/video/435767611
https://vimeo.com/showcase/7317727/video/435467613
https://vimeo.com/showcase/7317727/video/435762702
https://vimeo.com/showcase/7317727/video/435762620
https://vimeo.com/showcase/7317727/video/435740822
https://vimeo.com/showcase/7317727/video/435829369
https://vimeo.com/showcase/7317727/video/435829346
https://vimeo.com/showcase/7317727/video/435829182
https://vimeo.com/showcase/7317727/video/435829214
https://vimeo.com/showcase/7317727/video/435829237
https://vimeo.com/showcase/7317727/video/435829257
https://vimeo.com/showcase/7317727/video/435829290
https://vimeo.com/showcase/7317727/video/433835082
https://vimeo.com/showcase/7317727/video/435829307
https://vimeo.com/showcase/7317727/video/435829327
https://vimeo.com/showcase/7317727/video/435495071
https://vimeo.com/showcase/7317727/video/436009743
https://vimeo.com/showcase/7317727/video/436597904
https://vimeo.com/showcase/7317727/video/435593476
https://vimeo.com/showcase/7317727/video/436173720
https://vimeo.com/showcase/7317727/video/436173238
https://vimeo.com/showcase/7317727/video/436168750
https://vimeo.com/showcase/7317727/video/436168701
https://vimeo.com/showcase/7317727/video/436133332
https://vimeo.com/showcase/7317727/video/436181588
https://vimeo.com/showcase/7317727/video/436194192
https://vimeo.com/showcase/7317727/video/436216623
https://vimeo.com/showcase/7317727/video/436216615
https://vimeo.com/showcase/7317727/video/436255741
https://vimeo.com/showcase/7317727/video/435405076
https://vimeo.com/showcase/7317727/video/436255758
https://vimeo.com/showcase/7317727/video/436255775
https://vimeo.com/showcase/7317727/video/436429832
https://vimeo.com/showcase/7317727/video/436429662
https://vimeo.com/showcase/7317727/video/436429529
https://vimeo.com/showcase/7317727/video/436429402
https://vimeo.com/showcase/7317727/video/436435371
https://vimeo.com/showcase/7317727/video/436435316
https://vimeo.com/showcase/7317727/video/436435249
https://vimeo.com/showcase/7317727/video/436444161
https://vimeo.com/showcase/7317727/video/436529742
https://vimeo.com/showcase/7317727/video/436529732
https://vimeo.com/showcase/7317727/video/436529750
https://vimeo.com/showcase/7317727/video/436537990
https://vimeo.com/showcase/7317727/video/436588113
https://vimeo.com/showcase/7317727/video/436588099
https://vimeo.com/showcase/7317727/video/436588084
https://vimeo.com/showcase/7317727/video/435402191
https://vimeo.com/showcase/7317727/video/436816823
https://vimeo.com/showcase/7317727/video/436852022
https://vimeo.com/showcase/7317727/video/436880220
https://vimeo.com/showcase/7317727/video/436880126
https://vimeo.com/showcase/7317727/video/436881527
https://vimeo.com/showcase/7317727/video/436881508
https://vimeo.com/showcase/7317727/video/436930459
https://vimeo.com/showcase/7317727/video/436930476
https://vimeo.com/showcase/7317727/video/435977309
https://vimeo.com/showcase/7317727/video/436890550
https://vimeo.com/showcase/7317727/video/436597968
https://vimeo.com/showcase/7317727/video/437830739
https://vimeo.com/showcase/7317727/video/437835857`.split(/\n/).map(r=> /\d+$/.exec(r)[0]);
async function loopThroughVideoList(arr){
  var rando = (n) => Math.round(Math.random() * n);
  var delay = (ms) => new Promise(res => setTimeout(res, ms));

  var containArr = [];
  for(var i=0; i<arr.length; i++){
    var link = await getVODById(arr[i]);
    containArr.push(link);
    await delay(rando(1222)+1222);
  }
  console.log(containArr.reduce((a,b)=> a+'\n'+b))
}
loopThroughVideoList(videos);
