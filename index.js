function Calendar() {
  var d = document;
  var constants = {
    parentCotainer: 'calendar-container',
    layout: 'calendar-layout',
    layoutActive: 'calendar-layout-active',
  };

  var handleButtonClick = function () {
    console.log('Calendar button clicked');
    var container = d.getElementById(constants.layout);
    var layout = d.getElementById(constants.layout);
    if (container.classList.contains(constants.layoutActive)) {
      container.classList.remove(constants.layoutActive);
      layout.innerHTML = '';
    } else {
      container.classList.add(constants.layoutActive);
      var date = new Date();
      drawDefaultCalendar(date.getMonth() + 1, 1, date.getFullYear());
    }
  };

  var navigateToPrevMonth = function () {
    var defaultDay = 1;
    if (CUR_MONTH - 2 < 0) {
      CUR_YEAR = CUR_YEAR - 1;
      CUR_MONTH = 13;
    }
    var d = new Date(`${CUR_MONTH - 1}/${defaultDay}/${CUR_YEAR}`);
    drawDefaultCalendar(d.getMonth() + 1, d.getDate(), d.getFullYear());
  };

  var navigateToNextMonth = function () {
    var defaultDay = 1;
    if (CUR_MONTH + 1 > 12) {
      CUR_YEAR = CUR_YEAR + 1;
      CUR_MONTH = 0;
    }
    var d = new Date(`${CUR_MONTH + 1}/${defaultDay}/${CUR_YEAR}`);
    drawDefaultCalendar(d.getMonth() + 1, d.getDate(), d.getFullYear());
  };

  var showSelectedDate = function (e) {
    d.getElementById('current-selected-date').innerText =
      this.getAttribute('data-attr');
  };

  var removeNavListners = function () {
    var prevMonth = d.getElementById('prev-month'),
      nextMonth = d.getElementById('next-month'),
      dayClicks = d.getElementsByClassName('each-day');
    prevMonth.removeEventListener('click', navigateToPrevMonth, false);
    for (var i = 0; i < dayClicks.length; i++) {
      dayClicks[i].removeEventListener('click', showSelectedDate, false);
    }
  };

  var attachNavListners = function () {
    var prevMonth = d.getElementById('prev-month'),
      nextMonth = d.getElementById('next-month'),
      dayClicks = d.getElementsByClassName('each-day');
    prevMonth.addEventListener('click', navigateToPrevMonth, false);
    nextMonth.addEventListener('click', navigateToNextMonth, false);
    for (var i = 0; i < dayClicks.length; i++) {
      dayClicks[i].addEventListener('click', showSelectedDate, false);
    }
  };

  var CUR_MONTH, CUR_DAY, CUR_YEAR; // global to Calendar scope
  var drawDefaultCalendar = function (mm, dd, yyyy) {
    CUR_MONTH = mm;
    CUR_DAY = dd;
    CUR_YEAR = yyyy;
    var defaultDate = new Date(`${mm}/${dd}/${yyyy}`);
    var startDayOfMonth = defaultDate.toLocaleDateString('en', {
      weekday: 'short',
    });
    var totalDaysInMonth = new Date(yyyy, mm, 0).getDate();
    console.log(totalDaysInMonth);
    var monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    var weekNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var layout = '';
    layout += `<div class="calendar-header"><h3>${
      monthNames[mm - 1]
    } ${yyyy}</h3>`;
    layout +=
      '<div class="month-nav-container"><button class="prev-month month-nav" id="prev-month"><</button><button class="next-month month-nav" id="next-month">></button></div>';
    layout += '</div>';
    layout += '<table class="calendar-table"><thead><tr>';
    // header
    for (var i = 0; i < 7; i++) {
      layout += `<th>${weekNames[i]}</th>`;
    }
    layout += '</tr></thead>';
    // body
    var dayCounter = 0,
      runningDay,
      runningMonth = new Date().getMonth() + 1,
      runningYear = new Date().getFullYear(),
      actualCurrDay = new Date().getDate();
    layout += '<tbody>';
    for (var i = 0; i < 6; i++) {
      layout += '<tr>';
      for (var j = 0; j < 7; j++) {
        if (
          (weekNames[j] === startDayOfMonth && dayCounter < totalDaysInMonth) ||
          (dayCounter && dayCounter < totalDaysInMonth)
        ) {
          runningDay = ++dayCounter;
          layout += `<td class="each-day each-day-${
            actualCurrDay === runningDay &&
            runningMonth === CUR_MONTH &&
            runningYear === CUR_YEAR
              ? 'active'
              : ''
          }" data-attr="${yyyy}/${mm}/${runningDay}" >${runningDay}</td>`;
        } else {
          layout += '<td class="btn-disabled">-</td>';
        }
      }
      layout += '</tr>';
    }
    layout += '</tbody></table>';
    layout += '<h4 id="current-selected-date"></h4>';

    var container = d.getElementById(constants.layout);
    container.innerHTML = layout;
    removeNavListners();
    attachNavListners();
  };

  var init = function (domId, valueOfTheBtn) {
    if (!domId) {
      throw 'Invalid calendar source';
    }
    // Final destination at UI
    var destination = d.getElementById(domId);

    // Calendar button
    var button = createBasicDomEle(
      'button',
      'calendar',
      'click',
      handleButtonClick
    );
    button.innerText = valueOfTheBtn;

    // Button container for css
    var container = createBasicDomEle('div', constants.parentCotainer);
    container.appendChild(button);

    // Add calendar layout
    drawCalendarLayout(container);

    // Add to DOM
    destination.appendChild(container);
  };

  var drawCalendarLayout = function (parent) {
    var container = createBasicDomEle('div', constants.layout);
    container.classList.add(constants.layout);
    parent.appendChild(container);
  };

  var createBasicDomEle = function (name, id, type, cb) {
    var ele = d.createElement(name);
    ele.setAttribute('id', id);
    if (cb) {
      ele.addEventListener(type, cb, false);
    }
    return ele;
  };

  return {
    init: init,
  };
}

Calendar().init('app', 'Calendar');
