/*
 * ldcf.ino
 * 
 * LDCF - Lumen Display Controller Firmware
 * Ver. 1.0.0
 * 
 * This software is part of the RapidLight Sensum project. More details can be
 * found at https://rapidlight.io/sensum/.
 */

#include <FastLED.h>
#include <SoftwareSerial.h>
#include "src/lib/LumenDisplay.h"

// Parameters for serial communication
#define SERIAL_BAUDRATE   9600
#define SERIAL_RX_PIN     0
#define SERIAL_TX_PIN     1

// Size of the command buffer
#define CMD_BUFFER_SIZE   18

// Command codes
#define CMD_CODE_NONE     0
#define CMD_CODE_C_RED    10
#define CMD_CODE_C_ORANGE 11
#define CMD_CODE_C_YELLOW 12
#define CMD_CODE_C_GREEN  13
#define CMD_CODE_C_BLUE   14
#define CMD_CODE_C_INDIGO 15
#define CMD_CODE_C_VIOLET 16
#define CMD_CODE_C_WHITE  17

// Return status codes
#define STATUS_OK         0
#define STATUS_DONE       1
#define STATUS_NOTFOUND   10
#define STATUS_UNKNOWN    255

// The firmware's ID string
static const char ID_STRING[] = "LDCF-1.0.0";

// The command buffer
char    cmd_buffer[CMD_BUFFER_SIZE] = { 0 };
// For identifying the last byte of data in the buffer
uint8_t cmd_buffer_i = 0;

// Variables used for executing the commands
uint8_t cmd_current_code = CMD_CODE_NONE;
uint8_t cmd_current_step = 0;
uint8_t cmd_transit_modf = 0;
bool    cmd_current_updt = false;
bool    cmd_current_done = true;

SoftwareSerial serial(SERIAL_RX_PIN, SERIAL_TX_PIN);
LumenDisplay *display;

/* Prints return codes and data to serial. */
void print_status(uint8_t s, const char *data) {
  switch(s) {
    case STATUS_OK:
    serial.print("0");
    break;
    case STATUS_DONE:
    serial.print("1");
    break;
    case STATUS_NOTFOUND:
    serial.print("10");
    break;
    default:
    serial.print("255");
    break;
  }
  if (data != NULL) {
    serial.print(" \"");
    serial.print(data);
    serial.print("\"");
  }
  serial.print('\n');
}

/* Executes commands after they have been parsed by cmd_parse. */
void cmd_exec_loop() {
  if (cmd_current_done && !cmd_current_updt) {
    return;
  }
  else if (cmd_current_updt) {
    cmd_current_step = 0;
    cmd_current_done = false;
    cmd_current_updt = false;
  }
  CRGB color;
  uint8_t delay_;
  switch(cmd_transit_modf) {
    case 1:
    delay_ = 5;
    break;
    case 2:
    delay_ = 10;
    break;
    case 3:
    delay_ = 15;
    break;
    default:
    delay_ = 0;
    break;
  }
  switch(cmd_current_code) {
    case CMD_CODE_NONE:
    color = CRGB::Black;
    break;
    case CMD_CODE_C_RED:
    color = CRGB::Red;
    break;
    case CMD_CODE_C_ORANGE:
    color = CRGB::Orange;
    break;
    case CMD_CODE_C_YELLOW:
    color = CRGB::Yellow;
    break;
    case CMD_CODE_C_GREEN:
    color = CRGB::Green;
    break;
    case CMD_CODE_C_BLUE:
    color = CRGB::Blue;
    break;
    case CMD_CODE_C_INDIGO:
    color = CRGB::Indigo;
    break;
    case CMD_CODE_C_VIOLET:
    color = CRGB::Violet;
    break;
    case CMD_CODE_C_WHITE:
    color = CRGB::White;
    break;
  }
  if (delay_ == 0) {
    display->set_color(color);
    cmd_current_done = true;
    return;
  }
  if (cmd_current_step == 0) {
    display->transition_setup(color, display->EASE_IN_OUT);
    cmd_current_step++;
  }
  if (display->transition_loop()) {
    cmd_current_done = true;
    print_status(STATUS_DONE, NULL);
    return;
  }
  delay(delay_);
}

