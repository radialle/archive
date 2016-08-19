  $(document).ready(start);
  $("#now").click(enableNow);

  $("input").change(readInput);

  var now;
  var eth;

  function enableNow() {
    var checked = $("#now").is(":checked");

    if (checked) {
      updateNow();
      now = setInterval(updateNow, 1000);
      $("#date-input").prop('disabled', true);
      $("#time-input").prop('disabled', true);
    }
    else {
      $("#date-input").prop('disabled', false);
      $("#time-input").prop('disabled', false);
      clearInterval(now);
    }
  }

  function updateNow() {
    var mom = new moment();
    $("#date-input").val(mom.format("YYYY-MM-DD"));
    $("#time-input").val(mom.format("HH:mm:ss"));
    readInput();
  }

  function validateLatLong(values) {
  	for (var i in values) {
  		if (isNaN(values[i])) {
  			return false;
  		}
  	}

  	var latDeg = Math.abs(values[0]);
  	if (latDeg > 90) {
  		return false;
  	}
  	else if (latDeg == 90 && (values[1] != 0 || values[2] != 0)) {
  		return false;
  	}

  	var lonDeg = Math.abs(values[3]);
  	if (lonDeg > 180) {
  		return false;
  	}
  	else if (lonDeg == 180 && (values[4] != 0 || values[5] != 0)) {
  		return false;
  	}

  	return true;
  }

  function readInput() {
    var message = $("#main .message");

    var date = $("#date-input").val();
    var time = $("#time-input").val();

    var latDeg = parseInt($("#lat-input-deg").val());
    var latMin = parseInt($("#lat-input-min").val());
    var latSec = parseInt($("#lat-input-sec").val());

    var lonDeg = parseInt($("#lon-input-deg").val());
    var lonMin = parseInt($("#lon-input-min").val());
    var lonSec = parseInt($("#lon-input-sec").val());

    var values = [latDeg, latMin, latSec, lonDeg, lonMin, lonSec];

    var date_split = date.split("-");
    var time_split = time.split(":");

    var mom, loc;

    if (time == "" || date == "" || !validateLatLong(values)) {

      message.text('Data, hora ou localização inválidas.');
    $("#main .wheel").css("-webkit-animation", "disable .5s ease-out forwards");
    
    return;
  }
  else {
    message.text('');
    $("#main .wheel").css("-webkit-animation", "enable .5s ease-out forwards");
    mom = new moment({
      'date': date_split[2],
      'month': date_split[1]-1,
      'year': date_split[0],
      'hour': time_split[0],
      'minute': time_split[1]
    });
    if (time_split.length > 2) {
      mom.seconds(time_split[2]);
    }
    loc = new EtherealLocation();
    loc.setLatitude(latDeg,latMin,latSec);
    loc.setLongitude(lonDeg, lonMin, lonSec);
  }

  eth.setTime(mom);
  eth.setLocation(loc);

  updateLocations(eth.generate());

}

function start() {

  var pointer_a = new EtherealPointer('a');
  pointer_a.setDefaultTransitFunctionParameters('speed', 10);
  var pointer_b = new EtherealPointer('b');
  pointer_b.setDefaultTransitFunctionParameters('speed', 100);
  var pointer_c = new EtherealPointer('c');
  pointer_c.setDefaultTransitFunctionParameters('speed', 500);
  var pointer_d = new EtherealPointer('d');
  pointer_d.setDefaultTransitFunctionParameters('speed', 1000);

  var pc = new EtherealPointerCollection([pointer_a, pointer_b, pointer_c, pointer_d]);

  var sc = new EtherealSignCollection();
  sc.createDefaultCollection();

  eth = new Ethereal();
  eth.setSignCollection(sc);
  eth.setPointerCollection(pc);

  $("#now").prop('checked', true);
  enableNow();

  readInput();

  var loc = new EtherealLocation(-22.902777777777775, -43.2075);

  var mom = new moment();

}

