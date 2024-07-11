
![favicon.png](favicon.png) [<span style='font-size:20px;'>&#x270D;</span>](git@github.com:multigit-com/python/edit/main/DOCS/HEAD.md)

# [www.camerainspect.com](http://www.camerainspect.com) 

[![GitHub stars](https://img.shields.io/github/stars/camerainspect/www.svg?style=flat&label=Star)](https://github.com/camerainspect/www/stargazers) [![GitHub forks](https://img.shields.io/github/forks/camerainspect/www.svg?style=flat&label=Fork)](https://github.com/camerainspect/www/fork) [![GitHub watchers](https://img.shields.io/github/watchers/camerainspect/www.svg?style=flat&label=Watch)](https://github.com/camerainspect/www/watchers) [![GitHub followers](https://img.shields.io/github/followers/camerainspect.svg?label=Follow)](https://github.com/camerainspect) [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fcamerainspect%2Fwww&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=true)](https://hits.seeyoufarm.com)

## MENU [<span style='font-size:20px;'>&#x270D;</span>](git@github.com:multigit-com/python/edit/main/DOCS/MENU.md)

+ [camerainspect.com](http://www.camerainspect.com)
+ [docs](http://docs.camerainspect.com)
+ [logo](http://logo.camerainspect.com)
+ [roadmap](http://roadmap.camerainspect.com)
+ [identity](http://identity.camerainspect.com)

## About us [<span style='font-size:20px;'>&#x270D;</span>](git@github.com:multigit-com/python/edit/main/DOCS/FOOT.md)

+ [softreck.com](http://softreck.com)
+ [telemonit.com](http://telemonit.com)


---

<script type="module">    
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  mermaid.initialize({
    startOnReady:true,
    theme: 'forest',
    flowchart:{
            useMaxWidth:false,
            htmlLabels:true
        }
  });
  mermaid.init(undefined, '.language-mermaid');
</script>

## [Contribute](http://contribution.softreck.dev) [<span style='font-size:20px;'>&#x270D;</span>](git@github.com:multigit-com/python/edit/main/CONTRIBUTE/CONTRIBUTE.md)

[CONTRIBUTION](CONTRIBUTE/CONTRIBUTION.md) are always welcome:
+ did you found an [Issue or Mistake](https://github.com/camerainspect/www/issues/new)?
+ do you want to [improve](https://github.com/camerainspect/www/edit/main/README.md) the article?
+ are you interested do join another [git projects](https://github.com/camerainspect/)?
+ have something to contribute or discuss? [Open a pull request](https://github.com/camerainspect/www/pulls) or [create an issue](https://github.com/camerainspect/www/issues).

## Dokumentacja [<span style='font-size:20px;'>&#x270D;</span>](git@github.com:multigit-com/python/edit/main/CONTRIBUTE/FLATEDIT.md)

```bash
wget https://raw.githubusercontent.com/flatedit/bash/main/flatedit.sh
chmod +x flatedit.sh
./flatedit.sh update
```


```bash
./flatedit.sh install
./flatedit.sh init
./flatedit.sh
```



```bash
./flatedit install
./flatedit init
./flatedit
```

## Python Install [<span style='font-size:20px;'>&#x270D;</span>](git@github.com:multigit-com/python/edit/main/CONTRIBUTE/PYTHON.md)

Zainstaluj biblioteki Pythona, jeśli jeszcze tego nie zrobiłeś. Możesz to zrobić używając `pip`:

```bash
py -m pip install --upgrade pip
py -m pip install --upgrade setuptools
py -m pip install --upgrade wheel
py -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

```bash
py -m pip install -r requirements.txt
```

## Start docker [<span style='font-size:20px;'>&#x270D;</span>](git@github.com:multigit-com/python/edit/main/CONTRIBUTE/DOCKER.md)

Pliki `Dockerfile` i `docker-compose.yml` umożliwiaj konteneryzację aplikacji React.js (src) i backendu Express, co sprawia, że aplikacja staje się bardziej przenośna i łatwa do wdrożenia. 
Dzięki Docker i Docker Compose możesz uruchomić złożone środowiska wielokontenerowe jedną komendą, co znacznie upraszcza zarządzanie i skalowanie aplikacji.



```sh
cd backend
docker build -t .
```


```sh
cd ..
```

```sh
cd src
docker build .
```

### Zbuduj i uruchom kontenery za pomocą Docker Compose:

```sh
docker compose up --build
```

### Debugowanie
Jeśli wystąpią problemy, sprawdź logi za pomocą:

```sh
docker compose logs
```

### Zatrzymywanie kontenerów

```sh
docker compose down
```


If you need your build to connect to services running on the host, you can use the special host-gateway value for --add-host. In the following example, build containers resolve host.docker.internal to the host's gateway IP.
```sh
docker build --add-host host.docker.internal=host-gateway .
```

## TODO [<span style='font-size:20px;'>&#x270D;</span>](git@github.com:multigit-com/python/edit/main/CONTRIBUTE/TODO.md)

- [ ] update project

---
+ Modular Documentation made possible by the [FlatEdit](http://www.flatedit.com) project.
