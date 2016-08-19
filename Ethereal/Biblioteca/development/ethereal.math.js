/** RAPIDLIGHT - ETHEREAL
 *  ethereal.math.js
 *
 *  Author: Rodrigo Menezes
 *          rodrigo@rapidlight.io
 */

/**
 * Static class. Contains math-related functions used by Ethereal.
 *
 * @class EtherealMath
 * @static
 */
var EtherealMath = {
	/**
 	 * Converts a value in degrees to radians.
 	 *
	 * @method degreesToRadians
 	 * @static
	 * @param {Float} deg
	 * @return {Float} Value in radians
 	 */
	degreesToRadians: function(deg) {
		return deg * (Math.PI / 180);
	},
	/**
 	 * Converts a value in radians to degrees.
 	 *
	 * @method radiansToDegrees
 	 * @static
	 * @param {Float} rad
	 * @return {Float} Value in degrees
 	 */
	radiansToDegrees: function(rad) {
		return rad * (180 / Math.PI);
	},
	/**
 	 * Generates a random float between 'min' and 'max'.
 	 *
	 * @method generateFloat
 	 * @static
	 * @param {Float} min
	 * @param {Float} max
	 * @return {Float} Number between 'min' and 'max'
 	 */
	generateFloat: function(min, max) {
		var num = Math.random() * (max - min) + min;
		return num;
	},
	/**
 	 * Generates a random integer between 'min' and 'max'.
 	 *
	 * @method generateInt
 	 * @static
	 * @param {Integer} min
	 * @param {Integer} max
	 * @return {Integer} Number between 'min' and 'max'
 	 */
	generateInt: function(min, max) {
		var num = this.generateFloat(min, max);
			num = Math.round(num);
		return num;
	}
};