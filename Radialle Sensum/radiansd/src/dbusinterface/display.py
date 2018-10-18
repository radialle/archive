from pydbus.generic import signal

class Display(object):
    """
    <node>
        <interface name='io.rapidlight.sensum.Display'>
            <method name='Transition'>
                <arg name='speed' type='y' direction='in' />
                <arg name='color' type='s' direction='in' />
            </method>
            <property name='CurrentColor' type='s' access='read' />
            <property name='TransitionState' type='b' access='read' />
            <signal name='TransitionStateChanged'>
                <arg name='TransitionState' type='b' />
            </signal>
        </interface>
    </node>
    """

    def __init__(self, controller):
        """
        Display class initializer.
        """
        self._controller = controller
        self._transition_speeds = [
            self._controller.TRANSITION_SPEED_NONE,
            self._controller.TRANSITION_SPEED_FAST,
            self._controller.TRANSITION_SPEED_NORMAL,
            self._controller.TRANSITION_SPEED_SLOW
        ]
        self._valid_colors = self._controller.VALID_TRANSITION_COLORS
        self._current_color = 'none'
        self._transition_color = 'none'
        self._transition_state = False

    def _transition_callback(self, status):
        """
        Called when a transition has finished (except those with speed
        TRANSITION_SPEED_NONE).
        """

        self._controller.logger.info(('Transition finished with status '
                                      '{}').format(status))
        if (status == self._controller.RETURN_STATUS_DONE):
            self._current_color = self._transition_color
        self.TransitionState = False

    def Transition(self, speed, color):
        """
        Starts a transition between colors on the display.
        """

        # Pre-transition checks
        if (self.TransitionState):
            raise ValueError('cannot interrupt current transition')
        if (speed not in self._transition_speeds):
            raise ValueError('invalid speed value')
        if (color not in self._valid_colors):
            raise ValueError('invalid color value')
        if (color == self._current_color):
            raise ValueError('color is already on display')

        # Get transition speed value
        speed = self._transition_speeds[speed]

        # The callback is not used and TransitionState is not changed in the
        # case of a transition with speed TRANSITION_SPEED_NONE
        if (speed == self._controller.TRANSITION_SPEED_NONE):
            callback = None
            self._current_color = color
        else:
            callback = self._transition_callback
            self.TransitionState = True

        self._transition_color = color
        self._controller.transition(speed, color, callback=callback)

    @property
    def CurrentColor(self):
        """
        Returns the current color on display (only updated when a transition
        has finished).
        """
        return self._current_color

    @property
    def TransitionState(self):
        """
        Returns True if a transition is current being executed, False
        otherwise.
        """
        return self._transition_state

    @TransitionState.setter
    def TransitionState(self, value):
        """
        Setter for the TransitionState property. Emits a signal when the
        transition state is updated.
        """
        self._transition_state = bool(value)
        self.TransitionStateChanged(self._transition_state)

    # Defines the TransitionStateChanged signal.
    TransitionStateChanged = signal()