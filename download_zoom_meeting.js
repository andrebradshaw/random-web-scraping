function dateString(d){
  var weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var date = new Date(d);
  return `${weekday} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function downloadZoomReplay(){
  var url = Array.from(document.getElementsByTagName('video')).filter(elm=> elm.getAttribute('role') == 'application')[0].getAttribute('src');
  var a = document.createElement('a'),
  a.download = 'Zoom Meeting - ' + dateString(new Date());
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 10);
}

downloadZoomReplay();
