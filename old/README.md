# Linchat

A simple linear chat application consisting of a server and a client. The server is written in Python and the client is written in Javascript. The application uses websockets to communicate between the server and the client.

A local instance of the chat program can be run by starting the websocket server and opening the file 'www/index.html' in a web browser.

```python3 chat_server.py```

The application asks for a username and a password, which are stored in the 'nutz.dat' file. The chat messages are stored in the 'nachr.dat' file.

A live version of the chat program can be found at [https://linchat.trickrichter.de](https://linchat.trickrichter.de).