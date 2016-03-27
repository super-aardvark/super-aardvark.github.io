// rage.js

$(document).ready(function() {
   if(typeof(Storage) !== "undefined" && typeof(localStorage) !== "undefined") {
      $.extend(Rage, JSON.parse(localStorage.getItem("RageData")));
   }
   $('#leapButton').click(function(e) { if (confirmButton()) { Rage.leaped(); gauButtonAction(); }});
   $('#returnButton').click(function(e) { if (confirmButton()) { Rage.returned(); gauButtonAction(); }});
   $('#otherButton').click(function(e) { if (confirmButton()) { otherButtonAction(); }});
   $('.content').hide();
   $('#adventureButton').click(function() {
      Rage.currentMode = "adventure";
      $(this).addClass('active');
      $(this).siblings().removeClass('active');
      $('.content').hide();
      setupAdventure();
      $('#adventureContent').show();
      return false;
   });
   $('#veldtButton').click(function() {
      Rage.currentMode = "veldt";
      $(this).addClass('active');
      $(this).siblings().removeClass('active');
      $('.content').hide();
      setupVeldt();
      if (Rage.currentPack) {
         $(document).scrollTop($('#pack-' + Rage.currentPack).position().top - 50);
      }
      return false;
   });
   $('#rageButton').click(function() {
      Rage.currentMode = "rage";
      $(this).addClass('active');
      $(this).siblings().removeClass('active');
      $('.content').hide();
      setupRages();
      $('#rageContent').show();
      return false;
   });
   $('#saveButton').click(function() {
      if(typeof(Storage) !== "undefined") {
          localStorage.setItem("RageData", JSON.stringify(Rage));
      } else {
         alert("No local storage!");
      }
      return false;
   });
   if (Rage.currentMode != null) {
      setTimeout(function() {$('#' + Rage.currentMode + 'Button').click();}, 10);
   }
});

function setupAdventure() {
   $('#adventureContent').empty();
   for (var i = 0; i < walkthroughData.length; i++) {
      var section = walkthroughData[i];
      var sectionDiv = $('<div class="advSection" id="section-' + i + '"></div>');
      if (i == Rage.currentAdvSection) {
         sectionDiv.addClass("current");
      }
      sectionDiv.data('id', i);
      sectionDiv.append($('<h3>' + section.sectionTitle + '</h3>'));
      for (var j = 0; j < section.areas.length; j++) {
         var area = section.areas[j];
         var areaDiv = $('<div class="advArea" id="area-' + i + '-' + j + '"></div>');
         if (j == Rage.currentAdvArea) {
            areaDiv.addClass("current");
         }
         areaDiv.data('id', j);
         areaDiv.append($('<h4>' + area.areaTitle + '</h4>'));
         var hasUncleared = false;
         var hasUnknown = false;
         for (var k = 0; k < area.formations.length; k++) {
            var form = area.formations[k];
            var packId = form.packId;
            var formId = form.formId;
            var formDiv = $('<div id="advFormation-' + packId + '-' + formId + '" class="advFormation"></div>');
            formDiv.data('id', {packId: packId, formId: formId});
            if (Rage.isCleared(packId, formId)) {
               formDiv.addClass("cleared");
            } else {
               formDiv.addClass("uncleared");
               hasUncleared = true;
            }
            // formDiv.append($('<h5 class="formationNum">' + packId + '-' + formId + '</h5>'));
            var enemiesDiv = $('<div class="enemies"></div>');
            var formation = veldtPacks[packId][formId];
            for (var l = 0; l < formation.length; l++) {
               var name = formation[l];
               var nameSpan = $('<span class="enemyName">' + name + '</span>');
               switch (Rage.getKnownStatus(name)) {
               case Rage.KNOWN:
                  nameSpan.addClass('known');
                  break;
               case Rage.UNKNOWN:
                  nameSpan.addClass('unknown');
                  hasUnknown = true;
                  break;
               }
               enemiesDiv.append(nameSpan);
            }
            formDiv.append(enemiesDiv);
            var chanceDiv = $('<div class="chances">Encounter chance: </div>');
            if (form.chance == null) {
               chanceDiv.append("Special");
            } else {
               var pct = 100 * form.chance / form.chanceOutOf;
               chanceDiv.append(form.chance + '/' + form.chanceOutOf + ' (' + pct.toPrecision(3) + '%)');
            }
            formDiv.append(chanceDiv);
            if (form.note) {
               formDiv.append($('<div class="note">Note: ' + form.note + '</div>'));
            }
            areaDiv.append(formDiv);
         }
         if (hasUncleared) {
            areaDiv.addClass("hasUncleared");
         } else {
            areaDiv.addClass("hasNoUncleared");
         }
         if (hasUnknown) {
            areaDiv.addClass("hasUnknown");
         } else {
            areaDiv.addClass("hasNoUnknown");
         }
         sectionDiv.append(areaDiv);
      }
      $('#adventureContent').append(sectionDiv);
   }
   $('.advSection h3').click(sectionClick);
   $('.advArea h4').click(areaClick);
   $('.advFormation').click(formationClick);
   $('#section-' + Rage.currentAdvSection).children('div').show();
   $('#area-' + Rage.currentAdvSection + '-' + Rage.currentAdvArea).children('div').show();
}

