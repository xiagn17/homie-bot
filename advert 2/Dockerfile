FROM ubuntu:latest

RUN apt update

RUN apt install libpq-dev python3-dev -y

RUN apt install tmux -y

RUN apt install python3 -y

RUN apt install python3-pip -y

ENV LANG en_US.utf8

WORKDIR /src

COPY requirements.txt /src

RUN pip install -r requirements.txt

COPY . /src

#ENTRYPOINT [ "sh","-c","python3 fb.py" ]
#ENTRYPOINT [ "sh","-c","nohup python3 image_remove.py & nohup python3 syncer.py & nohup python3 fb.py & python3 main.py" ]
ENTRYPOINT [ "sh","-c","nohup python3 image_remove.py & nohup python3 syncer.py & python3 main.py" ]

