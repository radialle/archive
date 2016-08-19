/** RAPIDLIGHT - ETHEREAL
 *  ethereal.sign.js
 *
 *  Author: Rodrigo Menezes
 *          rodrigo@rapidlight.io
 */

/**
 * Support class for Ethereal that represents a sign.
 *
 * @class EtherealSign
 * @constructor
 * @param {String} name A name to associate with the sign represented by the object
 */
var EtherealSign = function(name) {
	this.setName(name);
};

/**
 * Associates a name with to the EtherealSign object.
 *
 * @method setName
 * @param {String} name
 */
EtherealSign.prototype.setName = function(name) {
	this.name = name;
}

/**
 * Returns the name associated with the EtherealSign object.
 *
 * @method getName
 * @return {String} Name associated with the EtherealSign object
 */
EtherealSign.prototype.getName = function() {
	return this.name;
}

/**
 * A collection of EtherealSign objects.
 *
 * @class EtherealSignCollection
 * @constructor
 */
var EtherealSignCollection = function() {
	this.signs = new Array();
}

/**
 * Returns all EtherealSign objects in the collection.
 *
 * @method getAll
 * @return {Array} Array of EtherealSign objects
 */
EtherealSignCollection.prototype.getAll = function() {
	return this.signs;
}

/**
 * Returns the number of EtherealSign objects in the collection.
 *
 * @method getLength
 * @return {Integer} Number of EtherealSign objects
 */
EtherealSignCollection.prototype.getLength = function() {
	return this.getAll().length;
}

/**
 * Returns an EtherealSign object in the collection by it's associated index.
 *
 * @method get
 * @param {Integer} i Index
 * @return {EtherealSign} An EtherealSign object
 */
EtherealSignCollection.prototype.get = function(i) {
	return this.getAll()[i];
}

/**
 * Returns an EtherealSign object in the collection by it's associated name.
 *
 * @method getByName
 * @param {String} name Name associated with an EtherealSign object in the collection
 * @return {EtherealSign} An EtherealSign object
 */
EtherealSignCollection.prototype.getByName = function(name) {
	var signs = this.getAll();
	for (var i in signs) {
		if (signs[i].getName() == name) {
			return signs[i];
		}
	}
	return undefined;
}

/**
 * Adds an EtherealSign object to the collection.
 *
 * @method add
 * @param {EtherealSign} sign
 */
EtherealSignCollection.prototype.add = function(sign) {
	this.signs.push(sign);
}

/**
 * Creates 12 EtherealSign objects and adds them to the collection.
 *
 * The created objects are associated with the following names:
 * - Crystal Orange
 * - Citrus Yellow
 * - Bright Yellow
 * - Emerald Green
 * - Glazed Green
 * - Moss Green
 * - Sapphire Blue
 * - Orchid Purple
 * - Amethyst Violet
 * - Jasmine Pink
 * - Sparkling Orange
 * - Citrus Orange
 *
 * @method createDefaultCollection
 */
EtherealSignCollection.prototype.createDefaultCollection = function() {
	var names = ["Crystal Orange", "Citrus Yellow", "Bright Yellow", "Emerald Green",
				 "Glazed Green", "Moss Green", "Sapphire Blue", "Orchid Purple", "Amethyst Violet",
				 "Jasmine Pink", "Sparkling Orange", "Citrus Orange"];
	var sign;
	for (var i in names) {
		sign = new EtherealSign();
		sign.setName(names[i]);
		this.add(sign);
	}
}