function sectionClick(e) {
   var sectionDiv = $(this).closest('div.advSection');
   sectionDiv.find('div.advArea').toggle();
   var areaDiv = sectionDiv.children('div.advArea').first();
   areaDiv.find('div.advFormation').toggle();
   Rage.currentAdvSection = sectionDiv.data('id');
   Rage.currentAdvArea = areaDiv.data('id');
   $('div.advArea.current').removeClass("current");
   areaDiv.addClass("current");
}

function areaClick(e) {
   var areaDiv = $(this).closest('div.advArea');
   areaDiv.find('div.advFormation').toggle();
   Rage.currentAdvArea = areaDiv.data('id');
   $('div.advArea.current').removeClass("current");
   areaDiv.addClass("current");
}

function formationClick(e) {
   var id = $(this).data('id');
   if ($(this).hasClass("uncleared")) {
      Rage.clear(id.packId, id.formId);
      $(this).removeClass("uncleared").addClass("cleared");
   } else {
      Rage.unclear(id.packId, id.formId);
      $(this).removeClass("cleared").addClass("uncleared");
   }
}

function setupVeldt() {
   var veldtContent = $('#veldtContent');
   veldtContent.children().not('#formationDetailPane').remove();
   for (var i = 1; i < veldtPacks.length; i++) {
      var pack = veldtPacks[i];
      if (pack.length > 0) {
         var packDiv = $('<div id="pack-' + i + '" class="pack"></div>');
         if (i == Rage.currentPack) {
            packDiv.addClass("current");
         }
         packDiv.data('id', i);
         packDiv.append($('<h2 class="packLabel">Pack ' + i + '</h2>'));
         var cleared = false;
         var hasUnknown = false;
         for (var j = 0; j < pack.length; j++) {
            var formDiv = $('<div id="formation-' + i + '-' + j + '" class="formation"></div>');
            formDiv.data('id', j);
            if (Rage.isCleared(i, j)) {
               formDiv.addClass("cleared");
               cleared = true;
            } else {
               formDiv.addClass("uncleared");
            }
            formDiv.append($('<strong class="formationNum">' + j + ': </strong>'));
            var formation = pack[j];
            if (formation.length > 0) {
               for (var k = 0; k < formation.length; k++) {
                  var name = formation[k];
                  var nameSpan = $('<span class="enemyName">' + name + '</span>');
                  switch (Rage.getKnownStatus(name)) {
                  case Rage.KNOWN:
                     nameSpan.addClass('known');
                     break;
                  case Rage.UNKNOWN:
                     nameSpan.addClass('unknown');
                     hasUnknown = true;
                     break;
                  }
                  formDiv.append(nameSpan);
               }
            } else {
               formDiv.append("Empty");
            }
            packDiv.append(formDiv);
         }
         if (!cleared) {
            packDiv.addClass("noCleared");
         } else {
            packDiv.addClass("hasCleared");
            if (hasUnknown) {
               packDiv.addClass("hasUnknown");
            } else {
               packDiv.addClass("noUnknown");
            }
         }
         veldtContent.append(packDiv);
      }
   }
   $('div.formation').click(function(e) { activeFormation($(this)); });
   $('#veldtContent').show();
   activePack($('div.pack.current'));
}

function confirmButton() {
   var packId = $('#formationDetailPane').data('id').packId;
   var formId = $('#formationDetailPane').data('id').formId;
   if (!Rage.isCleared(packId, formId)) {
      if (confirm("This formation was not marked as cleared.  Are you sure you just encountered this formation on the Veldt?")) {
         Rage.clear(packId, formId);
      } else {
         return false;
      }
   }
   return true;
}

function gauButtonAction() {
   var data = $('#formationDetailPane').data('id');
   Rage.leap(data.packId, data.formId);
   $('#ragesNeeded').text("No");
   otherButtonAction();
}

function otherButtonAction() {
   var packId = $('#formationDetailPane').data('id').packId;
   var allPacks = $('div.pack.hasCleared');
   for (var i = 0; i < allPacks.length; i++) {
      var pack = $(allPacks[i]);
      if (pack.data('id') === packId) {
         i++;
         if (i >= allPacks.length) i = 0;
         pack = $(allPacks[i]);
         activePack(pack);
         break;
      }
   }
}

