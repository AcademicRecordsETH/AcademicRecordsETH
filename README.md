# Prerequisitos

Instalar NodeJS https://nodejs.org/
Instalar MetaMask https://metamask.io/

## Instalar dependencias globales

Ejecutar en la carpeta del proyecto:

~~~
npm install -g truffle
npm install -g @angular/cli
npm install -g ganache-cli
~~~

## Instalar dependencias del proyecto

Ejecutar en la carpeta del proyecto:

~~~
npm install
~~~

## Ejecutar ganache

Ejecutar en la carpeta del proyecto en una consola separada:

~~~
ganache-cli -l 7000001
~~~

## Compilar y mirar los contratos

Ejecutar en la carpeta del proyecto en una consola separada:

~~~
truffle compile && truffle migrate
~~~

## Testear los contratos

Ejecutar en la carpeta del proyecto en una consola separada:

~~~
truffle test
~~~

## Arrancar el front

Ejecutar en la carpeta del proyecto en una consola separada:

~~~
ng serve
~~~
