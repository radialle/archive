import re
import serial
from .commandthread import CommandThread

class Controller(object):

    _DEFAULT_TIMEOUT     = 10
    _DEFAULT_MAX_RETRIES = 3
    _DEFAULT_ENCODING    = 'utf-8'

    _CMD_GET_VERSION  = 'v\n'
    _CMD_TRANSITION   = 't'

    TRANSITION_SPEED_NONE   = 0
    TRANSITION_SPEED_FAST   = 1
    TRANSITION_SPEED_NORMAL = 2
    TRANSITION_SPEED_SLOW   = 3

    VALID_TRANSITION_COLORS = [
        'none',
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'indigo',
        'violet',
        'white'
        ]

    RETURN_STATUS_SUCCESS   = 0
    RETURN_STATUS_DONE      = 1
    RETURN_STATUS_NOTFOUND  = 10
    RETURN_STATUS_UNKNOWN   = 255

    def write(self, str):
        """
        Writes a string to the serial connection with the display controller.
        """
        self._serial.write(str.encode(self._DEFAULT_ENCODING))

    def readline(self):
        """
        Reads a line from the serial connection with the display controller.
        """
        return self._serial.readline().decode(self._DEFAULT_ENCODING)

    def _check_version(self):
        """
        Attempts to retrieve version information from the LDCF and checks if
        it is running a compatible firmware version.
        """

        retries = 0

        # Queries the version string from the display controller
        self.write(self._CMD_GET_VERSION)
        reply = self.readline()

        # If the reply is an invalid version string, retry
        while not re.match(r'0 "LDCF-1.0.([0-9]+)"\n', reply):
            retries += 1
            self.logger.warn(
                ('Checking display controller firmware version, try {} of {}:'
                 ' unexpected ID string "{}"').format(
                    retries, self.max_retries, reply
                 )
                )
            if (retries >= self.max_retries):
                return False
            self.write(self._CMD_GET_VERSION)
            reply = self.readline()

        self.logger.info(('Received a valid ID string from the display '
                          'controller'))

        return True

    def __init__(self, device, baudrate, logger, **kwargs):
        """
        Controller class initializer.
        """

        self._commandthread = None
        self._serial = serial.Serial(
            device, baudrate, timeout=kwargs.get(
                    'timeout',
                    self._DEFAULT_TIMEOUT
                )
            )
        self.logger = logger
        self.max_retries = kwargs.get(
            'max_retries', self._DEFAULT_MAX_RETRIES
        )

        if not self._check_version():
           raise ValueError(('cannot establish communications with the '
                             'display controller'))

    def transition(self, speed, color, callback=None):
        """
        Starts a transition between colors on the display (lower level than
        the one present on the Display class, does not perform any checks).
        """

        self.logger.info(('Received request for transition to color {} with '
                          'speed {}').format(color, speed))

        command = 't{} {}\n'.format(str(speed), color)
        wait_done = speed is not self.TRANSITION_SPEED_NONE
        self._commandthread = CommandThread(
            self, command, callback=callback, wait_done=wait_done
            )
        self._commandthread.start()
