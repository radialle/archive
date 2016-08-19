English version at the bottom.



Português brasileiro
========

Ethereal  
por RapidLight  
<http://rapidlight.io/>

**Atenção:** este projeto é um experimento disponibilizado para fins de estudo. Não existe qualquer garantia de que haverão novas versões, mesmo que para correção de bugs. Seu uso em ambientes de produção não é recomendado.

Esta biblioteca depende da [Moment.js](http://momentjs.com/).


Introdução
----------

O Ethereal é uma biblioteca JavaScript que processa valores de data, hora e localização (latitude e longitude) para gerar dados. É direcionada a jogos eletrônicos e softwares que façam uso de valores pseudo-aleatórios em geral.



Conceitos
---------

O funcionamento da biblioteca baseia-se nos conceitos a seguir.


### Aro ###

Círculo a ser dividido em seções — signos — e contornado pelos ponteiros.

### Signos ###

Seções a serem demarcadas no aro. Tal demarcação varia em função da data, hora e da localização especificadas.

### Ascendente ###

Signo demarcado à esquerda do aro.

### Ponteiros ###

Um ponto que, de acordo com variações na data e hora, move-se ao redor do aro, indicando um signo.



Funcionamento
-------------

Ao ser chamado o método *generate*, é feito o cálculo da diferença, em dias, entre a data e a hora fornecidas ao objeto Ethereal através do método *setTime* e o dia 22 de novembro de 1997 às seis horas da manhã. Esta diferença é representada por um número inteiro (caso o horário fornecido seja seis horas da manhã) ou real, e será utilizada como base para os cálculos restantes. Exemplo: se a data e hora fornecidas fossem 1 de fevereiro de 2015 às 15h, a diferença seria 6280,375.

Em seguida, é utilizada uma função matemática que, com base na diferença de dias calculada e na latitude e longitude fornecidas, determina a variação das demarcações dos signos no aro.

As últimas etapas são o cálculo da posição dos ponteiros e o signo para o qual estes apontam. A posição dos ponteiros pode ser definida pela função matemática padrão da biblioteca, cuja saída varia de acordo com parâmetros que podem ser modificados pelo utilizador, ou por uma função customizada, definida inteiramente pelo utilizador.

O método *generate* retorna um objeto contendo as propriedades *ascendant* e *pointers*. A primeira contém um objeto com as propriedades *degrees*, que indica a variação, em graus, na demarcação dos signos no aro, e *sign*, que contém um objeto *EtherealSign*, indicando o signo que ficará à esquerda do aro. A segunda contém um objeto com propriedades de nomes correspondentes aos ponteiros passados na coleção de ponteiros, cada uma delas contendo um objeto com as propriedades *degrees*, indicando a posição do ponteiro, e *sign*, indicando o signo para o qual ela aponta.



Exemplo de utilização
---------------------

No exemplo a seguir, a saída é gerada com base nas seguintes informações:

- Latitude 22° 54" 46'
- Longitude 43° 10" 00'
- Ponteiro com configurações padrão da Ethereal
- Coleção de signos padrão da Ethereal

### Código JavaScript ###

```
var loc = new EtherealLocation();
loc.setLatitude(22, 54, 46);                 // Latitude 22° 54" 46'
loc.setLongitude(43, 10, 0);                 // Longitude 43° 10" 00'

var time = new moment();                     // Data e hora atuais
var pointer = new EtherealPointer('a');      // Ponteiro ‘a’ com configurações padrão

var signCollection = new EtherealSignCollection();
signCollection.createDefaultCollection();    // Cria coleção padrão de signos
 
var pointerCollection = new EtherealPointerCollection(pointer);
                                             // Cria coleção contendo o ponteiro ‘a’


var eth = new Ethereal();                    // Cria objeto Ethereal
eth.setLocation(loc);                        // Define localização a ser utilizada
eth.setTime(time);                           // Define data e hora a serem utilizadas
eth.setSignCollection(signCollection);       // Define coleção de signos
eth.setPointerCollection(pointerCollection); // Define coleção de ponteiros
 
var out = eth.generate();                    // Atribui dados gerados à variável out
```



### Objeto retornado pelo método *generate* ###

```
{
        "ascendant": {
                        "degrees": 310.66572894214477,
                        "sign": EtherealSign
                },
        "pointers": {
                        "a": {
                                "degrees": 131,
                                "sign": EtherealSign
                        }
                }
}
```



Aplicativo de demonstração
--------------------------

O aplicativo Ethereal Demo, criado para demonstrar visualmente o funcionamento da biblioteca Ethereal, está disponível no endereço <https://github.com/rapidlight/ethereal-demo>.



Documentação do código
----------------------

A documentação do código do projeto encontra-se disponível online, em <http://rapidlight.io/ethereal/docs/>.



English
=======

Ethereal  
by RapidLight  
<http://rapidlight.io/>

**Warning:** this project is an experiment provided for educational purposes. There isn’t any warranty that there will be future updates, even for the correction of bugs. It’s use in production environments is not recommended.

This library depends on [Moment.js](http://momentjs.com/).


Introduction
------------

Ethereal is a JavaScript library that generates data based on date, time, latitude and longitude values. It is directed to the use in electronic games and software that benefits from the use of pseudo-random values.



Concepts
--------

The library is based on the following concepts.


### Ring ###

Circle to be divided in sections called signs. The pointers revolve around this circle.

### Sign ###

Sections to be demarcated in the ring. The demarcation changes according to the date, time and location specified.

### Ascendant ###

Sign demarcated at the ring’s left side.

### Pointers ###

A point that, according to the date and time, moves itself around the ring, pointing to a sign.



How it works
------------

When the *generate* method is called, the difference, in days, between the date and time associated with the Ethereal object through the *setTime* method and November 22th, 1997 at 6am is calculated. This difference is represented by an Integer (if the time associated with the Ethereal object is 6am) or a Float, and is used as a basis for the remaining calculations. For instance, if the date and time associated to the object were February 1st, 2015 at 15pm, the difference would be 6280,375.

Then, a mathematical function based on the date, time and location values is used to determine the variation of the demarcation of the signs in the ring.

The last steps are the calculation of the pointers’ position and determination of which sign are they pointing to. Their position is defined by the Ethereal’s default transit function, that has parameters which can be modified by the library’s user, or by a custom function, entirely defined by the user.

The *generate* method returns an object containing the *ascendant* and *pointers* properties. The first one contains an object with the properties *degrees*, which indicates the variation, in degrees, of the signs’ demarcation in the ring, and *sign*, which contains an *EtherealSign* object, indicating the sign demarcated at the ring’s left side. The second contains an object with properties named according to the names associated with the pointers in the pointer collection, each one of them containing an object with the properties *degrees*, which indicates the pointer’s position, and *sign*, which indicates the sign it is pointing to.



Usage example
-------------

In the following example, the library’s output is generated with the following information:

- Latitude 22° 54" 46'
- Longitude 43° 10" 00'
- Pointer with Ethereal’s default options
- Ethereal’s standard sign collection


```
var loc = new EtherealLocation();
loc.setLatitude(22, 54, 46);                 // Latitude 22° 54" 46'
loc.setLongitude(43, 10, 0);                 // Longitude 43° 10" 00'

var time = new moment();                     // Current date and time
var pointer = new EtherealPointer('a');      // Pointer ‘a’ with default options

var signCollection = new EtherealSignCollection();
signCollection.createDefaultCollection();    // Creates default sign collection
 
var pointerCollection = new EtherealPointerCollection(pointer);
                                             // Creates collection with the ‘a’ pointer


var eth = new Ethereal();                    // Creates an Ethereal object
eth.setLocation(loc);                        // Defines the location to be used
eth.setTime(time);                           // Defines date and time to be used
eth.setSignCollection(signCollection);       // Defines the sign collection
eth.setPointerCollection(pointerCollection); // Defines the pointer collection
 
var out = eth.generate();                    // Assigns data to the ‘out’ variable
```


### Object returned by the *generate* method ###

```
{
        "ascendant": {
                        "degrees": 310.66572894214477,
                        "sign": EtherealSign
                },
        "pointers": {
                        "a": {
                                "degrees": 131,
                                "sign": EtherealSign
                        }
                }
}
```


Demo application
----------------

The Ethereal Demo application, created to visually demonstrate how the Ethereal library works, is available at <https://github.com/rapidlight/ethereal-demo>.



Documentation of code
---------------------

The documentation of the project’s code, in English, is available online, at <http://rapidlight.io/ethereal/docs/>.