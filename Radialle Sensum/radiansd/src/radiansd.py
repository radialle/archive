import sys
import logging
import logging.handlers
import config.parser
import dbusinterface.display
import display.controller
import pydbus
from gi.repository import GLib, GObject

DAEMON_NAME = 'radiansd'
DAEMON_VERS = '1.0.0'

BUS_NAME = 'io.rapidlight.sensum.Display'

def version():
    """
    Returns the daemon name and version as a string.
    """
    return '{} {}'.format(DAEMON_NAME, DAEMON_VERS)

def get_logger(level = logging.DEBUG, stdout = False):
    """
    Sets up and returns a Logger object.
    """

    addr = '/dev/log'
    facl = logging.handlers.SysLogHandler.LOG_DAEMON
    msgf = DAEMON_NAME + '[%(process)d]: %(message)s'

    # Gets the appropriate handler for writing to /dev/log or to stdout,
    # depending on the value of the 'stdout' parameter
    if stdout:
        handler = logging.StreamHandler(sys.stdout)
    else:
        handler = logging.handlers.SysLogHandler(addr, facl)

    handler.setFormatter(logging.Formatter(msgf))

    logger = logging.getLogger(DAEMON_NAME)
    logger.setLevel(level)
    logger.addHandler(handler)

    return logger

def get_config(path, logger):
    """
    Reads parameters from the configuration file.
    """

    # Create a new dictionary to be populated with the parameters
    ret = {}

    # Contains valid configuration parameter names and types
    valid_params = {
        'device': 'str',
        'baud rate': 'unsigned int'
    }

    # List of required configuration parameters
    required_params = ['device', 'baud rate']

    # Parses the configuration file
    params = config.parser.parse(path)

    # Validates the parameters on the configuration file and adds them to the
    # ret variable
    for name, val in params.items():
        if name not in valid_params:
            logger.warning(
                'Ignoring unkown configuration parameter: "{}"'.format(name)
                )
            continue
        if valid_params[name] == 'int':
            val = int(val)
        elif valid_params[name] == 'unsigned int':
            val = int(val)
            if (val < 0):
                raise ValueError(
                    'parameter "{}" value must be a positive integer'
                    .format(name)
                    )
        ret[name] = val
    for name in required_params:
        if name not in params:
            raise ValueError(
                'missing required parameter "{}" in configuration file'
                .format(name)
                )

    return ret

def main(args, logger, context = None):
    """
    The daemon's main function. Reads configuration parameters, establishes
    communications with the display controller and publishes the daemon's
    D-Bus interface.
    """

    # Get configuration parameters
    params = get_config(args.config, logger)

    # Get a display controller object
    c = display.controller.Controller(
        params['device'], params['baud rate'], logger
    )

    # Set display color to 'none'
    c.transition(c.TRANSITION_SPEED_NONE, 'none')

    # Publish the D-Bus interface
    bus = pydbus.SystemBus()
    loop = GObject.MainLoop()
    dbus_display = dbusinterface.display.Display(c)
    bus.publish(BUS_NAME, dbus_display)
    logger.info('Running')
    loop.run()

def run(args, context = None):
    """
    Called by the daemon's launcher.
    """

    # If the version argument is present, print information and return
    if (args.version):
        print(version())
        return

    logger = get_logger(stdout = args.nodetach)

    # Call the daemon's main function
    try:
        main(args, logger, context)
    # and catch any unhandled exceptions that happen in it
    except Exception as e:
        logger.error('{}: {}'.format(type(e).__name__, str(e)))
        logger.error('An unexpected exception has occurred. Terminating')
        raise SystemExit(1)