# Coinbase Ticker

✨ A WebSocket feed to stream live market data from Coinbase

## 🏗 Task

Create a application using NodeJS for the webserver that will interact with the Coinbase Pro websocket API (`https://docs.pro.coinbase.com/#websocket-feed`) and send the information through a websocket client. This application will work as a middleware from coinbase and the client.

A user should be able to type the exact name of the symbol and start a streaming of the prices for the following 4 products:

- BTC-USD
- ETH-USD
- LTC-USD

The request messages from the client side will be:

- `quit` : shutdown the webserver
- `system` : Show system status of which instruments are subscribed at the moment
- `system <number>` : change the refresh interval of the current view to another value. This will be in milliseconds.
- `:` : **Price View** - This will show on refresh interval rate of 250ms by default the bids and asks of the level2 updates from the API. If the matches view is currently been displayed, it must delete that view and start showing the symbols as the price view.
- `m` : **Matches View** - This will show an order blotter that will have to display the timestamp, product, trade size and price. If the price view was active, it must now display all the instruments as the matches view.
- `u` : **Unsubscribe** - This will unsubscribe the symbol from the list that the user is currently looking at.

You will need to be able to support multiple terminal users, where each user can be subscribed to different currencies. A user should only see updates for the pairs that they are subscribed to.

The webserver must handle all incoming prices updates and then send them to the right subscribed user.

## 🦄 Screenshot

<!-- this is a placeholder for context -->

## 👀 Core Features

<!-- this is a placeholder for context -->

## 🚀 Project Structure

<!-- this is a placeholder for context -->

## 📗 Getting Started

<!-- this is a placeholder for context -->

## 🧪 Testing

<!-- this is a placeholder for context -->

## 🧞 Available Scripts

<!-- this is a placeholder for context -->
