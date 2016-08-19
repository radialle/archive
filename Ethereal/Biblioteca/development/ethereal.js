/** RAPIDLIGHT - ETHEREAL
 *  ethereal.js
 *
 *  Author: Rodrigo Menezes
 *          rodrigo@rapidlight.io
 */

/**
 * Ethereal's main class.
 *
 * @class Ethereal
 * @constructor
 */
var Ethereal = function() {}

/**
 * Associates a Moment object with the Ethereal object.
 *
 * @method setTime
 * @param {Moment} moment A Moment object
 */
Ethereal.prototype.setTime = function(moment) {
	this.time = moment;
}

/**
 * Returns the Moment object associated with the Ethereal object.
 *
 * @method getTime
 * @return {Moment} A Moment object
 */
Ethereal.prototype.getTime = function() {
	return this.time;
}

/**
 * Creates a Moment object using random time and date values, then
 * calls setTime passing it as the parameter.
 *
 * Note: the year of the generated object will always be between
 * the current year and 90 years ago. If the current year is 2015,
 * the generated year will be between 1925 and 2015.
 *
 * @method generateTime
 * @return {Moment} Generated Moment object
 */
Ethereal.prototype.generateTime = function() {
	var now = new moment();
	var maxYear = now.get('year');
	var minYear = maxYear - 90;
	var year = EtherealMath.generateInt(minYear, maxYear);
	var month = EtherealMath.generateInt(0, 11);
	
	now.year(year).month(month).subtract(
			EtherealMath.generateInt(0,31),
			'days'
		).subtract(
			EtherealMath.generateInt(0,24),
			'hours'
		).subtract(
			EtherealMath.generateInt(0,60),
			'minutes'
		);

	this.setTime(now);

	return now;
}

/**
 * Associates an EtherealLocation object with the Ethereal object.
 *
 * @method setLocation
 * @param {EtherealLocation} location An EtherealLocation object
 */
Ethereal.prototype.setLocation = function(location) {
	this.location = location;
}

/**
 * Returns the EtherealLocation object associated with the Ethereal object.
 *
 * @method getLocation
 * @return {EtherealLocation} An EtherealLocation object
 */
Ethereal.prototype.getLocation = function() {
	return this.location;
}

/**
 * Creates an EtherealLocation object using random latitude and longitude values, then
 * calls setLocation passing it as the parameter.
 *
 * @method generateLocation
 * @return {EtherealLocation} Generated EtherealLocation object
 */
Ethereal.prototype.generateLocation = function() {
	var location = new EtherealLocation();
	location.setDecimalLatitude(
		EtherealMath.generateFloat(-90, 90)
	);
	location.setDecimalLongitude(
		EtherealMath.generateFloat(-180,180)
	);
	this.setLocation(location);
	return location;
}

/**
 *  Associates an EtherealSignCollection with the Ethereal object.
 *
 * @method setSignCollection
 * @param {EtherealSignCollection} collection An EtherealSignCollection object
 */
Ethereal.prototype.setSignCollection = function(collection) {
	this.signCollection = collection;
}

/**
 * Returns the EtherealSignCollection associated with the Ethereal object.
 *
 * @method getSignCollection
 * @return {EtherealSignCollection} An EtherealSignCollection object
 */
Ethereal.prototype.getSignCollection = function() {
	return this.signCollection;
}

/**
 * Associates an EtherealPointerCollection with the Ethereal object.
 *
 * @method setPointerCollection
 * @param {EtherealPointerCollection} collection An EtherealPointerCollection object
 */
Ethereal.prototype.setPointerCollection = function(collection) {
	this.pointerCollection = collection;
}

/**
 * Returns the EtherealPointerCollection associated with the Ethereal object.
 *
 * @method getPointerCollection
 * @return {EtherealPointerCollection} An EtherealPointerCollection object
 */
Ethereal.prototype.getPointerCollection = function() {
	return this.pointerCollection;
}

/**
 * Generates output based on the information associated with the Ethereal object.
 *
 * @method generate
 * @return {Object} Object containing the generated information on the ascendant
 * and pointers
 */
Ethereal.prototype.generate = function() {
	var time = this.getTime();
	var asc = this.getAscendant(time);
	var pointerPositions = this.getPointerPositions(time, asc.degrees);

	return {
		'ascendant': asc,
		'pointers': pointerPositions
	}
}

