import './style.css'
import { dayBlocks, schedule, weekdays } from './config/config.js'



let curr = new Date
let week = []

for (let i = 1; i <= 7; i++) {
  let first = curr.getDate() - curr.getDay() + i
  let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
  week.push(day)
}


function renderTimeForAllWeek(label, time) {
  let timeForWeek = `<div id="" class="weekly-time-block">
      <div id="time-${time}" class="time-block">
        ${label.toLowerCase()}
      </div>
  `;
  let i = 0;
  for (let d of weekdays) {
    timeForWeek += `
      <div id="b-${time}-${week[i++]}" class="day-block">
      </div>
    `;
  }
  return timeForWeek + '</div>';
}


let fullView = `<div class="weekly-time-block weekdays">
<div id="" class="day-block wod">
</div>
`;
for (let d of weekdays) {
  fullView += `
      <div id="" class="day-block wod">
        ${d}
      </div>
    `;
}
fullView += '</div>'

for (let c of dayBlocks) {
  fullView += renderTimeForAllWeek(c.label, c.locator);
}


function renderSchedules() {
  const dates = Object.keys(schedule);
  const datesToRender = dates.filter(d => week.indexOf(d) >= 0);

  for (const d of datesToRender) {
    for (const s of schedule[d]) {
      const { block, offset } = findBlockAndOffset(s.startTime, d);
      const totalBlocks = blocks(d, s.endTime, s.startTime);
      console.log({ block, offset })
      document.querySelector('#b-' + block).innerHTML = `<div class="schedule" style="height: ${totalBlocks}px;">
        <div>${s.title}<div>
        <div class="s-time">${s.startTime} - ${s.endTime}</div>
      </div>`
    }
  }

  function blocks(d, x, y) {
    const e = (new Date(d + ' ' + x)).getTime() - (new Date(d + ' ' + y)).getTime();
    let h = e / (60 * 60 * 1000);
    return 50 * h;
  }

  //11:30, 12:00
  function findBlockAndOffset(t, date) {
    const [x] = t.split(':');
    return { block: `${x}-${date}`, offset: getTimeOffset(t) };
  }

  function getTimeOffset(t) {
    const [_, x] = t.split(':');
    return (parseInt(x) / 60) * 100;
  }
}



document.querySelector('#main').innerHTML = fullView;


renderSchedules();