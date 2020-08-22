var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));

var cleanObject = (ob) => 
  Object.entries(ob).reduce((r, [k, v]) => {
    if(v != null && v != undefined && v != "" && ( typeof v == 'boolean' || typeof v == 'string' || typeof v == 'symbol' || typeof v == 'number' || typeof v == 'function' || (typeof v == 'object'  && ((Array.isArray(v) && v.length) || (Array.isArray(v) != true)) ) ) ) { 
      r[k] = v; 
      return r;
    } else { 
     return r; 
    }
  }, {});

function parseURIasJSON(url,obj) {
  if(url.match(/(?<=\?|\&)\S+?(?=\&|$)/g)) url.match(/(?<=\?|\&)\S+?(?=\&|$)/g).map(r=> r ? r.split(/\=/) : [[]]).forEach(r=> obj[r[0]] = r[1])
  return obj;
}

function translateFacets(s){
  try{ 
    let facets = JSON.parse(decodeURIComponent(s));
    return encodeURIComponent(JSON.stringify(Object.entries(facets).map(keyval=> keyval[1].map(val=> `${keyval[0]}:${val}`)).flat()));
  }
  catch(err){
    console.log(err);
    return '';
  }
}


//https://www.peerlyst.com/search/users?trk=search_page_entity_types&query=%22Threat%20Intelligence%22&refinementList=%7B%22Expertise%22%3A%5B%22threat%20intelligence%22%5D%7D&page=1&sortBy=people_joined_recently

async function getSearchResults(page,sort){ //
  var { query, refinementList, trk} = parseURIasJSON(window.location.href,{});
  let app_id = __meteor_runtime_config__?.PUBLIC_SETTINGS?.algolia?.appId;
  let api_key = __meteor_runtime_config__?.PUBLIC_SETTINGS?.algolia?.searchApiKey;
// page: "1"
// query: "%22Threat%20Intelligence%22"
// refinementList: "%7B%22Expertise%22%3A%5B%22threat%20intelligence%22%5D%7D"
// sortBy: "people_joined_recently"
// trk: "search_page_entity_types"
  var res = await fetch(`https://t1xpljqyri-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.32.0%3Breact-instantsearch%205.3.2%3BJS%20Helper%202.26.1&x-algolia-application-id=${app_id}&x-algolia-api-key=${api_key}`, {
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site"
  },
  "referrer": window.location.href,
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": `{\"requests\":[{\"indexName\":\"${sort}\",\"params\":\"query=${(query ? query : '')}&hitsPerPage=2000&maxValuesPerFacet=20&page=${page}&attributesToRetrieve=%5B%22*%22%5D&attributesToHighlight=%5B%5D&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&facets=%5B%22Expertise%22%2C%22Certifications%22%2C%22Company%22%2C%22Industry%22%2C%22title%22%5D&tagFilters=&facetFilters=${translateFacets(refinementList)}\"}]}`,
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});
  var d = await res.json();
console.log(d);  
  var parsed = parseSearchResults(d);
console.log(parsed);
  return parsed;
}

function parseSearchResults(obj){
  return obj?.results && obj?.results[0] && obj?.results[0].hits?.map(r=> {
    return cleanObject({
      img: r?.avatar?.cr?.publicId ? 'https://res.cloudinary.com/peerlyst/image/upload/c_limit,dpr_auto,f_auto,fl_lossy,h_65,q_auto,w_65/v1580476024/'+ r?.avatar?.cr?.publicId : null,
      company_name: r?.company?.displayName,
      company_id: r?.company?._id,
      company_public_id: r?.company?.slug,
      profile_creation_date: r?.createdAt,
      full_name: r?.displayName,
      last_invite_to_chime_in_received: r?.lastInviteToChimeInReceived,
      public_id: r?.slug,
      title: r?.title,
      tags: r?.topTags?.map(t=> t?.tag?.name),
    })
  })
}

var contain_arr = [];
async function loopThroughSearchResults(){
  let sorts = ['people_default','people_joined_recently','people_alphabetical'];
  for(let i=0; i<sorts.length; i++){
    let res = await getSearchResults(0,sorts[i]);
    res && res.forEach(r=> {
      if(contain_arr.every(itm=> itm.public_id != r.public_id)){
        contain_arr.push(r);
      }
    });
    await delay(rando(1122)+22);
  }
  console.log(contain_arr)

}

loopThroughSearchResults()
