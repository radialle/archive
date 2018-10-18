import re
from threading import Thread

class CommandThread(Thread):

    _DEFAULT_WAIT_DONE = False
    _DEFAULT_CALLBACK = None

    def __init__(self, controller, command, **kwargs):
        Thread.__init__(self)
        self._controller = controller
        self._command = command
        self._wait_done = kwargs.get('wait_done', self._DEFAULT_WAIT_DONE)
        self._callback = kwargs.get('callback', self._DEFAULT_CALLBACK)

    def _exec_callback(self, status):
        if self._callback is None:
            return
        self._callback(status)

    def run(self):
        retries = 0
        controller = self._controller

        while True:
            retries += 1
            controller.write(self._command)
            reply = controller.readline()
            match = re.search(r'([0-9]*)(.*)\n', reply)
            try:
                status = int(match.group(1))
            except Exception as e:
                status = controller.RETURN_STATUS_UNKNOWN
            if status is 0:
                break
            self._controller.logger.warn(
                ('Sending command to the display controller, try {} of {}: '
                 'unexpected return code ({})').format(
                    retries,
                    controller.max_retries,
                    status
                    )
                )
            if (retries >= controller.max_retries):
                self._exec_callback(status)
                return

        if not self._wait_done:
            self._exec_callback(status)
            return

        reply = controller.readline()
        match = re.search(r'([0-9]*)(.*)\n', reply)
        try:
           status = int(match.group(1))
        except Exception as e:
           pass
        if status is not 1:
           status = controller.RETURN_STATUS_UNKNOWN
        self._exec_callback(status)
