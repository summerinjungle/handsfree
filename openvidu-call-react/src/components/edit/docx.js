import {asBlob} from 'html-docx-js-typescript'
import {saveAs} from 'file-saver'

function presentTime() {
  var date = new Date();
  var year = date.getFullYear();
  var month = "0" + (date.getMonth()+1);
  var day = "0" + date.getDate();
  var hour = "0" + date.getHours();
  var minute = "0" + date.getMinutes();
  // var second = "0" + date.getSeconds();
  return String(year).substr(-2) + "-" + month.substr(-2) + "-" + day.substr(-2) + " "+ hour.substr(-2) + minute.substr(-2);
}

export default function saveButton(a) {
  asBlob(a).then(data => {
     saveAs(data, presentTime() + ' 회의록' + '.docx')
  })
};