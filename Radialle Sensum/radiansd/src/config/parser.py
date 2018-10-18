import re

def parse(path):
    """
    Parses the configuration file.
    """

    ret = dict()

    with open(path, 'r') as file:
        for count, line in enumerate(file):

            # Remove comments and leading/trailing whitespace characters
            line = re.sub(r'#(.*)', '', line).strip()

            # If result is empty, move on to the next line
            if (line == ''):
                continue

            # Separate components on line
            components = line.split(':')

            # If length is not 2, file has a syntax error
            if (len(components) != 2):
                raise SyntaxError('error parsing line {}'.format(count+1))

            # Get property name and value
            propname = components[0].strip()
            propval = components[1].strip()

            # If value is a number, convert to int
            if propval.isdigit():
                propval = int(propval)

            # Add property to ret
            ret[propname] = propval

    return ret