import {$} from "protractor";

const socket = io();
const data = [];
const chart = Morris.Line({
  element: 'line-example',
  data,
  xkey: 'y',
  ykeys: ['a'],
  labels: ['Time'],
  parseTime: false,
  pointFillColors: ['#ffffff'],
  pointStrokeColors: ['gray'],
  lineColors: ['red']
});
socket.on('sensor-data', (content) => {
  const template = '<tr><td>' + content.sensorData.temperature + 'ºC</td>' +
    '<td>' + content.time + '</td> </tr> '
  data.push({
    y: content.time,
    a: content.sensorData.temperature
  });
  $('.table-body').append(template);
  chart.setData(data);
});
