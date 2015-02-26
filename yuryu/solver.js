/*

The MIT License (MIT)

Copyright (c) 2015 Yuryu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var Solver = function Solver() {
};

Solver.prototype.minNum = 1;
Solver.prototype.maxNum = 9;
Solver.prototype.size = 3;

Solver.prototype.placeNum = function placeNum(table, row, col) {
	if ( row >= this.size || col >= this.size ) {
		this.evaluate(table);
		return;
	}
	if ( table[row][col] > 0 ) {
		col++;
		if ( col >= this.size ) {
			col = 0;
			row++;
		}
		this.placeNum(table, row, col);
		return;
	}
	for ( var i = this.minNum; i <= this.maxNum; i++ ) {
		if ( this.nummap[i] ) continue;
		this.nummap[i] = true;
		table[row][col] = i;
		var nextcol = col + 1;
		var nextrow = row;
		if ( nextcol >= this.size ) {
			nextcol = 0;
			nextrow++;
		}
		this.placeNum(table, nextrow, nextcol);
		this.nummap[i] = false;
	}
	table[row][col] = 0;
};

Solver.prototype.evaluate = function evaluate(table) {
	// horizontal
	var rindex = 0;
	for ( var row = 0; row < this.size; row++ ) {
		var value = table[row].reduce(function(prev, cur, i, arr) {
			return prev + cur;
		});
		this.result[rindex++] += this.payout[value];
	}
	// vertical
	for ( var col = 0; col < this.size; col++ ) {
		var value = table.reduce(function(prev, cur, i, arr) {
			return prev + cur[col];
		}, 0);
		this.result[rindex++] += this.payout[value];
	}
	// diagnoal
	var d1 = 0;
	var d2 = 0;
	for ( var i = 0; i < this.size; i++ ) {
		d1 += table[i][i];
		d2 += table[i][this.size - i - 1];
	}
	this.result[rindex++] += this.payout[d1];
	this.result[rindex++] += this.payout[d2];
	this.count++;
};

Solver.prototype.solve = function solve(table, payout) {
	this.payout = payout;
	this.result = [];
	for ( var i = 0; i < this.size * 2 + 2; i++ ) {
		this.result[i] = 0;
	}
	this.nummap = {};
	for ( var i = this.minNum; i <= this.maxNum; i++ ) {
		this.nummap[i] = false;
	}
	for ( var i = 0; i < this.size; i++ ) {
		for ( var j = 0; j < this.size; j++ ) {
			if ( table[i][j] > 0 ) {
				this.nummap[table[i][j]] = true;
			}
		}
	}

	this.count = 0;
	this.placeNum(table, 0, 0);
	var count = this.count;
	return this.result.map(function(cur, i, arr) {
		return cur / count;
	});
};

