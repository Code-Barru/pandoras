## Fonctionnement


### Première activation
Quand arrive sur pc -> check si dans une VM
Si dans une VM, ne fait rien

Regarde si la clée "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\Dwm\\AnimationSessionUuid" existe.
Si la clée n'existe pas:
- Crée la clée "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\Dwm\\AnimationSessionUuid".
- Fait une copie du .exe dans "C:\\Windows\\System32\\\$\{UUID\}\\\$\{UUID\}.exe".
- Crée la clée "HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
- Envoie une requête au serveur en s'annonçant (envoie UUID)
- Stop le programme


### Activation normale

- Essaie de se connecter au serveur en annonçant son UUID
  - Si n'y arrive pas, réessaie 1 mins plus tard
- 

## Features

AES-256 Encryption


## Commands

~~/audiorecord~~

/bluescreen 

/infostealer [discord, web browser, crypto] 

/keylogger


/powershell 

/process 

/screenshot 

~~/screenrecord~~

/sysinfo

Quand un fichier est upload sur channel discord -> Demande si le bot doit l'upload sur la machine de la victime.

## Communication:

4 bytes

## Codes

1-63    : Maintenance
64-255 : Orders

1: Client asks for UUID 

2: Hello from client
  - UUID


  ---
64: Ask for SysInfo