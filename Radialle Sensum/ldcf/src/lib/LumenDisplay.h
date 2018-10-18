/*
 * LumenDisplay.h
 *
 * This software is part of the RapidLight Sensum project. More details can be
 * found at https://rapidlight.io/sensum/.
 */

#ifndef LumenDisplay_h
#define LumenDisplay_h

#include <Arduino.h>
#include <FastLED.h>

class LumenDisplay {

public:
    static const uint8_t EASE_LINEAR = 10;
    static const uint8_t EASE_IN_OUT = 11;

    LumenDisplay();
    void     set_color(CRGB color);
    void     transition_setup(CRGB color, uint8_t ease);
    bool     transition_loop();
    void     transition_reset();

private:
    static const int LED_COUNT = 1; // must be greater than 0
    static const int LED_PIN   = 4;

    CRGB     t_color_f;
    CRGB     t_color_s;
    uint8_t  t_ease;
    uint8_t  t_step;

    CRGB     led[LED_COUNT];
    uint8_t  ease(uint8_t x);
    double   ease_linear(double x);
    double   ease_in_out(double x);
    double   map(double v, double a1, double a2, double b1, double b2);
    void     show();
};

#endif