function translateSignName(name) {
  var en = ["Crystal Orange", "Citrus Yellow", "Bright Yellow", "Emerald Green",
  "Glazed Green", "Moss Green", "Sapphire Blue", "Orchid Purple", "Amethyst Violet",
  "Jasmine Pink", "Sparkling Orange", "Citrus Orange"];
  var pt = ["Laranja Cristal", "Amarelo Cítrico", "Amarelo Brilhante", "Verde Esmeralda",
  "Verde Esmaltado", "Verde Musgo", "Azul Safira", "Roxo Orquídea", "Violeta Ametista",
  "Rosa Jasmim", "Laranja Brilhante", "Laranja Cítrico"];
  for (var i in en) {
    if (en[i] == name)
      return pt[i];
  }
}

function updateLocations(res) {
  var pointers = ["a", "b", "c", "d"];
  var sign;
  var degrees;
  var space;
  for (var i in pointers) {
    degrees = res.pointers[pointers[i]].degrees;
    sign = res.pointers[pointers[i]].sign;
    updateLocation($(".point-container." + pointers[i]), degrees);
    updatePointColor($(".point-container." + pointers[i] + " .point"), sign);

    if (degrees < 100)
      space = "  "
    else
      space = " "

    $("#main .results .res-" + pointers[i] + " pre").text(
      pointers[i].toUpperCase() + space + degrees + "° // " + translateSignName(sign.getName())
      );
  }

  updateLocation($('#main .wheel .inner-ring-container'), res.ascendant.degrees);
}

function updatePointColor(point, sign) {
  var names = ["Crystal Orange", "Citrus Yellow", "Bright Yellow", "Emerald Green",
  "Glazed Green", "Moss Green", "Sapphire Blue", "Orchid Purple", "Amethyst Violet",
  "Jasmine Pink", "Sparkling Orange", "Citrus Orange"];
  var colors = ["#FEAC00","#FFCC00","#EDE604","#9ED110", "#50B517", "#179067", "#476EAF", "#9F49AC",
  "#CC42A2", "#FF3BA7", "#FF5800", "#FF8100"];
  for (var i in names) {
    if (names[i] == sign.getName()) {
      point.css("background",colors[i]);
      return;
    }
  }
}


var ulTimeout = [];

function updateLocation(point, deg, update_color) {

  var cls = point.attr('class');

  if (ulTimeout[cls] !== undefined) {
    console.log("Timeout cleared " + ulTimeout[cls]);
    clearTimeout(ulTimeout[cls]);
    ulTimeout[cls] = undefined;
  }

  var pos = point.data('deg');
  point.data('deg', deg);

  var dif = 360 - deg;
  var dp = deg + 360;  
  var dm = deg - 360;

  if (nearestNumber(pos, deg, dp) == dp) {
    point.css({
      'transition': 'transform .5s ease-out',
      'transform': 'rotate(' + dp +  'deg)'
    });
    ulTimeout[cls] = setTimeout(fixLocation, 500, point, deg);
  }
  else if (nearestNumber(pos, deg, dm) == dm) {
    point.css({
      'transition': 'transform .5s ease-out',
      'transform': 'rotate(' + dm +  'deg)'
    });
    ulTimeout[cls] = setTimeout(fixLocation, 500, point, deg);
  }
  else {
    point.css({
      'transition': 'transform .5s ease-out',
      'transform': 'rotate(' + deg +  'deg)'
    });
  }
}

function nearestNumber(x, a, b) {
  var a_distance = a - x;
  if (a_distance < 0) {
    a_distance = -a_distance;
  }
  var b_distance = b - x;
  if (b_distance < 0) {
    b_distance = -b_distance;
  }

  if (a_distance < b_distance) {
    return a;
  }
  return b;
}

function fixLocation(point, deg) {
  point.css({
    '-webkit-transition': '',
    'transform': 'rotate(' + deg + 'deg)'
  });
}