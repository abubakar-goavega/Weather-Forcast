# Weather-Forcast
### Demo
[View Demo](https://abubakar-goavega.github.io/Weather-Forcast/)

>https://abubakar-goavega.github.io/Weather-Forcast/  
Note to use its feature you to need to allow location

## Setup

* First clone this repo 

```git 
git clone https://github.com/abubakar-goavega/Weather-Forcast.git
```
Or Download a zip file and unzip it

* Second install type script by running below command in root directory of project in command prompt or bash terminal by navigating to project location

```bash
npm install typescript --save-dev
or
npm install -g typescript
```

* Third you want to make changes and compile it run this

```bash
tsc -W
npm run watch
```

* Fouth to run local you can use live server or package call http-server

```bash
npm install --save-dev http-server
npm start
```

### Testing

For testing i am using jest package

* Install jest
```bash
npm install --save-dev jest
npm install --save-dev jsdom
npm install --save-dev jest-environment-jsdom
```

* Running the test

> Note: Before running tset cases you need to remove .js from the import statment of forecastui.ts file to avoid test file  
File Path src -> forecastui.ts  
[open forecastui.ts](./src/forecastui.ts)
```js
//Before
import { APIDateFormater } from "./formater.js";
//After
import { APIDateFormater } from "./formater";
```

```bash
npm test
```
