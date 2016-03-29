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
      $('.adventureOnly').show(200);
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
      $('.adventureOnly').hide(200);
      return false;
   });
   $('#rageButton').click(function() {
      Rage.currentMode = "rage";
      $(this).addClass('active');
      $(this).siblings().removeClass('active');
      $('.content').hide();
      setupRages();
      $('#rageContent').show();
      $('.adventureOnly').hide(200);
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
      sectionDiv.append($('<h3><span class="glyphicon glyphicon-expand"></span>' + section.sectionTitle + '</h3>'));
      for (var j = 0; j < section.areas.length; j++) {
         var area = section.areas[j];
         var areaDiv = $('<div class="advArea" id="area-' + i + '-' + j + '"></div>');
         if (i == Rage.currentAdvSection && j == Rage.currentAdvArea) {
            areaDiv.addClass("current");
         }
         areaDiv.data('id', j);
         areaDiv.append($('<h4><span class="glyphicon glyphicon-expand"></span>' + area.areaTitle + '</h4>'));
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
   $('.glyphicon-expand').click(accordionClick);
   $('.advArea').dblclick(function(e){e.stopPropagation(); activeArea($(this));});
   $('.advSection').dblclick(function(e){activeSection($(this));});
   $('.advFormation').click(formationClick);
   // $('#section-' + Rage.currentAdvSection).children('div').show();
   // $('#area-' + Rage.currentAdvSection + '-' + Rage.currentAdvArea).children('div').show();
   setTimeout(function() {
      activeSection($('#section-' + Rage.currentAdvSection), true);
      activeArea($('#area-' + Rage.currentAdvSection + '-' + Rage.currentAdvArea));
   }, 10);
}


function accordionClick(e) {
   e.stopPropagation();
   accordion($(this).closest('div'));
}

function accordion(container, expandOnly) {
   var expIcon = container.children().first().find('.glyphicon');
   if (expandOnly || expIcon.hasClass("glyphicon-expand")) {
      expIcon.removeClass("glyphicon-expand").addClass("glyphicon-collapse-down");
      container.children('div').show(300);
   } else {
      expIcon.removeClass("glyphicon-collapse-down").addClass("glyphicon-expand");
      container.children('div').hide(300);
   }
}

function activeSection(sectionDiv, skipArea) {
   Rage.currentAdvSection = sectionDiv.data('id');
   accordion($('.advSection.current'));
   $('.advSection.current').removeClass("current");
   sectionDiv.addClass("current");
   accordion(sectionDiv, true);
   if (!skipArea) activeArea(sectionDiv.children('.advArea').first());
   // $(document).scrollTop(sectionDiv.position().top - 50);
}

function activeArea(areaDiv) {
   var sectionDiv = areaDiv.parent();
   if (!sectionDiv.hasClass("current")) {
      activeSection(areaDiv.parent(), true);
   }
   Rage.currentAdvArea = areaDiv.data('id');
   accordion($('.advArea.current'));
   $('.advArea.current').removeClass("current");
   areaDiv.addClass("current");
   
   var scrollTop = $(document).scrollTop();
   accordion(areaDiv, true);
   var int = setInterval(function() {
         var areaTop = areaDiv.position().top - 110;
         if (areaTop < scrollTop) {
            $(document).scrollTop(areaTop);
            scrollTop = areaTop;
         }
      }, 10);
   setTimeout(function() { clearInterval(int); }, 300);
}

function prevArea() {
   var current = $('.advArea.current');
   if (current.length == 0) {
      activeArea($('.advArea').first());
      return;
   }
   var prev = current.prev('.advArea');
   if (prev.length > 0) {
      activeArea(prev);
   } else {
      activeArea(current.parent().prev().children('.advArea').last());
   }
}

function nextArea() {
   var current = $('.advArea.current');
   if (current.length == 0) {
      activeArea($('.advArea').first());
      return;
   }
   var next = current.next('.advArea');
   if (next.length > 0) {
      activeArea(next);
   } else {
      activeArea(current.parent().next().children('.advArea').first());
   }
}

function prevSection() {
   var current = $('.advSection.current');
   var prev = current.prev('.advSection');
   if (prev.length > 0) {
      activeSection(prev);
   }
}

function nextSection() {
   var current = $('.advSection.current');
   var next = current.next('.advSection');
   if (next.length > 0) {
      activeSection(next);
   }
}

function toggleSection(sectionDiv, expandOnly) {
   var expIcon = $(this).find('h3 .glyphicon');
   if (expIcon.hasClass("glyphicon-expand")) {
      expIcon.removeClass("glyphicon-expand").addClass("glyphicon-collapse-down");
      sectionDiv.find('div.advArea').show();
   } else {
      sectionDiv.find('div.advArea').hide();
      expIcon.removeClass("glyphicon-collapse-down").addClass("glyphicon-expand");
   }
   Rage.currentAdvSection = sectionDiv.data('id');
   toggleArea(sectionDiv.children('div.advArea').first());
}

function toggleArea(areaDiv, expandOnly) {
   var expIcon = $(this).find('h4 .glyphicon');
   if (expIcon.hasClass("glyphicon-expand")) {
      expIcon.removeClass("glyphicon-expand").addClass("glyphicon-collapse-down");
      sectionDiv.find('div.advArea').show();
   } else {
      sectionDiv.find('div.advArea').hide();
      expIcon.removeClass("glyphicon-collapse-down").addClass("glyphicon-expand");
   }
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
   if (Rage.options.showAllVeldtPacks) {
      $('.noCleared').show();
   }
   $('#veldtContent').show();
   if (Rage.currentPack != null) {
      activePack($('div.pack.current'));
   }
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
   currentMode: "adventure",
   clearedFormations: new Array(65),
   knownRages: new Array(255),
   options: {},
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
         switch (Rage.currentMode) {
         case "veldt":
            $('#formation-' + packId + '-' + formId).removeClass("uncleared").addClass("cleared");
            var packDiv = $('#pack-' + packId);
            if (packDiv.hasClass("noCleared")) {
               packDiv.removeClass("noCleared").addClass("hasCleared");
               if (packDiv.find('.enemyName.unknown').length > 0) {
                  packDiv.addClass("hasUnknown");
               } else {
                  packDiv.addClass("noUnknown");
               }
            }
            break;
         case "adventure":
            $('#advFormation-' + packId + '-' + formId).removeClass("uncleared").addClass("cleared");
            break;
         }
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
            var learnedEnemies = $('.enemyName:contains(' + name + ')');
            learnedEnemies.removeClass("unknown").addClass("known");
            if (Rage.currentMode == "veldt") {
               learnedEnemies.closest('.pack').each(function(i, e){
                  var packDiv = $(e);
                  if (packDiv.find('.enemyName.unknown').length == 0) {
                     packDiv.removeClass("hasUnknown").addClass("noUnknown");
                  }
               });
            }
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
      },
   save:
      function() {
         if(typeof(Storage) !== "undefined") {
             localStorage.setItem("RageData", JSON.stringify(Rage));
         } else {
            alert("No local storage!");
         }
      },
   showOptions:
      function() {
         $('#allPacksCheckbox').prop('checked', Rage.options.showAllVeldtPacks === true);
         $('#optionsModal').modal();
      },
   saveOptions:
      function() {
         Rage.options.showAllVeldtPacks = $('#allPacksCheckbox').prop('checked');
         $('#optionsModal').modal('hide');
         if (Rage.currentMode != null) {
            setTimeout(function() {$('#' + Rage.currentMode + 'Button').click();}, 10);
         }
      },
   export:
      function() {
         $('#exportText').val(LZString.compressToBase64(JSON.stringify(this)));
         $('#exportModal').modal();
      },
   import:
      function() {
         $('#importModal').modal();
      },
   importData:
      function() {
         $.extend(Rage, JSON.parse(LZString.decompressFromBase64($('#importText').val())));
         if (Rage.currentMode != null) {
            setTimeout(function() {$('#' + Rage.currentMode + 'Button').click();}, 10);
         }
         $('#importModal').modal('hide');
      }
}
