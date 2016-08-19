/** RAPIDLIGHT - ETHEREAL
 *  ethereal.location.js
 *
 *  Author: Rodrigo Menezes
 *          rodrigo@rapidlight.io
 */

/**
 * Support class for Ethereal that stores latitude and longitude values.
 *
 * @class EtherealLocation
 * @constructor
 * @param {Float} lat Latitude value to associate with the object (decimal)
 * @param {Float} lon Longitude value to associate with the object (decimal)
 */
var EtherealLocation = function(lat, lon) {
	this.setDecimalLatitude(lat);
	this.setDecimalLongitude(lon);
}

/**
 * Associates latitude with the EtherealLocation object.
 *
 * @method setLatitude
 * @param {Integer} deg
 * @param {Integer} min
 * @param {Integer} sec
 */
EtherealLocation.prototype.setLatitude = function(deg, min, sec) {
	this.setDecimalLatitude(this.DMSToDecimal(deg, min, sec));
}

/**
 * Associates longitude with the EtherealLocation object.
 *
 * @method setLongitude
 * @param {Integer} deg
 * @param {Integer} min
 * @param {Integer} sec
 */
EtherealLocation.prototype.setLongitude = function(deg, min, sec) {
	this.setDecimalLongitude(this.DMSToDecimal(deg, min, sec));
}

/**
 * Associates latitude with the EtherealLocation object (decimal).
 *
 * @method setDecimalLatitude
 * @param {Float} latitude
 */
EtherealLocation.prototype.setDecimalLatitude = function(latitude) {
	this.latitude = latitude;
}

/**
 * Associates longitude with the EtherealLocation object (decimal).
 *
 * @method setDecimalLongitude
 * @param {Float} longitude
 */
EtherealLocation.prototype.setDecimalLongitude = function(longitude) {
	this.longitude = longitude;
}

/**
 * Converts degrees, minutes and seconds to decimal value.
 *
 * @method DMSToDecimal
 * @param {Integer} deg Degrees
 * @param {Integer} min Minutes
 * @param {Integer} sec Seconds
 * @return {Float} Decimal value
 */
EtherealLocation.prototype.DMSToDecimal = function(deg, min, sec) {
	return deg + (min / 60) + (sec / 3600);
}

/**
 * Converts a decimal value to degrees, minutes and seconds.
 *
 * @method decimalToDMS
 * @param {Float} dec Decimal value
 * @return {Array} Array containing degrees, minutes and seconds ([deg, min, sec])
 */
EtherealLocation.prototype.decimalToDMS = function(dec) {
	var deg = Math.floor(dec);
	var min = Math.floor((dec - deg) * 60);
	var sec = Math.round((dec - deg - (min/60)) * 3600);
	return [deg, min, sec];
}

/**
 * Returns the latitude associated with the EtherealLocation object.
 *
 * @method getLatitude
 * @return {Array} Array containing degrees, minutes and seconds ([deg, min, sec])
 */
EtherealLocation.prototype.getLatitude = function() {
	return this.decimalToDMS(this.getDecimalLatitude());
}

/**
 * Returns the longitude associated with the EtherealLocation object.
 *
 * @method getLongitude
 * @return {Array} Array containing degrees, minutes and seconds ([deg, min, sec])
 */
EtherealLocation.prototype.getLongitude = function() {
	return this.decimalToDMS(this.getDecimalLongitude());
}

/**
 * Returns the latitude associated with the EtherealLocation object (decimal).
 *
 * @method getDecimalLatitude
 * @return {Float} Latitude (decimal)
 */
EtherealLocation.prototype.getDecimalLatitude = function() {
	return this.latitude;
}

/**
 * Returns the longitude associated with the EtherealLocation object (decimal).
 *
 * @method getDecimalLongitude
 * @return {Float} Longitude (decimal)
 */
EtherealLocation.prototype.getDecimalLongitude = function() {
	return this.longitude;
}