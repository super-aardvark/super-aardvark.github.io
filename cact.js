var Cact = {
   setup: function() {
      $('input').change(Cact.smartCalc);
   },
   getState: function() {
      var revealedValues = [];
      var hiddenIndices = [];
      var board = new Array(9);
      for (var row = 0; row < 3; row++) {
         for (var col = 0; col < 3; col++) {
            var index = col + row*3;
            var val = parseInt($('input[row="' + row + '"][col="' + col + '"]').val());
            if (val > 0) {
               revealedValues.push(val);
               board[index] = val;
            } else {
               hiddenIndices.push(index);
            }
         }
      }
      console.log(revealedValues);
      revealedValues.sort();
      var hiddenValues = [1,2,3,4,5,6,7,8,9];
      for (var i = revealedValues.length-1; i >= 0; i--) {
         hiddenValues.splice(revealedValues[i]-1, 1);
      }
      console.log(hiddenValues);
      
      var state = new Cact.State();
      state.board = board;
      state.hiddenValues = hiddenValues;
      state.hiddenIndices = hiddenIndices;
      return state;
   },
   smartCalc: function() {
      var state = Cact.getState();
      if (state == null) {
         $('#errorMessage').text("No duplicate values are allowed.");
         return;
      }
      switch (state.hiddenIndices.length) {
         case 9:
         case 8:
         case 7:
         case 6:
            Cact.recommend();
            break;
         case 5:
            Cact.calc();
            break;
         default:
            $('#errorMessage').text("Only enter values for the spaces you've revealed (Max 4)");
      }
   },
   calc: function() {
      Cact.clear();
      var state = Cact.getState();
      console.log(state);
      var averages = state.getAveragePayouts();
      var best = 0;
      var bestElemId = null;
      for (var i = 0; i < averages.length; i++) {
         var val = averages[i];
         var elemId = Cact.valueIds[i];
         $('#' + elemId).text(Math.round(val));
         if (val > best) {
            best = val;
            bestElemId = elemId;
         }
      }
      $('#' + bestElemId).addClass('recommended');
   },
   recommend: function() {
      Cact.clear();
      var state = Cact.getState();
      var newStates = Cact.permute(state);
      var bestAvgScore = 0;
      var bestIndex = [];
      for (var i = 0; i < state.hiddenIndices.length; i++) {
         var idx = state.hiddenIndices[i];
         var childStates = newStates[idx];
         var totalScore = 0;
         for (var j = 0; j < childStates.length; j++) {
            var childState = childStates[j];
            var maxAvg = childState.getMaxAveragePayout();
            totalScore += maxAvg;
         }
         var avgScore = totalScore / childStates.length;
         console.log("Average score for index " + idx + " is " + avgScore);
         if (avgScore > bestAvgScore) {
            bestAvgScore = avgScore;
            bestIndex = [idx];
         } else if (avgScore == bestAvgScore) {
            bestIndex.push(idx);
         }
      }
      for (var i = 0; i < bestIndex.length; i++) {
         idx = bestIndex[i];
         var col = idx % 3;
         var row = idx / 3 | 0;
         $('input[name="input' + col + '' + row + '"]').parent().addClass("recommended");
      }
   },
   getSum: function(array, i1, i2, i3) {
      return array[i1] + array[i2] + array[i3];
   },
   allPayouts: function(array) {
      var payouts = [];
      payouts.push(payout(getSum(array, 0, 1, 2)));
      payouts.push(payout(getSum(array, 3, 4, 5)));
      payouts.push(payout(getSum(array, 6, 7, 8)));
      payouts.push(payout(getSum(array, 0, 3, 6)));
      payouts.push(payout(getSum(array, 1, 4, 7)));
      payouts.push(payout(getSum(array, 2, 5, 8)));
      payouts.push(payout(getSum(array, 0, 4, 8)));
      payouts.push(payout(getSum(array, 2, 4, 6)));
      return payouts;
   },
   payout: function (sum) {
      if (sum == 6) return 10000;
      if (sum == 7) return 36;
      if (sum == 8) return 720;
      if (sum == 9) return 360;
      if (sum == 10) return 80;
      if (sum == 11) return 252;
      if (sum == 12) return 108;
      if (sum == 13) return 72;
      if (sum == 14) return 54;
      if (sum == 15) return 180;
      if (sum == 16) return 72;
      if (sum == 17) return 180;
      if (sum == 18) return 119;
      if (sum == 19) return 36;
      if (sum == 20) return 306;
      if (sum == 21) return 1080;
      if (sum == 22) return 144;
      if (sum == 23) return 1800;
      if (sum == 24) return 3600;
      return 0;
   },
   
   permute: function(state, idx) {
      var newStates = [];
      if (idx >= 0) {
         if (state.board[idx] > 0) {
            alert("oops!");
            return null;
         }
         for (var j = 0; j < state.hiddenValues.length; j++) {
            var newState = new Cact.State();
            newState.copy(state);
            newState.board[idx] = state.hiddenValues[j];
            newState.hiddenIndices.splice(state.hiddenIndices.indexOf(idx), 1);
            newState.hiddenValues.splice(j, 1);
            newStates.push(newState);
         }
      } else {
         newStates = {};
         for (var i = 0; i < state.hiddenIndices.length; i++) {
            var index = state.hiddenIndices[i];
            newStates[index] = Cact.permute(state, index);
         }
      }
      return newStates;
   },
   
   clear: function() {
      $('td').removeClass('recommended');
      $('td.valueCell').text('');
      $('#errorMessage').text('');
   },
   
   clearInput: function() {
      $('input').val('0');
   },
   
   clearAll: function() {
      Cact.clear();
      Cact.clearInput();
   },
   
   State: function() {
      this.board = [];
      this.hiddenValues = [];
      this.hiddenIndices = [];
      
      this.copy = function(otherState) {
         for (var i = 0; i < otherState.board.length; i++) {
            this.board.push(otherState.board[i]);
         }
         for (var i = 0; i < otherState.hiddenValues.length; i++) {
            this.hiddenValues.push(otherState.hiddenValues[i]);
         }
         for (var i = 0; i < otherState.hiddenIndices.length; i++) {
            this.hiddenIndices.push(otherState.hiddenIndices[i]);
         }
      };
      
      this.getPossibleSums = function(row) {
         var hiddenSpaces = 0;
         var staticSum = 0;
         var result = [];
         for (var i = 0; i < row.length; i++) {
            if (row[i] > 0) {
               staticSum += row[i];
            } else {
               hiddenSpaces++;
            }
         }
         if (hiddenSpaces > 0) {
            for (var i = 0; i < this.hiddenValues.length; i++) {
               if (hiddenSpaces > 1) {
                  for (var j = i+1; j < this.hiddenValues.length; j++) {
                     if (hiddenSpaces > 2) {
                        for (var k = j+1; k < this.hiddenValues.length; k++) {
                           result.push(staticSum + this.hiddenValues[i] + this.hiddenValues[j] + this.hiddenValues[k]);
                        }
                     } else {
                        result.push(staticSum + this.hiddenValues[i] + this.hiddenValues[j]);
                     }
                  }
               } else {
                  result.push(staticSum + this.hiddenValues[i]);
               }
            }
         } else {
            result.push(staticSum);
         }
         return result;
      };
      
      this.getRow = function(i1, i2, i3) {
         return [this.board[i1], this.board[i2], this.board[i3]];
      };
      
      this.getAllRows = function() {
         var rows = [];
         rows.push(this.getRow(0, 1, 2));
         rows.push(this.getRow(3, 4, 5));
         rows.push(this.getRow(6, 7, 8));
         rows.push(this.getRow(0, 3, 6));
         rows.push(this.getRow(1, 4, 7));
         rows.push(this.getRow(2, 5, 8));
         rows.push(this.getRow(0, 4, 8));
         rows.push(this.getRow(2, 4, 6));
         return rows;
      };
      
      this.getAveragePayouts = function() {
         var result = [];
         var rows = this.getAllRows();
         for (var i = 0; i < rows.length; i++) {
            var sums = this.getPossibleSums(rows[i]);
            var total = 0;
            for (var j = 0; j < sums.length; j++) {
               total += Cact.payout(sums[j]);
            }
            result.push(total / sums.length);
         }
         return result;
      };
      
      this.getMaxAveragePayout = function() {
         var avgs = this.getAveragePayouts();
         var max = 0;
         for (var i = 0; i < avgs.length; i++) {
            if (avgs[i] > max) max = avgs[i];
         }
         return max;
      };

   },

   valueIds: ['row0Val',
      'row1Val',
      'row2Val',
      'col0Val',
      'col1Val',
      'col2Val',
      'diag0Val',
      'diag1Val']

}

$(document).ready(Cact.setup);
