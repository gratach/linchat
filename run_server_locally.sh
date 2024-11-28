#!/bin/bash
nohup xterm -e python3 $PWD'/chat_server.py' &> /dev/null &
nohup sleep 1 &> /dev/null; firefox localhost:9162 &> /dev/null &
echo $PWD
python3 static_file_server.py
