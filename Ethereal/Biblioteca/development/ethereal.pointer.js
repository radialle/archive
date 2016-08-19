/** RAPIDLIGHT - ETHEREAL
 *  ethereal.pointer.js
 *
 *  Author: Rodrigo Menezes
 *          rodrigo@rapidlight.io
 */

/**
 * Support class for EtherealPointerTransitFunction.
 *
 * @private
 * @class EtherealPointerTransitFunctionParams
 * @constructor
 */
var EtherealPointerTransitFunctionParams = function() {}

/**
 * Speed at which the pointer moves around the ring.
 *
 * @private
 * @property speed
 * @type Integer
 * @default 0
 */
EtherealPointerTransitFunctionParams.prototype.speed = 0;

/**
 * Two pointers with different 'iv's will be in different positions even if the speed of both is the same.
 *
 * @private
 * @property iv
 * @type Integer
 * @default PI/2
 */
EtherealPointerTransitFunctionParams.prototype.iv = Math.PI/2;

/**
 * Support class for EtherealPointer.
 *
 * @private
 * @class EtherealPointerTransitFunction
 * @constructor
 */
var EtherealPointerTransitFunction = function() {
	this.p = new EtherealPointerTransitFunctionParams();
}

/**
 * @private
 * @method f
 * @param {Integer} x
 * @return {Integer} A number between 0 and 360, calculated in function of the 'x' parameter
 */
EtherealPointerTransitFunction.prototype.f = function(x) {
	var speed = this.p.speed;
	var iv = this.p.iv;
	var eq;

	x = x + (Math.PI/2);

	if (speed == 0) {
		eq = x + iv;
	}
	else if (speed < 0) {
		eq = (x / -(speed)) + iv;
	}
	else {
		eq = (x * speed) + iv;
	}

	var a = Math.sin(eq);
	var b = Math.cos(eq);
	var r = Math.atan(a/b) * 2 + Math.PI;

	return Math.round(EtherealMath.radiansToDegrees(r));
}

/**
 * Support class for Ethereal that represents a pointer.
 *
 * @class EtherealPointer
 * @constructor
 * @param {String} name A name to associate with the pointer represented by the object
 */
var EtherealPointer = function(name) {
	this.transitFunction = new EtherealPointerTransitFunction();
	this.setName(name);
}

/**
 * Changes the default transit function parameters for the pointer represented by the
 * object.
 *
 * - speed (default is 0): changing this parameter affects the speed of the pointer.
 * - iv (default is PI/2): changing this parameter affects the pointer position. Useful for placing two pointers
 *   with the same 'speed' in different positions.
 *
 * @method setDefaultTransitFunctionParameters
 * @param {String} name 'speed' or 'iv'
 * @param {String} val Value to associate with the specified parameter
 */
EtherealPointer.prototype.setDefaultTransitFunctionParameters = function(name, val) {
	this.transitFunction.p[name] = val;
}

/**
 * Associates a custom transit function with the pointer represented by the object.
 * The custom transit function should always return a value between 0 and 360.
 *
 * @method setTransitFunction
 * @param {Function} f Custom transit function
 */
EtherealPointer.prototype.setTransitFunction = function(f) {
	this.transitFunction.f = f;
}

/**
 * Associates a name with the EtherealPointer object.
 *
 * @method setName
 * @param {String} name
 */
EtherealPointer.prototype.setName = function(name) {
	this.name = name;
}

/**
 * Returns the name associated with the EtherealPointer object.
 *
 * @method getName
 * @return {String} Name associated with the object
 */
EtherealPointer.prototype.getName = function() {
	return this.name;
}


/**
 * A collection of EtherealPointer objects.
 *
 * @class EtherealPointerCollection
 * @constructor
 * @param {EtherealPointer or Array of EtherealPointer objects} pointer 
 */
var EtherealPointerCollection = function(pointer) {
	if (Object.prototype.toString.call(pointer) == '[object Array]') {
		for (var i in pointer) {
			this.add(pointer[i]);
		}
	}
	else {
		this.add(pointer);
	}
}

/**
 * @private
 * @property {Array} pointers
 */
EtherealPointerCollection.prototype.pointers = [];

/**
 * Returns all EtherealPointer objects in the collection.
 *
 * @method getAll
 * @return {Array} Array of EtherealPointer objects
 */
EtherealPointerCollection.prototype.getAll = function() {
	return this.pointers;
}

/**
 * Returns the number of EtherealPointer objects in the collection.
 *
 * @method getLength
 * @return {Integer} Number of EtherealPointer objects in the collection
 */
EtherealPointerCollection.prototype.getLength = function() {
	return this.getAll().length;
}

/**
 * Returns the EtherealPointer object associated with an index in the collection.
 *
 * @method get
 * @param {Integer} i Index
 * @return {EtherealPointer} An EtherealPointer object
 */
EtherealPointerCollection.prototype.get = function(i) {
	return this.getAll()[i];
}

/**
 * Returns a EtherealPointer object in the collection by it's associated name.
 *
 * @method getByName
 * @param {String} name Name associated with an EtherealPointer object in the collection
 * @return {EtherealPointer} An EtherealPointer object
 */
EtherealPointerCollection.prototype.getByName = function(name) {
	var pointers = this.getAll();
	for (var i in pointers) {
		if (pointers[i].getName() == name) {
			return pointers[i];
		}
	}
	return undefined;
}

/**
 * Adds an EtherealPointer object to the collection.
 *
 * @method add
 * @param {EtherealPointer} pointer
 */
EtherealPointerCollection.prototype.add = function(pointer) {
	this.pointers.push(pointer);
}