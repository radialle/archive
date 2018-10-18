#!/usr/bin/env python3

import os
import pwd
import daemon
import argparse
import radiansd

DEFAULT_CONFIG_PATH = '/etc/radiansd/radiansd.conf'
DEFAULT_RUN_AS_USER = 'radiansd'

def get_args():
    """
    Parses the command line arguments.
    """

    parser = argparse.ArgumentParser(
        description='Lumen display controller daemon.'
        )
    parser.add_argument('-c', '--config',
        help="""specify path to the configuration file
        (default is {})""".format(DEFAULT_CONFIG_PATH),
        default=DEFAULT_CONFIG_PATH
        )
    parser.add_argument('-n', '--nodetach',
        help='run in foreground',
        action='store_true',
        default=False
        )
    parser.add_argument('-v', '--version',
        help='print daemon version and exit',
        action='store_true',
        default=False
        )
    args = parser.parse_args()
    
    # If the version argument is present, nodetach must be set to true
    if (args.version):
        args.nodetach = True
    
    return args

def main():
    """
    The launcher's main function. Sets group and user IDs, gets command line
    arguments, and launches the daemon.
    """
    
    # Set group and user IDs according to the DEFAULT_RUN_AS_USER constant
    pwnam = pwd.getpwnam(DEFAULT_RUN_AS_USER)
    os.setgid(pwnam.pw_gid)
    os.setuid(pwnam.pw_uid)
   
    # Get command line arguments
    args = get_args()
    
    # If the nodetach argument is present, run as a regular program
    if (args.nodetach):
        radiansd.run(args)
        return
    # else, run as a daemon
    with daemon.DaemonContext() as context:
        radiansd.run(args, context)

# Make sure that the script is being run directly, not imported as a module
if __name__ == '__main__':
    main()