/** PRIVATE APIs
 *  The following methods are NOT meant to be called directly by Ethereal users.
 */

/**
 * Provides the difference, in days, between November 22, 1997 at 6:00 AM and the time and date values
 * passed, in the form of a Moment object, through the 'time' parameter.
 * 
 * @private
 * @method getAmanDay
 * @param {Moment} time
 * @return {Float} Difference in days
 */
Ethereal.prototype.getAmanDay = function(time) {
	var zero = new moment({ 'date': 22, 'month': 10, 'year': 1997, 'hour': 6 });

	var ad = moment.duration(time.diff(zero)).asDays();

	return ad;
}

/**
 * Returns the position of each sign's limits.
 * 
 * @private
 * @method getSignLimits
 * @return {Array} Array containing limits of the signs
 */
Ethereal.prototype.getSignLimits = function() {
	var signCollection = this.getSignCollection();
	var collectionLen = signCollection.getLength();
	var size = 360 / collectionLen;
	var limits = [];

	for (var i = 0; i <= collectionLen; i++)
		limits.push(i * size);

	return limits;
}

/**
 * Returns the position of each sign's limits updated according to the ascendant's position.
 * 
 * @private
 * @method getUpdatedSignLimits
 * @param {Float} ascendant Ascendant position in degrees
 * @return {Array} Array containing updated limits of the signs
 */
Ethereal.prototype.getUpdatedSignLimits = function(ascendant) {
	var updatedLimits = this.getSignLimits();

	for (var i in updatedLimits) {
		updatedLimits[i] += ascendant;
		if (updatedLimits[i] > 360) {
			updatedLimits[i] -= 360;
		}
	}

	return updatedLimits;
}

/**
 * Returns the sign that a pointer is pointing to, according to it's position.
 * 
 * @private
 * @method getPointerPositionSign
 * @param {Float} position Position, in degrees, of pointer
 * @param {Array} limits Array containing limits of the signs
 * @return {EtherealSign} An EtherealSign object
 */
Ethereal.prototype.getPointerPositionSign = function(position, limits) {
	var signCollection = this.getSignCollection();
	var collectionLen = signCollection.getLength();

	var fl;
	var sl;
	for (var i = 0; i < collectionLen; i++) {

		fl = limits[i];
		sl = limits[i+1];

		if (sl < fl) {
			if ((position > fl && position < 360) ||
				(position > 0 && position < sl) ||
				position == 0 || position == 360)
				return signCollection.get(i);
		}

		if (position > fl && position < sl) {
			return signCollection.get(i);
		}
	}
}

/**
 * Returns position and sign for each pointer in the EtherealPointerCollection associated
 * with the Ethereal object.
 *
 * @private
 * @method getPointerPositions
 * @param {Moment} time
 * @param {Float} ascendant
 * @return {Object} Object containing positions of the pointers and the sign each
 * pointer is pointing to
 */
Ethereal.prototype.getPointerPositions = function(time, ascendant) {
	var signCollection = this.getSignCollection();
	var julianDay = this.getAmanDay(time);
	var pointers = this.getPointerCollection().getAll();
	var position;
	var ret = {};
	for (var i in pointers) {
		position = pointers[i].transitFunction.f(julianDay);
		ret[pointers[i].getName()] = {
			'degrees': position,
			'sign': this.getPointerPositionSign(position, this.getUpdatedSignLimits(ascendant))
		};
	}
	return ret;
}

/**
 * Returns ascendant position according to the time parameter.
 *
 * @private
 * @method getAscendant
 * @param {Moment} time
 * @return {Object} Object containing ascendant's position in degrees and the
 * sign as an EtherealSign object
 */
Ethereal.prototype.getAscendant = function(time) {
	var speed = 0;
	var iv = Math.PI / 2;
	var x = this.getAmanDay(time);
	var eq;

	if (speed == 0) {
		eq = x + iv;
	}
	else if (speed < 0) {
		eq = (x / -(speed)) + iv;
	}
	else {
		eq = (x * speed) + iv;
	}

	var a = Math.sin(eq+this.getLocation().getDecimalLatitude());
	var b = Math.cos(eq+this.getLocation().getDecimalLongitude());
	var r = Math.atan(a/b) * 2 + Math.PI;

	var degrees = EtherealMath.radiansToDegrees(r);

	return {
		'degrees': degrees,
		'sign': this.getPointerPositionSign(degrees, this.getSignLimits())
	};
}
