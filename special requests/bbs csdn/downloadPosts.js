async function extractPageData(){
    const rando = (n) => Math.round(Math.random() * n);
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    const unqHsh = (a,o) => a.filter(i=> o.hasOwnProperty(i) ? false : (o[i] = true));

    
    async function scrollLoop(){
        let list_items = Array.from(document.getElementsByClassName('tab-list-item-mini'))?.length ? Array.from(document.getElementsByClassName('tab-list-item-mini')) : Array.from(document.getElementsByClassName('tab-list-item'));
        let loading_elm = document.getElementsByClassName('item-loading')?.[0];
        if(list_items?.length){
            if(list_items.at(-10)) list_items.at(-10).scrollIntoView({behavior: "smooth",block: "end",inline: "end"});
        }
        await delay(1111);
        let total_posts = window.__INITIAL_STATE__?.pageData?.data?.baseInfo?.page?.total;
        if(list_items?.length){
            list_items.at(-1).scrollIntoView({behavior: "smooth",block: "end",inline: "end"});
            document.getElementsByClassName('__panel')[2].scrollTo(0,document.getElementsByClassName('__panel')[2].scrollHeight);
            await delay(1111);
            if(document.getElementsByClassName('item-loading')[0]) document.getElementsByClassName('item-loading')[0].scrollIntoView({behavior: "smooth",block: "end",inline: "end"});
        }
        console.log(/\bno more\b|没有更多了/i.exec(document.body.innerText)?.[0]);
        console.log(Array.from(document.querySelectorAll('div')).filter(r=> /没有更多了|\bno more\b/i.test(r.innerText)));
        return Object.entries(window.__INITIAL_STATE__?.pageData?.dataList).some(kv=> kv[1].length > total_posts);
        /* total_posts == Object.entries(window.__INITIAL_STATE__?.pageData?.dataList)?.[0]?.[1]?.length; */
    }
    for(let i=0; i<1000; i++){
        let res = await scrollLoop();
        if(res) break;
        if(Array.from(document.querySelectorAll('div')).filter(r=> /没有更多了|\bno more\b/i.test(r.innerText))?.length) break;        
    }
    function unqKey(array,key){  var q = [];  var map = new Map();  for (const item of array) {    if(!map.has(item[key])){        map.set(item[key], true);        q.push(item);    }  }  return q;}
    
    return unqKey(Object.entries(window.__INITIAL_STATE__?.pageData?.dataList)?.map(kv=> {
        return kv[1]?.map(r=> {
          let obj = snakeCaseObject(r);
          let content = snakeCaseObject(obj.content);
          delete obj.content;
          return {
              ...obj,
              ...content,
          }
      })
    }).flat(),'content_id')
}


var cleanObject = (ob) => 
  Object.entries(ob).reduce((r, [k, v]) => {
    if( v != null && v != undefined && v !== "" && ( ['string','number','boolean','function','symbol'].some(opt=> typeof v == opt) || (typeof v == 'object' && ((Array.isArray(v) && v.length) || (Array.isArray(v) != true) ) ) ) ) { 
      r[k] = v; 
      return r;
    } else { 
     return r; 
    }
  }, {});
var snakeCaser = (s) => s.split(/(?<=[a-z])\B(?=[A-Z])/).map(i=> i.toLowerCase()).reduce((a,b)=> a+'_'+b);
function snakeCaseObject(obj){
    var tsvReady = (s) => s ? s.replace(/\t|\u0009|&#9;/g, ' ').replace(/[\r\n]+/g, '↵').replace(/\u2029|\u2028|\x85|\x1e|\x1d|\x1c|\x0c|\x0b/g,'↵').replace(/"/g, "'") : s;
    return obj ? cleanObject(Object.entries(obj).map(kv=> {
        let val = typeof kv[1] == 'object' && Array.isArray(kv[1]) ? kv[1].map(v=> snakeCaseObject(v))
            : kv[1] && typeof kv[1] == 'object' ? snakeCaseObject(kv[1])
            : typeof kv[1] == 'string' ? tsvReady(kv[1].trim()) : kv[1];
        return {
            ...(/^\$/.test(kv[0]) ? {} : {[snakeCaser(kv[0].replace(/^js/,''))]:val})
        }
    }).reduce((a,b)=> {return {...a,...b}})) : {}
}


async function handleFetch(url,params_obj,type){
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    try{
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
    catch(err){
        console.log(err);
        return false;
    }
  }
  
  function parseProfileInfo(doc){
      var location_map = {
        "广东省":"Guangdong Province",
        "上海市":"Shanghai Municipality",
        "北京市":"Beijing Municipality",
        "江苏省":"Jiangsu Province",
        "河南省":"Henan Province",
        "吉林省":"Jilin Province",
        "四川省":"Sichuan Province",
        "浙江省":"Zhejiang Province",
        "陕西省":"Shaanxi Province",
        "山西省":"Shanxi Province",
        "香港":"Hong Kong",
        "福建省":"Fujian Province",
        "贵州省":"Guizhou Province",
        "湖南省":"Hunan Province",
        "湖北省":"Hubei Province",
        "河北省":"Hebei Province",
        "山东省":"Shandong Province",
        "安徽省":"Anhui Province",
        "天津市":"Tianjin Municipality",
        "内蒙古":"Inner Mongolia",
      };
      var location_name = doc?.getElementsByClassName('user-profile-head-address')?.[0]?.getElementsByClassName('address')?.[0]?.innerText?.replace(/.+?(:|：)/,'');
      
      return {
          ...{
              location:location_map[location_name] ? location_map[location_name] : location_name,
              join_date:doc?.getElementsByClassName('user-general-info-join-csdn')?.[0]?.getElementsByClassName('user-general-info-key-word')?.[0]?.innerText?.trim()
          },
          ...(
            doc?.getElementsByClassName('user-profile-head-info-r-c')?.[0]
            ? Array.from(doc?.getElementsByClassName('user-profile-head-info-r-c')?.[0]?.getElementsByTagName('li'))?.map((itm,i)=> {
                let header = `be_visited,original,ranking,fan,iron_powder`.split(/,/);
                return {
                    [header[i]]:itm.getElementsByClassName('user-profile-statistics-num')?.[0]?.innerText?.trim()?.replace(/,/,'')
                }
            }).reduce((a,b)=> {return {...a,...b}})
            : {}
          )
      }
  }
  async function enrichWithBlogInfo(obj){
      var doc = await handleFetch(`https://blog.csdn.net/${obj.username}?type=bbs`,{},'html');
    return {...{username:obj.username},...parseProfileInfo(doc)}
  }
  

  function convert2TsvAndDownload(records, named_file){
    var fileArray = records;
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
  

  async function loopThroughPages(){
    function unqKey(array,key){  var q = [];  var map = new Map();  for (const item of array) {    if(!map.has(item[key])){        map.set(item[key], true);        q.push(item);    }  }  return q;}
    console.log('getting posts');
    let posts = await extractPageData();
    let unq_users = unqKey(posts,'username');
    let contain_arr = [];
    console.log('enriching');
    for(let i=0; i<unq_users.length; i++){
        let user_info = await enrichWithBlogInfo(unq_users[i]);
        contain_arr.push(user_info);
        console.log(i);
    }
    let enriched_posts = posts.map(post=> {
        let user = contain_arr.filter(r=> r.username == post.username);
        return {
            ...post,
            ...user?.[0],
        }
    });
    convert2TsvAndDownload(enriched_posts,`${/(?<=\/).+?(?=\?)/.exec(window.location.href)?.[0]} enriched posts.tsv`);
  }
  loopThroughPages()
