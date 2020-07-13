async function testFetch(){
  var res = await fetch("https://api.vimeo.com/albums/7317727/videos?page=2&sort=manual&fields=description%2Cduration%2Cis_free%2Clive%2Cname%2Cpictures.sizes.link%2Cpictures.sizes.width%2Cpictures.uri%2Cprivacy.download%2Cprivacy.view%2Ctype%2Curi%2Cuser.link%2Cuser.name%2Cuser.pictures.sizes.link%2Cuser.pictures.sizes.width%2Cuser.uri&per_page=12&filter=&_hashed_pass=2fb5b4d900e2d6edc6c7fca3544b3e4731ebdd1b.1594679511", {
  "headers": {
    "accept": "application/vnd.vimeo.video;version=3.4.1",
    "accept-language": "en-US,en;q=0.9",
    "authorization": "jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1OTQ2ODA0MjAsInVzZXJfaWQiOm51bGwsImFwcF9pZCI6NTg0NzksInNjb3BlcyI6InB1YmxpYyIsInRlYW1fdXNlcl9pZCI6bnVsbH0.ep0XElsysNcBTDm8CJOJFRBS4R-krlK0gAZ9OQA4mEY",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "vimeo-page": "/"
  },
  "referrer": "https://vimeo.com/showcase/7317727?page=2",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});
//   var text = await res.text();
//   console.log(text);
 var jdat = await res.json();
    console.log(jdat);  
    
}
testFetch();


async function testFetch(){
  var res = await fetch("https://player.vimeo.com/video/436588113/config?autopause=1&autoplay=0&background=0&badge=0&byline=0&bypass_privacy=1&collections=0&context=Vimeo%5CController%5CAlbumController.embed_clip&controls=1&like=0&logo=0&loop=0&muted=0&outro_new=0&playbar=1&portrait=0&share=0&speed=0&title=0&watch_later=0&s=8c7f1314106f213f81b0e8546d15f80dd8431f3e_1594780955", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://vimeo.com/showcase/7317727/video/436588113/embed?hash=2fb5b4d900e2d6edc6c7fca3544b3e4731ebdd1b.1594679511",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});
//   var text = await res.text();
//   console.log(text);
 var jdat = await res.json();
    console.log(jdat);  
    
}
testFetch();


var target_files = data.request.files.progressive
var sizes = target_files.map(r=> r.height);
console.log(Math.max(...sizes))
var file_link = target_files.filter(r=> r.height == Math.max(...sizes))[0].url;
console.log( file_link)
