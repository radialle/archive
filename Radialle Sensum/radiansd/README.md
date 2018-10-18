<p align="center">
  <img src="https://avatars2.githubusercontent.com/u/31752856"
       alt="" width="200" />
</p>

# radiansd

> A daemon which provides a D-Bus interface for interaction with the LDCF
  (Lumen Display Controller Firmware).

_This document is also available in the following languages:
[Português (Brasil)](README.pt-br.md)._

## Requirements

* [python-daemon](https://pypi.python.org/pypi/python-daemon/)  
  _Library to implement a well-behaved Unix daemon process._

* [argparse](https://pypi.python.org/pypi/argparse/)  
  _Python command-line parsing library._

* [pyserial](https://pypi.python.org/pypi/pyserial)  
  _Python serial port extension._

* [pydbus](https://pypi.python.org/pypi/pydbus)  
  _Pythonic D-Bus library._

* [python3-gi](https://packages.debian.org/stretch/python3-gi)  
  _Python 3 bindings for gobject-introspection libraries._  
  **NOT** included in _requirements.txt_. Must be installed with apt (e.g. 
  `apt install python3-gi`).

## License

[MIT](LICENSE)

## Links

* [Sensum](https://github.com/radialle-sensum/sensum)  
  A project dedicated to the practical exploration of the subjects related to
  the development of wearable devices.