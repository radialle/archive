/*
 * LumenDisplay.cpp
 *
 * This software is part of the RapidLight Sensum project. More details can be
 * found at https://rapidlight.io/sensum/.
 */

#include "LumenDisplay.h"

/*** Public methods ***/

/* Constructor. */
LumenDisplay::LumenDisplay() {
    FastLED.addLeds<NEOPIXEL, this->LED_PIN>(this->led, this->LED_COUNT);
    this->set_color(CRGB::Black);
    this->transition_reset();
}

/* Updates the entire led array with the color defined in the input argument. */
void LumenDisplay::set_color(CRGB color) {
    fill_solid(this->led, this->LED_COUNT, color);
    this->show();
}

/* Prepares a transition from the current color to another. */
void LumenDisplay::transition_setup(CRGB color, uint8_t ease) {
    this->t_color_f = this->led[0];
    this->t_color_s = color;
    this->t_ease = ease;
    this->t_step = 0;
}

/*
 * Performs a part of the previously set up transition each time it is called.
 * Returns true when the transition has been completed, false otherwise.
 */
bool LumenDisplay::transition_loop() {
    CRGB color = this->t_color_f.lerp8(this->t_color_s, ease(this->t_step));
    this->set_color(color);
    if (this->t_step == 255) { return true; }
    this->t_step++;
    return false;
}

/* Sets default values to properties associated to transitions. */
void LumenDisplay::transition_reset() {
    this->t_color_f = CRGB::Black;
    this->t_color_s = CRGB::Black;
    this->t_ease = this->EASE_LINEAR;
    this->t_step = 255;
}

/*** Private methods ***/

/* Handles easing. Called from transition_loop(). */
uint8_t LumenDisplay::ease(uint8_t x) {
    double yd;
    double xd = this->map(x, 0, 255, 0, 1);
    switch(this->t_ease) {
        case this->EASE_IN_OUT:
        yd = this->ease_in_out(xd);
        break;
        default:
        yd = this->ease_linear(xd);
    };
    return (uint8_t) round(this->map(yd, 0, 1, 0, 255));
}

/* Easing function linear. Simply returns the input value. */
double LumenDisplay::ease_linear(double xd) {
    return xd;
}

/*
 * Easing function in-out. Slows down the beginning and the end of the
 * transition.
 */
double LumenDisplay::ease_in_out(double xd) {
    double xdsq = sq(xd);
    return xdsq / (2.0 * (xdsq - xd) + 1.0);
}

/*
 * Re-maps a number from one range to another. Works with doubles, unlike the
 * map function from the Arduino core library.
 */
double LumenDisplay::map(double v, double a1, double a2, double b1, double b2) {
    return (v - a1) / (a2 - a1) * (b2 - b1) + b1;
}

/* Update all the LEDs with the color values in the led array. */
void LumenDisplay::show() {
    FastLED.show();
}