function activeFormation(formationDiv) {
   var packDiv = formationDiv.parent();
   var packId = packDiv.data('id');
   var formId = formationDiv.data('id');
   $('#formationId').text(packId + '-' + formId);
   var enemies = formationDiv.clone();
   enemies.find('.formationNum').remove();
   $('#formationEnemies').empty().append(enemies.children());
   $('#formationCleared').text(Rage.isCleared(packId, formId) ? "Yes" : "No");
   var ragesNeeded = false;
   formArray = veldtPacks[packId][formId];
   for (i = 0; i < formArray.length; i++) {
      if (Rage.getKnownStatus(formArray[i]) == Rage.UNKNOWN) {
         ragesNeeded = true;
      }
   }
   $('#ragesNeeded').text(ragesNeeded ? "Yes" : "No");
   if (Rage.gauStatus == null) {
      $('#jumpButton').show();
      $('#returnButton').show();
   } else if (Rage.gauStatus == "leaped") {
      $('#leapButton').hide();
      $('#returnButton').show();
   } else {
      $('#leapButton').show();
      $('#returnButton').hide();
   }
   var pane = $('#formationDetailPane');
   pane.show();
   pane.data('id', {packId: packId, formId: formId});
   pane.css('top', packDiv.offset().top);
}

function activePack(packDiv) {
   $('#pack-' + Rage.currentPack).removeClass("active");
   packDiv.addClass("active");
   Rage.currentPack = packDiv.data('id');
   activeFormation(packDiv.children('.formation.cleared').first());
   $(document).scrollTop(packDiv.position().top - 50);
}

function setupRages() {
   var rageContent = $('#rageContent');
   rageContent.empty();
   var rowDiv;
   for (var i = 0; i < 255; i++) {
      if (i%2 == 0) {
         rowDiv = $('<div class="row"></div>');
         rageContent.append(rowDiv);
      }
      var rageDiv = $('<div class="rage col-md-6"></div>');
      var rageSpan = $('<span class="enemyName">' + rageList[i] + '</span>');
      if (Rage.knownRages[i]) {
         rageSpan.addClass("known");
         rageDiv.addClass("known");
      } else {
         rageSpan.addClass("unknown");
         rageDiv.addClass("unknown");
      }
      rageDiv.append(rageSpan);
      rowDiv.append(rageDiv);
   }
   $('div.rage').click(rageClick);
}

function rageClick(e) {
   var name = $(this).find('.enemyName').text();
   switch (Rage.getKnownStatus(name)) {
   case Rage.KNOWN:
      Rage.unlearn(name);
      $(this).removeClass("known").addClass("unknown");
      break;
   case Rage.UNKNOWN:
      Rage.learn(name);
      $(this).removeClass("unknown").addClass("known");
      break;
   }
}

Rage = {
   KNOWN: 1,
   UNKNOWN: 2,
   currentPack: null,
   gauStatus: null,
   currentAdvSection: 0,
   currentAdvArea: 0,
   currentMode: null,
   clearedFormations: new Array(65),
   knownRages: new Array(255),
   isCleared: 
      function(packId, formId) {
         var pack = this.clearedFormations[packId];
         if (pack != null && pack.length > formId) {
            return pack[formId];
         }
      },
   clear:
      function(packId, formId) {
         var pack = this.clearedFormations[packId];
         if (pack == null || pack.length < 8) {
            pack = new Array(8);
            this.clearedFormations[packId] = pack;
         }
         pack[formId] = true;
         $('#formation-' + packId + '-' + formId).removeClass("uncleared").addClass("cleared");
         $('#advFormation-' + packId + '-' + formId).removeClass("uncleared").addClass("cleared");
      },
   unclear:
      function (packId, formId) {
         var pack = this.clearedFormations[packId];
         if (pack == null || pack.length < 8) {
            pack = new Array(8);
            this.clearedFormations[packId] = pack;
         }
         pack[formId] = false;
         $('#formation-' + packId + '-' + formId).removeClass("cleared").addClass("uncleared");
         $('#advFormation-' + packId + '-' + formId).removeClass("cleared").addClass("uncleared");
      },
   getKnownStatus:
      function(name) {
         var idx = rageMap[name];
         if (idx != null && idx < this.knownRages.length) {
            return this.knownRages[idx] ? Rage.KNOWN : Rage.UNKNOWN;
         } else {
            return null;
         }
      },
   leap:
      function(packId, formId) {
         var formation = veldtPacks[packId][formId];
         for (var i = 0; i < formation.length; i++) {
            var name = formation[i];
            this.learn(name);
         }
      },
   learn:
      function(name) {
         var idx = rageMap[name];
         if (idx != null && idx < this.knownRages.length && !this.knownRages[idx]) {
            this.knownRages[idx] = true;
            $('.enemyName:contains(' + name + ')').removeClass("unknown").addClass("known");
         }
      },
   unlearn:
      function(name) {
         var idx = rageMap[name];
         if (idx != null && idx < this.knownRages.length && !this.knownRages[idx]) {
            this.knownRages[idx] = false;
            $('.enemyName:contains(' + name + ')').removeClass("known").addClass("unknown");
         }
      },
   leaped:
      function() {
         this.gauStatus = "leaped";
      },
   returned:
      function() {
         this.gauStatus = "returned";
      }
}