/* Returns true if str2 starts with str1, false otherwise. */
bool str_starts_with(const char *str1, const char *str2) {
  return strncmp(str1, str2, strlen(str1)) == 0;
}

/*
 * Parses the command contained in the address pointed to by cmd for execution.
 */
void cmd_parse(const char *cmd) {
  if (strcmp("v", cmd) == 0) {
    print_status(STATUS_OK, ID_STRING);
    return;
  }
  
  if (str_starts_with("t0 ", cmd)) {
    cmd_transit_modf = 0;
  }
  else if (str_starts_with("t1 ", cmd)) {
    cmd_transit_modf = 1;
  }
  else if (str_starts_with("t2 ", cmd)) {
    cmd_transit_modf = 2;
  }
  else if (str_starts_with("t3 ", cmd)) {
    cmd_transit_modf = 3;
  }
  else {
    print_status(STATUS_NOTFOUND, NULL);
    return;
  }

  char *param = cmd+3;
  if (strcmp("none", param) == 0) {
    cmd_current_code = CMD_CODE_NONE;
  }
  else if (strcmp("red", param) == 0) {
    cmd_current_code = CMD_CODE_C_RED;
  }
  else if (strcmp("orange", param) == 0) {
    cmd_current_code = CMD_CODE_C_ORANGE;
  }
  else if (strcmp("yellow", param) == 0) {
    cmd_current_code = CMD_CODE_C_YELLOW;
  }
  else if (strcmp("green", param) == 0) {
    cmd_current_code = CMD_CODE_C_GREEN;
  }
  else if (strcmp("blue", param) == 0) {
    cmd_current_code = CMD_CODE_C_BLUE;
  }
  else if (strcmp("indigo", param) == 0) {
    cmd_current_code = CMD_CODE_C_INDIGO;
  }
  else if (strcmp("violet", param) == 0) {
    cmd_current_code = CMD_CODE_C_VIOLET;
  }
  else if (strcmp("white", param) == 0) {
    cmd_current_code = CMD_CODE_C_WHITE;
  }
  else {
    print_status(STATUS_NOTFOUND, NULL);
    return;
  }
  print_status(STATUS_OK, NULL);
  cmd_current_updt = true;
}

/*
 * Calls cmd_parse with the address of the cmd_buffer as a parameter, and cleans
 * the cmd_buffer after the command has been parsed.
 */
void cmd_buffer_flush() {
  cmd_parse(cmd_buffer);
  memset(cmd_buffer, 0, CMD_BUFFER_SIZE);
  cmd_buffer_i = 0;
}

/*
 * Adds a new char to the cmd_buffer if there is space available. Returns true
 * if the operation is successful, false otherwise.
 */
bool cmd_buffer_append(char val) {
  // Do not write past the end of the buffer and leave one null byte
  if (cmd_buffer_i >= (CMD_BUFFER_SIZE - 1)) {
    return false;
  }
  cmd_buffer[cmd_buffer_i] = val;
  cmd_buffer_i++;
  return true;
}

/*
 * Stores data read from serial and calls cmd_buffer_flush() when a newline is
 * found.
 */
void serial_loop() {
  if (!serial.available()) {
    return;
  }
  char val = serial.read();
  if (val == '\n') {
    cmd_buffer_flush();
    return;
  }
  cmd_buffer_append(val);
}

/* Sets up serial communication and creates a LumenDisplay object. */
void setup() {
  serial.begin(SERIAL_BAUDRATE);
  display = new LumenDisplay();
}

/* 
 *  serial_loop() reads and processes data from serial, and cmd_exec_loop()
 *  executes the commands.
 */
void loop() {
  serial_loop();
  cmd_exec_loop();
}
