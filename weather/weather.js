var WeatherFinder = {

getWeather(timeMillis, zone) {
   return this.weatherChances[zone](this.calculateForecastTarget(timeMillis));
},

calculateForecastTarget: function(timeMillis) { 
    // Thanks to Rogueadyn's SaintCoinach library for this calculation.
    // lDate is the current local time.

    var unixSeconds = parseInt(timeMillis / 1000);
    // Get Eorzea hour for weather start
    var bell = unixSeconds / 175;

    // Do the magic 'cause for calculations 16:00 is 0, 00:00 is 8 and 08:00 is 16
    var increment = (bell + 8 - (bell % 8)) % 24;

    // Take Eorzea days since unix epoch
    var totalDays = unixSeconds / 4200;
    totalDays = (totalDays << 32) >>> 0; // Convert to uint

    // 0x64 = 100
    var calcBase = totalDays * 100 + increment;

    // 0xB = 11
    var step1 = (calcBase << 11) ^ calcBase;
    var step2 = (step1 >>> 8) ^ step1;

    // 0x64 = 100
    return step2 % 100;
},

getEorzeaHour: function(timeMillis) {
    var unixSeconds = parseInt(timeMillis / 1000);
    // Get Eorzea hour
    var bell = (unixSeconds / 175) % 24;
    return Math.floor(bell);
},

getWeatherTimeFloor: function(date) {
    var unixSeconds = parseInt(date.getTime() / 1000);
    // Get Eorzea hour for weather start
    var bell = (unixSeconds / 175) % 24;
    var startBell = bell - (bell % 8);
    var startUnixSeconds = unixSeconds - (175 * (bell - startBell));
    return new Date(startUnixSeconds * 1000);
},

weatherChances: {
"Limsa Lominsa": function(chance) { if (chance < 20) { return "Clouds"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 80) { return "Sunshine"; } else if (chance < 90) { return "Fog"; } else { return "Rain"; } },
"Middle La Noscea": function(chance) { if (chance < 20) { return "Clouds"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 70) { return "Sunshine"; } else if (chance < 80) { return "Wind"; } else if (chance < 90) { return "Fog"; } else { return "Rain"; } },
"Lower La Noscea": function(chance) { if (chance < 20) { return "Clouds"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 70) { return "Sunshine"; } else if (chance < 80) { return "Wind"; } else if (chance < 90) { return "Fog"; } else { return "Rain"; } },
"Eastern La Noscea": function(chance) { if (chance < 5) { return "Fog"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 80) { return "Sunshine"; } else if (chance < 90) { return "Clouds"; } else if (chance < 95) { return "Rain"; } else { return "Showers"; } },
"Western La Noscea": function(chance) { if (chance < 10) { return "Fog"; } else if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Sunshine"; } else if (chance < 80) { return "Clouds"; } else if (chance < 90) { return "Wind"; } else { return "Gales"; } },
"Upper La Noscea": function(chance) { if (chance < 30) { return "Clear Skies"; } else if (chance < 50) { return "Sunshine"; } else if (chance < 70) { return "Clouds"; } else if (chance < 80) { return "Fog"; } else if (chance < 90) { return "Thunder"; } else { return "Thunderstorms"; } },
"Outer La Noscea": function(chance) { if (chance < 30) { return "Clear Skies"; } else if (chance < 50) { return "Sunshine"; } else if (chance < 70) { return "Clouds"; } else if (chance < 85) { return "Fog"; } else { return "Rain"; } },
"Mist": function(chance) { if (chance < 20) { return "Clouds"; } else if (chance < 50) { return "Clear Skies"; } else if (chance < 70) { return "Sunshine"; } else if (chance < 80) { return "Sunshine"; } else if (chance < 90) { return "Fog"; } else { return "Rain"; } },
"Gridania": function(chance) { if (chance < 5) { return "Rain"; } else if (chance < 20) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 55) { return "Sunshine"; } else if (chance < 85) { return "Clear Skies"; } else { return "Sunshine"; } },
"Central Shroud": function(chance) { if (chance < 5) { return "Thunder"; } else if (chance < 20) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 55) { return "Sunshine"; } else if (chance < 85) { return "Clear Skies"; } else { return "Sunshine"; } },
"East Shroud": function(chance) { if (chance < 5) { return "Thunder"; } else if (chance < 20) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 55) { return "Sunshine"; } else if (chance < 85) { return "Clear Skies"; } else { return "Sunshine"; } },
"South Shroud": function(chance) { if (chance < 5) { return "Fog"; } else if (chance < 10) { return "Thunderstorms"; } else if (chance < 25) { return "Thunder"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 70) { return "Sunshine"; } else { return "Clear Skies"; } },
"North Shroud": function(chance) { if (chance < 5) { return "Fog"; } else if (chance < 10) { return "Showers"; } else if (chance < 25) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 70) { return "Sunshine"; } else { return "Clear Skies"; } },
"The Lavender Beds": function(chance) { if (chance < 5) { return "Clouds"; } else if (chance < 20) { return "Rain"; } else if (chance < 30) { return "Fog"; } else if (chance < 40) { return "Clouds"; } else if (chance < 55) { return "Sunshine"; } else if (chance < 85) { return "Clear Skies"; } else { return "Sunshine"; } },
"Ul'dah": function(chance) { if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Sunshine"; } else if (chance < 85) { return "Clouds"; } else if (chance < 95) { return "Fog"; } else { return "Rain"; } },
"Western Thanalan": function(chance) { if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Sunshine"; } else if (chance < 85) { return "Clouds"; } else if (chance < 95) { return "Fog"; } else { return "Rain"; } },
"Central Thanalan": function(chance) { if (chance < 15) { return "Dust Storms"; } else if (chance < 55) { return "Clear Skies"; } else if (chance < 75) { return "Sunshine"; } else if (chance < 85) { return "Clouds"; } else if (chance < 95) { return "Fog"; } else { return "Rain"; } },
"Eastern Thanalan": function(chance) { if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Sunshine"; } else if (chance < 70) { return "Clouds"; } else if (chance < 80) { return "Fog"; } else if (chance < 85) { return "Rain"; } else { return "Showers"; } },
"Southern Thanalan": function(chance) { if (chance < 20) { return "Heat Waves"; } else if (chance < 60) { return "Clear Skies"; } else if (chance < 80) { return "Sunshine"; } else if (chance < 90) { return "Clouds"; } else { return "Fog"; } },
"Northern Thanalan": function(chance) { if (chance < 5) { return "Clear Skies"; } else if (chance < 20) { return "Sunshine"; } else if (chance < 50) { return "Clouds"; } else { return "Fog"; } },
"The Goblet": function(chance) { if (chance < 40) { return "Clear Skies"; } else if (chance < 60) { return "Sunshine"; } else if (chance < 85) { return "Clouds"; } else if (chance < 95) { return "Fog"; } else { return "Rain"; } },
"Coerthas Central Highlands": function(chance) { if (chance < 20) { return "Blizzards"; } else if (chance < 60) { return "Snow"; } else if (chance < 70) { return "Sunshine"; } else if (chance < 75) { return "Clear Skies"; } else if (chance < 90) { return "Clouds"; } else { return "Fog"; } },
"Mor Dhona": function(chance) { if (chance < 15) { return "Clouds"; } else if (chance < 30) { return "Fog"; } else if (chance < 60) { return "Gloom"; } else if (chance < 75) { return "Clear Skies"; } else { return "Sunshine"; } }
},

weatherLists: {
"Limsa Lominsa": ["Clouds","Clear Skies","Sunshine","Fog","Rain"],
"Middle La Noscea": ["Clouds","Clear Skies","Sunshine","Wind","Fog","Rain"],
"Lower La Noscea": ["Clouds","Clear Skies","Sunshine","Wind","Fog","Rain"],
"Eastern La Noscea": ["Fog","Clear Skies","Sunshine","Clouds","Rain","Showers"],
"Western La Noscea": ["Fog","Clear Skies","Sunshine","Clouds","Wind","Gales"],
"Upper La Noscea": ["Clear Skies","Sunshine","Clouds","Fog","Thunder","Thunderstorms"],
"Outer La Noscea": ["Clear Skies","Sunshine","Clouds","Fog","Rain" ],
"Mist": ["Clouds","Clear Skies","Sunshine","Fog","Rain" ],
"Gridania": ["Rain","Fog","Clouds","Sunshine","Clear Skies"],
"Central Shroud": ["Thunder","Rain","Fog","Clouds","Sunshine","Clear Skies"],
"East Shroud": ["Thunder","Rain","Fog","Clouds","Sunshine","Clear Skies"],
"South Shroud": ["Fog","Thunderstorms","Thunder","Clouds","Sunshine","Clear Skies"],
"North Shroud": ["Fog","Showers","Rain","Clouds","Sunshine","Clear Skies"],
"The Lavender Beds": ["Clouds","Rain","Fog","Sunshine","Clear Skies"],
"Ul'dah": ["Clear Skies","Sunshine","Clouds","Fog","Rain"],
"Western Thanalan": ["Clear Skies","Sunshine","Clouds","Fog","Rain"],
"Central Thanalan": ["Dust Storms","Clear Skies","Sunshine","Clouds","Fog","Rain"],
"Eastern Thanalan": ["Clear Skies","Sunshine","Clouds","Fog","Rain","Showers"],
"Southern Thanalan": ["Heat Waves","Clear Skies","Sunshine","Clouds","Fog"],
"Northern Thanalan": ["Clear Skies","Sunshine","Clouds","Fog"],
"The Goblet": ["Clear Skies","Sunshine","Clouds","Fog","Rain"],
"Coerthas Central Highlands": ["Blizzards","Snow","Sunshine","Clear Skies","Clouds","Fog"],
"Mor Dhona": ["Clouds","Fog","Gloom","Clear Skies","Sunshine"]
}
};