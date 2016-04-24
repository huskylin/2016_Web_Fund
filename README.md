## Dependencies
- git
- python3.5
- django
- node.js
- bower

## Quick Start

### Get project source code
```sh
$ git clone https://github.com/huskylin/2016_Web_Fund.git
```

### Install front-end package and migration
```sh
$ cd 2016_Web_Fund/husky_mooc
$ bower install
$ python3 manage.py migrate
```

### Start server
```sh
$ python3 manage.py runserver 8080
```
open localhost:8080 in your browser and see result

### Admin

```sh
$ python3 manage.py createsuperuser
```
open localhost:8080/admin and login
