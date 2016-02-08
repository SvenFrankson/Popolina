/*jslint node: true */

module.exports = {
    MapGenerator: function (seed) {
        "use strict";
        this.MINMAPDEGREE = 3;
        this.MAPSIZEDEGREE = 5;
        this.MAPSIZE = Math.pow(2, this.MAPSIZEDEGREE);
        this.MAXMAPDEGREE = 12;
        this.MAPHEIGHT = 1023;

        var setSeed = function (seed) {
                var i = 0, x = 0, randomNumbers = [];
                for (i = 0; i < 1000; i += 1) {
                    x = Math.sin(seed) * 10000;
                    seed = seed + 1;
                    randomNumbers[i] = x - Math.floor(x);
                }
                return randomNumbers;
            },
            terp = function (t, a, b, c, d) {
                return 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * t) * t) * t + b;
            },
            bicubicInterpolation = function (x, y, values) {
                var i0, i1, i2, i3;

                i0 = terp(x, values[0][0], values[1][0], values[2][0], values[3][0]);
                i1 = terp(x, values[0][1], values[1][1], values[2][1], values[3][1]);
                i2 = terp(x, values[0][2], values[1][2], values[2][2], values[3][2]);
                i3 = terp(x, values[0][3], values[1][3], values[2][3], values[3][3]);
                return terp(y, i0, i1, i2, i3);
            };

        this.randomNumbers = setSeed(seed);
        
        this.getRandom = function (i, j) {
            i = Math.abs(i);
            j = Math.abs(j);
            return this.randomNumbers[(i * i + (i * j) * j + i + j) % 1000];
        };

        this.getMapLowDegree = function (iPos, jPos, degree) {
            var step = Math.pow(2, degree),
                xPos = iPos * this.MAPSIZE,
                yPos = jPos * this.MAPSIZE,
                val,
                values = [],
                map = [],
                dx,
                dy,
                i,
                j,
                i0,
                j0,
                i1,
                j1;

            for (i1 = 0; i1 < 4; i1 += 1) {
                values[i1] = [];
            }
            for (i = 0; i < this.MAPSIZE; i += 1) {
                map[i] = [];
            }

            for (i = 0; i < this.MAPSIZE; i += step) {
                for (j = 0; j < this.MAPSIZE; j += step) {
                    for (i0 = 0; i0 < step; i0 += 1) {
                        for (j0 = 0; j0 < step; j0 += 1) {
                            for (i1 = 0; i1 < 4; i1 += 1) {
                                for (j1 = 0; j1 < 4; j1 += 1) {
                                    values[i1][j1] = this.getRandom(xPos + i + (i1 - 1) * step, yPos + j + (j1 - 1) * step);
                                }
                            }

                            dx = i0 / step;
                            dy = j0 / step;

                            val = bicubicInterpolation(dx, dy, values);
                            val = Math.min(1, val);
                            val = Math.max(0, val);

                            map[i + i0][j + j0] = val;
                        }
                    }
                }
            }
            return map;
        };

        this.getMapHighDegree = function (iPos, jPos, degree) {
            var step = Math.pow(2, degree),
                xPos = iPos * this.MAPSIZE,
                yPos = jPos * this.MAPSIZE,
                x0 = Math.abs(xPos) - (Math.abs(xPos) % step),
                y0 = Math.abs(yPos) - (Math.abs(yPos) % step),
                val,
                values = [],
                map = [],
                dx,
                dy,
                i,
                j;
            
            if (xPos < 0) {
                x0 = -x0 - step;
            }
            
            if (yPos < 0) {
                y0 = -y0 - step;
            }

            for (i = 0; i < 4; i += 1) {
                values[i] = [];
                for (j = 0; j < 4; j += 1) {
                    values[i][j] = this.getRandom(x0 + (i - 1) * step, y0 + (j - 1) * step);
                }
            }

            for (i = 0; i < this.MAPSIZE; i += 1) {
                map[i] = [];
                for (j = 0; j < this.MAPSIZE; j += 1) {
                    dx = (xPos + i - x0) / step;
                    dy = (yPos + j - y0) / step;

                    val = bicubicInterpolation(dx, dy, values);
                    val = Math.min(1, val);
                    val = Math.max(0, val);

                    map[i][j] = val;
                }
            }
            return map;
        };

        this.getMap = function (iPos, jPos) {
            var i = 0, j = 0, d = 0, map = [], maps = [];

            for (d = this.MINMAPDEGREE; d < this.MAPSIZEDEGREE; d += 1) {
                maps[d] = this.getMapLowDegree(iPos, jPos, d);
            }
            for (d = this.MAPSIZEDEGREE; d < this.MAXMAPDEGREE; d += 1) {
                maps[d] = this.getMapHighDegree(iPos, jPos, d);
            }

            for (i = 0; i < this.MAPSIZE; i += 1) {
                for (j = 0; j < this.MAPSIZE; j += 1) {
                    map[i + j * this.MAPSIZE] = 0;
                    for (d = this.MINMAPDEGREE; d < this.MAXMAPDEGREE; d += 1) {
                        map[i + j * this.MAPSIZE] += maps[d][i][j] / Math.pow(2, this.MAXMAPDEGREE - d) * this.MAPHEIGHT;
                    }
                    map[i + j * this.MAPSIZE] = Math.floor(map[i + j * this.MAPSIZE]);
                }
            }
            return map;
        };
    }
};