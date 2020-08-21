var cleanObject = (ob) => 
  Object.entries(ob).reduce((r, [k, v]) => {
    if(v != null && v != undefined && v != "" && ( typeof v == 'boolean' || typeof v == 'string' || typeof v == 'symbol' || typeof v == 'number' || typeof v == 'function' || (typeof v == 'object'  && ((Array.isArray(v) && v.length) || (Array.isArray(v) != true)) ) ) ) { 
      r[k] = v; 
      return r;
    } else { 
     return r; 
    }
  }, {});

async function getSearchResults(page,sort){
  var res = await fetch("https://t1xpljqyri-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.32.0%3Breact-instantsearch%205.3.2%3BJS%20Helper%202.26.1&x-algolia-application-id=T1XPLJQYRI&x-algolia-api-key=aad3f891232f12e59187e9962e07493e", {
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
  "body": `{\"requests\":[{\"indexName\":\"people_default\",\"params\":\"query=%22Threat%20Intelligence%22&hitsPerPage=2000&maxValuesPerFacet=20&page=${page}&attributesToRetrieve=%5B%22*%22%5D&attributesToHighlight=%5B%5D&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&facets=%5B%22Expertise%22%2C%22Certifications%22%2C%22Company%22%2C%22Industry%22%2C%22title%22%5D&tagFilters=&facetFilters=%5B%22Expertise%3Athreat%20intelligence%22%5D\"}]}`,
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});
  var d = await res.json();
console.log(d);  
  var parsed = parseSearchResults(d);
console.log(parsed);
}

function parseSearchResults(obj){
  return obj?.results[0] && obj?.results[0].hits?.map(r=> {
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

async function loopThroughSearchResults(){

  getSearchResults(0,'people_alphabetical')

}

loopThroughSearchResults()
