# Confy

Simple CLI program for storing confidential data on public domains


# Quick Start

- Using [npx](https://docs.npmjs.com/cli/v10/commands/npx):
```sh
npx confy-cli <input>.html -o <output>.html -k <secret_key>
```
- Using [nix](https://nixos.org/download/):
```sh
nix run github:dimchee/confy -- <input>.html -o <output>.html -k <secret_key>
```
# Installation

- Using [npm](https://www.npmjs.com/)
```sh
npm -g install confy-cli
```
- Or [nix](https://nixos.org/download/) [flake](https://nixos.wiki/wiki/flakes):
```sh
nix profile install github:dimchee/confy
```

# Quick Guide

- Start with ordinary `HTML` file:
```html
<!-- input.html -->
<!DOCTYPE html>
<html lang="en">
  <body>
    <div>
        First sentence.
    </div>
    <div>
        Second sentence.
    </div>
    <div>
        Third one.
    </div>
  </body>
</html>
```
- Add `secret` class to `secret` elements:
```html
<!-- input.html -->
<!DOCTYPE html>
<html lang="en">
  <body>
    <div class="secret">
        First secret sentence.
    </div>
    <div class="secret">
        Second secret sentence.
    </div>
    <div class="secret">
        A third one.
    </div>
  </body>
</html>
```
- Just run program:
```sh
confy input.html -o output.html -k some_key
```
- Witness locking:
```html
<!-- output.html (formated) -->
<!DOCTYPE html>
<html lang="en">
  <head></head>
  <body>
    <div class="secret">
      0bd0e6418f83910a0fa1e29e3d9b182dec3c58cc491c4e7dfd54b5b471e7475af1868fbf
    </div>
    <div class="secret">
      0bd0e6418f83910a0fb4ee8f21815c7efa3a49db58481d6bf64ea4bf7ce10c7edb868fbf58
    </div>
    <div class="secret">
      0bd0e6418f83910a0fa6ab9826864a3aa93044cc13361d38b300
    </div>
    ...
  </body>
</html>
```
- Open in browser:
```sh 
firefox output.html
```
- Or unlock with key:
```sh
firefox output.html?key=some_key
```
# Mentions
- The idea originally came up in a conversation with [andrijast](https://github.com/andrijast)
