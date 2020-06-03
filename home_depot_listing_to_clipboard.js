var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var ele = (t) => document.createElement(t);
var attr = (o, k, v) => o.setAttribute(k, v);
var a = (l, r) => r.forEach(a => attr(l, a[0], a[1]));

async function getDetailsFromPage(){
  var url = window.location.href;
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text,'text/html');
  var obj = {
    upc: tn(doc,'upc') && tn(doc,'upc').length ? tn(doc,'upc')[0].innerText.trim() : '',
    product_name: cn(doc,'product-title__title') && cn(doc,'product-title__title').length ? cn(doc,'product-title__title')[0].innerText.trim() :  '',
    current_price: gi(doc,'ajaxPrice') && gi(doc,'ajaxPrice').getAttribute('content') && /^[\d\.]+$/.test(gi(doc,'ajaxPrice').getAttribute('content').trim()) ? parseFloat(gi(doc,'ajaxPrice').getAttribute('content').trim()) : 0,
    original_price: cn(doc,'pStrikeThru') &&  cn(doc,'pStrikeThru').length &&  /^[\d\.]+$/.test(cn(doc,'pStrikeThru')[0].innerText.trim().replace(/\$/g, '')) ? parseFloat(cn(doc,'pStrikeThru')[0].innerText.trim().replace(/\$/g, '')) : 0,
 /*note: this will show as zero if there is an error, so need to account for that somewhere else within the price check conditions.*/
  };
  copyToClip(obj);
}
async function copyToClip(obj){
  var temp = ele('textarea');
  document.body.appendChild(temp);
  temp.value = Object.entries(obj).map(t=> t[1]).reduce((a,b)=> a+'\t'+b);
/* temp.value = obj.upc; */
  temp.select();
  document.execCommand('copy');
  await delay(1);
  temp.outerHTML = '';
}

getDetailsFromPage()
