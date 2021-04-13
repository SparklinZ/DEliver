# DEliver
A decentralised food delivery service application powered by blockchain technology. The order and delivery process are  fulfilled through direct peer-to-peer connections between the different participants. Intermediaries and platform fees are fully eliminated in order to maximise consumer welfare. Safe payment transactions and delivery handouts are regulated by Ethereum smart contracts. 

## Features

***Delivery option from any restaurant*** <br>
Get delivery from any restaurant of choice

***State your own delivery fee*** <br>
For consumers, have total control in the fee you are willing to pay. For riders, have total control in the fee you are willing to receive.

***Democratised Conflict Resolution*** <br>
Get involved in resolving conflicts to achieve fair and transparent settlements.

## Setup

1) Truffle 

Install and Open Ganache-cli or Ganache

**Install**
```
npm install ganache-cli
```
**Open**
```
ganache-cli -p 8545
```

2) Backend Module

Go to backend folder and open www file. Uncomment the following codes under start up script to initalise accounts.
```
var startup = require('./startup');
startup();
```

Open backend folder in integrated terminal and start
```
npm run start
```

3) Frontend Module

Open frontend folder in integrated terminal and start
```
npm run start
```
## Logging In
10 demo accounts have been created. 
In the Login Page, <br>
To access the application as a **consumer**: enter any number from 0 to 5 <br>
To access the application as a **rider**: enter any number from 6 to 9 <br>

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
