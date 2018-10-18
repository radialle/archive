<p align="center">
  <img src="https://avatars2.githubusercontent.com/u/31752856"
       alt="" width="200" />
</p>

# radiansd

> Um daemon que oferece uma interface D-Bus para interação com o LDCF (Lumen
  Display Firmware Controller).

_Este documento também está disponível nas seguintes linguagens:
[English](README.md)._

## Requerimentos

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
  **NÃO** incluído no _requirements.txt_. Precisa ser instalado com apt (e.g. 
  `apt install python3-gi`).

## Licença

[MIT](LICENSE)

## Links

* [Sensum](https://github.com/radialle-sensum/sensum)  
  Projeto direcionado à exploração prática dos temas relacionados ao
  desenvolvimento de _wearables_.