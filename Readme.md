# Confy

Simple CLI program for storing confidential data on public domains


# Quick Start

- Using [npx](https://docs.npmjs.com/cli/v10/commands/npx):
```sh
npx confy-cli <input_html_file> -o <output_html_file> [-k <secret_key>]
```
- Using [nix](https://nixos.org/download/):
```sh
nix run github:dimchee/confy -- <input_html_file> -o <output_html_file> [-k <secret_key>]
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
- Add `secret` attribute to `secret` elements:
```html
<!-- input.html -->
<!DOCTYPE html>
<html lang="en">
  <body>
    <div secret>
        First secret sentence.
    </div>
    <div secret>
        Second secret sentence.
    </div>
    <div secret>
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
<!-- output.html (formatted) -->
<!DOCTYPE html>
<html lang="en">
  <head></head>
  <body>
    <div class="secret">
      d904bf21dd6f76cd4e3482d07e93ac8ba82423eb8f03918d886b2a69909f5048c85e75598f3e93e00af849c171f1cf4acc717a57969aaa8ee5588a408a6ea588
    </div>
    <div class="secret">
      304b588f7f484ffc717ac01fa2359ff0a63939101764fe0b65d3bab42b4fecf16a768d70aedc919ed0ccb68fe2a518558776ecf23ee709d7e82a5203d0fd623e
    </div>
    <div class="secret">
      71e0769bdf117c7eb8dfdd9768764fd6e7e0ee2e77b05ab8989c85e71b8216671226e21cc773e0b268b8e2b4fe28b99e
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

# Additional Features


## Styling
```html
<!-- style.html -->
<!DOCTYPE html>
<html lang="en">
  <body>
    <style>
      .secret {
        display: none;
      }
      .unlocked {
        color: green;
      }
    </style>
    <div secret="magic_key">
      First secret sentence.
    </div>
    <div secret="magic_key">
      Second secret sentence.
    </div>
    <div secret="magic_key">
      A third one.
    </div>
    <div secret="another_key">
      Invisible secret sentence.
    </div>
  </body>
</html>
```
- Confy don't need additional key:
```sh
confy style.html -o output.html
```
- Voilà:
```html
<!-- output.html (formatted) -->
<!DOCTYPE html>
<html lang="en">
  <head></head>
  <body>
    <style>
      .secret {
        display: none;
      }
      .unlocked {
        color: green;
      }
    </style>
    <div class="secret">
      9554c74c462aa89bceefa604b8e41056035705283034363a6c7b0b82550bef191fa2ade18ea08f611c0ef97367ca24f4ec6152c63214538bef570793e9466be4
    </div>
    <div class="secret">
      fb7a34ed57a4c7925f753e4afb6bfba1245ba77f5ceaa49378d01ecdb9390385f8c8f4ec57a5e62497b67eb01bbc8907acd8a749a2674d609630b8ed0bb4a230
    </div>
    <div class="secret">
      e94e8e5241fa7f159df987cada92c2b623140c237bd3b65b8cf90e936559eecc60b2fdc5a193a016d425986d7d12bf80
    </div>
    <div class="secret">
      a82f225c0c12e8e53c986ed5649a1060db314993681d3072964e349ec27c5453a4bf717ff6afd3310458c38084bf5f4862a69dfae090b8c8dc1e327b1be1ee3d
    </div>
    ...
  </body>
</html>
```
- As always:
```sh
firefox output.html?key=magic_key
```
- Now save page with `<Ctrl-S>`:
```html
<!-- output.html (saved & formatted) -->
<!DOCTYPE html>
<html lang="en" data-lt-installed="true"><head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  </head><body>
    <style>
      .secret {
        display: none;
      }
      .unlocked {
        color: green;
      }
    </style>
    <div class="unlocked">
      First secret sentence.
    </div>
    <div class="unlocked">
      Second secret sentence.
    </div>
    <div class="unlocked">
      A third one.
    </div>
    <div class="secret">
      a82f225c0c12e8e53c986ed5649a1060db314993681d3072964e349ec27c5453a4bf717ff6afd3310458c38084bf5f4862a69dfae090b8c8dc1e327b1be1ee3d
    </div>
    ...
  </body>
</html>
```
- So:
    - Locked `secret` elements have class `secret`
    - Unlocked `secret` elements have class `unlocked`

## Nesting & Different keys
```html
<!-- nested.html -->
<!DOCTYPE html>
<html lang="en">
  <body>
    <div secret="first_key">
      First secret sentence.
      <div secret="first_key">
        <div secret="second_key">
          A third one.
        </div>
        Second secret sentence.
      </div>
    </div>
  </body>
</html>
```
- Don't need additional key:
```sh
confy nested.html -o output.html
```
- Just first nest is unlocked:
```sh
firefox output.html?key=first_key
```
- To unlock next level save page with `<CTRL-S>` and run again:
```
firefox output.html?key=first_key
```
- Save page again, and finally:
```sh
firefox output.html?key=second_key
```
- Saving now gives:
```html
<!DOCTYPE html>
<html lang="en" data-lt-installed="true">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  </head>
  <body>
    <div class="">
      First secret sentence.
      <div class="">
        <div class="unlocked">
          A third one.
        </div>
        Second secret sentence.
      </div>
    </div>
    ...
  </body>
</html>
```
- Notice that `unlocked` class is on the last unlocked entry only

## Multiple files?

- This snippet encrypts every `html` file in `examples` directory, and put results in directory `out`:
```sh
for file in examples/*.html
do
    confy $file -o "out/$(basename -s .html $file).enc.html"
done
```
- This one mimics recursive option:
```sh
shopt -s globstar
for file in examples/**/*.html
do
    confy $file -o "out/$(basename -s .html $file).enc.html"
done
```

# Mentions
- The idea originally came up in a conversation with [andrijast](https://github.com/andrijast)
