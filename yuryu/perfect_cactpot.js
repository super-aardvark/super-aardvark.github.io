var EPS = 0.00001;

/* Solve for the best row choice when 4 tiles have been flipped.
Returns the expected value of picking that row.

state is an array of the current board state, e.g., 001056020
0 means the tile is not flipped. 5 means the tile is showing a 5.

rewards is an array of rewards for each sum.
For example, rewards[6] = 10000;

row is an array of which rows are the best choice to maximize expected value.
It is passed into the function as an array of FALSE.
The function changes the best choices to TRUE. Indices are as follows:
0 = top row
1 = middle row
2 = bottom row
3 = left column
4 = center column
5 = right column
6 = major diagonal
7 = minor diagonal
For example, if the function changes row[5] to TRUE, that means the right column
 is (potentially tied for) the best choice for maximizing expected value. */

var PerfectCactpot = {

   openings: {"100000000":[1677.7854166666664,[false,false,true,false,false,false,true,false,false]],"200000000":[1665.8127976190476,[false,false,true,false,false,false,true,false,false]],"300000000":[1662.504761904762,[false,false,true,false,false,false,true,false,false]],"400000000":[1365.0047619047618,[false,false,false,false,true,false,false,false,false]],"500000000":[1359.5589285714286,[false,false,false,false,true,false,false,false,false]],"600000000":[1364.3044642857142,[false,false,false,false,true,false,false,false,false]],"700000000":[1454.5455357142855,[false,false,false,false,true,false,false,false,false]],"800000000":[1527.0875,[false,false,true,false,true,false,true,false,false]],"900000000":[1517.7214285714285,[false,false,true,false,true,false,true,false,false]],
              "010000000":[1411.3541666666665,[false,false,false,false,true,false,false,false,false]],"020000000":[1414.9401785714288,[false,false,false,false,true,false,false,false,false]],"030000000":[1406.4190476190477,[false,false,false,false,true,false,false,false,false]],"040000000":[1443.3062499999999,[false,false,false,false,false,false,true,false,true]],"050000000":[1444.3172619047618,[false,false,false,false,true,false,true,false,true]],"060000000":[1441.3663690476192,[false,false,false,false,true,false,false,false,false]],"070000000":[1485.6839285714286,[false,false,false,false,true,false,false,false,false]],"080000000":[1512.927976190476,[true,false,true,false,false,false,false,false,false]],"090000000":[1518.466369047619,[true,false,true,false,false,false,false,false,false]],
              "001000000":[1677.7854166666664,[true,false,false,false,false,false,false,false,true]],"002000000":[1665.8127976190476,[true,false,false,false,false,false,false,false,true]],"003000000":[1662.504761904762,[true,false,false,false,false,false,false,false,true]],"004000000":[1365.0047619047618,[false,false,false,false,true,false,false,false,false]],"005000000":[1359.5589285714286,[false,false,false,false,true,false,false,false,false]],"006000000":[1364.3044642857142,[false,false,false,false,true,false,false,false,false]],"007000000":[1454.5455357142855,[false,false,false,false,true,false,false,false,false]],"008000000":[1527.0875,[true,false,false,false,true,false,false,false,true]],"009000000":[1517.7214285714285,[true,false,false,false,true,false,false,false,true]],
              "000100000":[1411.3541666666665,[false,false,false,false,true,false,false,false,false]],"000200000":[1414.9401785714288,[false,false,false,false,true,false,false,false,false]],"000300000":[1406.4190476190477,[false,false,false,false,true,false,false,false,false]],"000400000":[1443.3062499999999,[false,false,true,false,false,false,false,false,true]],"000500000":[1444.3172619047618,[false,false,true,false,true,false,false,false,true]],"000600000":[1441.3663690476192,[false,false,false,false,true,false,false,false,false]],"000700000":[1485.6839285714286,[false,false,false,false,true,false,false,false,false]],"000800000":[1512.927976190476,[true,false,false,false,false,false,true,false,false]],"000900000":[1518.466369047619,[true,false,false,false,false,false,true,false,false]],
              "000010000":[1860.4401785714285,[true,false,true,false,false,false,true,false,true]],"000020000":[1832.5413690476191,[true,false,true,false,false,false,true,false,true]],"000030000":[1834.179761904762,[true,false,true,false,false,false,true,false,true]],"000040000":[1171.9669642857143,[true,false,true,false,false,false,true,false,true]],"000050000":[1176.2047619047619,[true,false,true,false,false,false,true,false,true]],"000060000":[1234.6142857142856,[true,false,true,false,false,false,true,false,true]],"000070000":[1427.3583333333331,[true,false,true,false,false,false,true,false,true]],"000080000":[1544.7607142857144,[true,false,true,false,false,false,true,false,true]],"000090000":[1509.197619047619,[true,false,true,false,false,false,true,false,true]],
              "000001000":[1411.3541666666665,[false,false,false,false,true,false,false,false,false]],"000002000":[1414.9401785714288,[false,false,false,false,true,false,false,false,false]],"000003000":[1406.4190476190477,[false,false,false,false,true,false,false,false,false]],"000004000":[1443.3062499999999,[true,false,false,false,false,false,true,false,false]],"000005000":[1444.3172619047618,[true,false,false,false,true,false,true,false,false]],"000006000":[1441.3663690476192,[false,false,false,false,true,false,false,false,false]],"000007000":[1485.6839285714286,[false,false,false,false,true,false,false,false,false]],"000008000":[1512.927976190476,[false,false,true,false,false,false,false,false,true]],"000009000":[1518.466369047619,[false,false,true,false,false,false,false,false,true]],
              "000000100":[1677.7854166666664,[true,false,false,false,false,false,false,false,true]],"000000200":[1665.8127976190476,[true,false,false,false,false,false,false,false,true]],"000000300":[1662.504761904762,[true,false,false,false,false,false,false,false,true]],"000000400":[1365.0047619047618,[false,false,false,false,true,false,false,false,false]],"000000500":[1359.5589285714286,[false,false,false,false,true,false,false,false,false]],"000000600":[1364.3044642857142,[false,false,false,false,true,false,false,false,false]],"000000700":[1454.5455357142855,[false,false,false,false,true,false,false,false,false]],"000000800":[1527.0875,[true,false,false,false,true,false,false,false,true]],"000000900":[1517.7214285714285,[true,false,false,false,true,false,false,false,true]],
              "000000010":[1411.3541666666665,[false,false,false,false,true,false,false,false,false]],"000000020":[1414.9401785714288,[false,false,false,false,true,false,false,false,false]],"000000030":[1406.4190476190477,[false,false,false,false,true,false,false,false,false]],"000000040":[1443.3062499999999,[true,false,true,false,false,false,false,false,false]],"000000050":[1444.3172619047618,[true,false,true,false,true,false,false,false,false]],"000000060":[1441.3663690476192,[false,false,false,false,true,false,false,false,false]],"000000070":[1485.6839285714286,[false,false,false,false,true,false,false,false,false]],"000000080":[1512.927976190476,[false,false,false,false,false,false,true,false,true]],"000000090":[1518.466369047619,[false,false,false,false,false,false,true,false,true]],
              "000000001":[1677.7854166666664,[false,false,true,false,false,false,true,false,false]],"000000002":[1665.8127976190476,[false,false,true,false,false,false,true,false,false]],"000000003":[1662.504761904762,[false,false,true,false,false,false,true,false,false]],"000000004":[1365.0047619047618,[false,false,false,false,true,false,false,false,false]],"000000005":[1359.5589285714286,[false,false,false,false,true,false,false,false,false]],"000000006":[1364.3044642857142,[false,false,false,false,true,false,false,false,false]],"000000007":[1454.5455357142855,[false,false,false,false,true,false,false,false,false]],"000000008":[1527.0875,[false,false,true,false,true,false,true,false,false]],"000000009":[1517.7214285714285,[false,false,true,false,true,false,true,false,false]]
   },
   
   solve: function(input)
   {
       var state = [];
       if (typeof(input) == 'string') {
         for (var i = 0; i < input.length; i++) {
            state[i] = parseInt(input.charAt(i));
         }
       } else if (typeof(input) == 'object') {
         state = input;
       } else {
         return null;
       }

       // Count how many are visible
       var num_revealed = 0;
       for (var i = 0; i < 9; i++)
       {
           if (state[i] > 0)
               num_revealed++;
       }

       // If four are visible, we are picking between eight rows. Otherwise, we are picking
       // between nine tiles (although we'll never be picking revealed tiles)
       var num_options = 9;
       if (num_revealed == 4)
           num_options = 8;

       // Run the appropriate function to solve for the optimnal choice
       var which_to_flip = [];
       for (var i = 0; i < num_options; i++)
           which_to_flip[i] = false;
       var value = 0;
       switch (num_revealed)
       {
       case 1:
           value = this.solve_1 (state, payout, which_to_flip);
           break;
       case 2:
           value = this.solve_2 (state, payout, which_to_flip);
           break;
       case 3:
           value = this.solve_3 (state, payout, which_to_flip);
           break;
       case 4:
           value = this.solve_4 (state, payout, which_to_flip);
           break;
       }
       
       return which_to_flip;
   },
   
   solve_4: function(state, rewards, row) {
       var unknowns = [];
       var ids = [];
       var has = [];
       var tot_win = [0,0,0,0,0,0,0,0];
       var cur = 0;
       for (var i = 0; i < 9; i++)
       {
           if (!state[i])
           {
               // Storing the ids of all locations which are currently unrevealed
               ids[cur] = i;
               cur++;
           }
           else
           {
               // Checking which numbers are currently visible
               has[state[i]] = 1;
           }
       }
       cur = 0;
       // From the previous step, we know which numbers are not yet visible:
       //  these are the possible unknowns
       for (var i = 1; i < 10; i++)
       {
           if (!has[i])
           {
               unknowns[cur] = i;
               cur++;
           }
       }
       // Loop over all possible permutations on the unknowns
       do
       {
           for (var i = 0; i < 5; i++) {
               state[ids[i]] = unknowns[i];
           }
           // For each row, cumulatively sum the winnings for picking that row
           tot_win[0] += rewards[state[0] + state[1] + state[2]];
           tot_win[1] += rewards[state[3] + state[4] + state[5]];
           tot_win[2] += rewards[state[6] + state[7] + state[8]];
           tot_win[3] += rewards[state[0] + state[3] + state[6]];
           tot_win[4] += rewards[state[1] + state[4] + state[7]];
           tot_win[5] += rewards[state[2] + state[5] + state[8]];
           tot_win[6] += rewards[state[0] + state[4] + state[8]];
           tot_win[7] += rewards[state[2] + state[4] + state[6]];
       } while (this.next_permutation(unknowns));
       // Find the maximum. Start by assuming row 0 is best.
       var curmax = tot_win[0];
       row[0] = true;
       for (var i = 1; i < 8; i++)
       {
           // If another row yielded a higher expected value:
           if (tot_win[i] > curmax)
           {
               // Mark all the previous rows as FALSE (not optimal) and the current one as TRUE
               curmax = tot_win[i];
               for (var j = 0; j < i; j++)
                   row[j] = false;
               row[i] = true;
           }
           else if(tot_win[i] == curmax)
           {
               // For a tie, mark the current one as TRUE, and leave the previous ones intact
               row[i] = true;
           }
       }
       // The current totals are for 120 possible configurations.
       // Divide by 120 to get the actual expected value.
       return curmax / 120.0;
   },

   /* Solve for the best row choice when 3 tiles have been flipped.
   Returns the expected value of flipping that tile.

   state is an array of the current board state, e.g., 001050020
   0 means the tile is not flipped. 2 means the tile is showing a 2.

   rewards is an array of rewards for each sum.
   For example, rewards[6] = 10000;

   flip is an array of which tiles are the best choice to maximize expected value.
   It is passed into the function as an array of FALSE.
   The function changes the best choices to TRUE. Indices are as follows:
   0 = top left
   1 = top center
   2 = top right
   3 = middle left
   4 = direct center
   5 = middle right
   6 = bottom left
   7 = bottom middle
   8 = bottom right
   For example, if the function changes flip[5] to TRUE, that means the middle right tile
    is (potentially tied for) the best choice for maximizing expected value. */
   solve_3: function(state, rewards, flip)
   {
       var dummy_array = [];
       var unknowns = [];
       var ids = [];
       var has = [];
       var tot_win = [0,0,0,0,0,0];
       var cur = 0;
       for (var i = 0; i < 9; i++)
       {
           if (!state[i])
           {
               ids[cur] = i;
               cur++;
           }
           else
           {
               has[state[i]] = 1;
           }
       }
       cur = 0;
       for (var i = 1; i < 10; i++)
       {
           if (!has[i])
           {
               unknowns[cur] = i;
               cur++;
           }
       }
       // This is the only part that really differs from the previous function.
       // Loop over every unknown tile and every possible value that could appear.
       // Solve the resulting cases with solve_4.
       for (var i = 0; i < 6; i++)
       {
           for (var j = 0; j < 6; j++)
           {
               state[ids[i]] = unknowns[j];
               tot_win[i] += this.solve_4(state, rewards, dummy_array);
               for (var k = 0; k < 6; k++)
                   state[ids[k]] = 0;
           }
       }
       var curmax = tot_win[0];
       flip[ids[0]] = false;
       for (var i = 1; i < 6; i++)
       {
           if (tot_win[i] > curmax + EPS)
           {
               curmax = tot_win[i];
               for (var j = 0; j < i; j++)
                   flip[ids[j]] = false;
               flip[ids[i]] = true;
           }
           else if(tot_win[i] > curmax - EPS)
           {
               flip[ids[i]] = true;
           }
       }
       // Each tile can be flipped to reveal one of 6 values.
       // Divide by 6 to get the true expected value.
       return curmax / 6.0;
   },

   // Same as above, replace 3 with 2
   solve_2: function(state, rewards, flip)
   {
       var dummy_array = [];
       var unknowns = [];
       var ids = [];
       var has = [];
       var tot_win = [0,0,0,0,0,0,0];
       var cur = 0;
       for (var i = 0; i < 9; i++)
       {
           if (!state[i])
           {
               ids[cur] = i;
               cur++;
           }
           else
           {
               has[state[i]] = 1;
           }
       }
       cur = 0;
       for (var i = 1; i < 10; i++)
       {
           if (!has[i])
           {
               unknowns[cur] = i;
               cur++;
           }
       }
       for (var i = 0; i < 7; i++)
       {
           for (var j = 0; j < 7; j++)
           {
               state[ids[i]] = unknowns[j];
               tot_win[i] += this.solve_3(state, rewards, dummy_array);
               for (var k = 0; k < 7; k++)
                   state[ids[k]] = 0;
           }
       }
       var curmax = tot_win[0];
       flip[ids[0]] = true;
       for (var i = 1; i < 7; i++)
       {
           if (tot_win[i] > curmax + EPS)
           {
               curmax = tot_win[i];
               for (var j = 0; j < i; j++)
                   flip[ids[j]] = false;
               flip[ids[i]] = true;
           }
           else if(tot_win[i] > curmax - EPS)
           {
               flip[ids[i]] = true;
           }
       }
       return curmax / 7.0;
   },

   // Same as above, replace 2 with 1
   solve_1: function(state, rewards, flip)
   {
      var stateStr = state.join('');
      var newflip = this.openings[stateStr][1];
      for (var i = 0; i < flip.length; i++) {
         flip[i] = newflip[i];
      }
      return this.openings[stateStr][0];
      /*
       var dummy_array = [];
       var unknowns = [];
       var ids = [];
       var has = [];
       var tot_win = [0,0,0,0,0,0,0,0];
       var cur = 0;
       for (var i = 0; i < 9; i++)
       {
           if (!state[i])
           {
               ids[cur] = i;
               cur++;
           }
           else
           {
               has[state[i]] = 1;
           }
       }
       cur = 0;
       for (var i = 1; i < 10; i++)
       {
           if (!has[i])
           {
               unknowns[cur] = i;
               cur++;
           }
       }
       for (var i = 0; i < 8; i++)
       {
           for (var j = 0; j < 8; j++)
           {
               state[ids[i]] = unknowns[j];
               tot_win[i] += this.solve_2(state, rewards, dummy_array);
               for (var k = 0; k < 8; k++)
                   state[ids[k]] = 0;
           }
       }
       var curmax = tot_win[0];
       flip[ids[0]] = true;
       for (var i = 1; i < 8; i++)
       {
           if (tot_win[i] > curmax + EPS)
           {
               curmax = tot_win[i];
               for (var j = 0; j < i; j++)
                   flip[ids[j]] = false;
               flip[ids[i]] = true;
           }
           else if(tot_win[i] > curmax - EPS)
           {
               flip[ids[i]] = true;
           }
       }
       return curmax / 8.0;
       */
   },

   main: function(input)
   {
       // List of rewards for each sum
       var rewards = [0, 0, 0, 0, 0, 0, 10000, 36, 720, 360, 80, 252, 108, 72, 54, 180, 72, 180, 119, 36, 306, 1080, 144, 1800, 3600];

       var state = [];
       if (typeof(input) == 'string') {
         for (var i = 0; i < input.length; i++) {
            state[i] = parseInt(input.charAt(i));
         }
       } else if (typeof(input) == 'object') {
         state = input;
       } else {
         // A sample state. This one is 003000000
         // This means we have only flipped one tile, the top right tile, to reveal a 3.
         state[2] = 3;
       }

       // Count how many are visible
       var num_revealed = 0;
       for (var i = 0; i < 9; i++)
       {
           if (state[i] > 0)
               num_revealed++;
       }

       // If four are visible, we are picking between eight rows. Otherwise, we are picking
       // between nine tiles (although we'll never be picking revealed tiles)
       var num_options = 9;
       if (num_revealed == 4)
           num_options = 8;

       // Run the appropriate function to solve for the optimnal choice
       var which_to_flip = [];
       for (var i = 0; i < num_options; i++)
           which_to_flip[i] = false;
       var message = "Expected winnings with optimal play: ";
       switch (num_revealed)
       {
       case 1:
           message += this.solve_1 (state, rewards, which_to_flip);
           break;
       case 2:
           message += this.solve_2 (state, rewards, which_to_flip);
           break;
       case 3:
           message += this.solve_3 (state, rewards, which_to_flip);
           break;
       case 4:
           message += this.solve_4 (state, rewards, which_to_flip);
           break;
       }
       console.log(message + " MGP");

       // Output which choices are optimal
       if (num_revealed < 4)
           message = "Tiles to flip: ";
       else
           message = "Rows to choose: ";
       for (var i = 0; i < num_options; i++)
       {
           if (which_to_flip[i]) {
               message += i + " ";
           }
       }
       console.log(message);
       console.log("Program finished.");
   },

   test: function(input)
   {
       // List of rewards for each sum
       var rewards = [0, 0, 0, 0, 0, 0, 10000, 36, 720, 360, 80, 252, 108, 72, 54, 180, 72, 180, 119, 36, 306, 1080, 144, 1800, 3600];

       var state = [];

       // Run the appropriate function to solve for the optimnal choice
       var openings = {};
       for (var i = 0; i < 9; i++) {
         for (var j = 1; j <= 9; j++) {
       var which_to_flip = [];
            var which_to_flip = [false,false,false,false,false,false,false,false,false];
            state = [0,0,0,0,0,0,0,0,0];
            state[i] = j;
            var value = this.solve_1 (state, rewards, which_to_flip);
            openings[state.join('')] = [value, which_to_flip];
         }
       }
       console.log('var openings = ' + JSON.stringify(openings));

       console.log("Program finished.");
   },


   next_permutation: function(array)
   {
      var begin = 0;
      var end = array.length;
      if (begin == end) return false;

      var i = begin;
      ++i;
      if (i == end) return false;

      i = end;
      --i;

      while (true)
      {
         var j = i;
         --i;

         if (array[i] < array[j])
         {
            var k = end;

            while (!(array[i] < array[--k])) {
               /* pass */;
            }

            this.swap(array, i, k);
            this.reverse(array, j, end);
            return true;
         }

         if (i == begin)
         {
            this.reverse(array, begin, end);
            return false;
         }
      }
   },

   reverse: function(array, begin, end) {
      var howmany = end - begin;
      var revSlice = array.slice(begin, end).reverse();
      for (var i = 0; i < revSlice.length; i++) {
         array.splice(begin + i, 1, revSlice[i]);
      }
   },

   swap: function(array, i, j) {
      var tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
   }

};