# Scrape Duke Campus Commerce!!!

> **_NOTE:_**  Scraping is legal gray area.THis script is permissible if your run it to get your own data. Do not reproduce for shady/sus ඞ stuff

## Setup

1) Make sure Yarn is Installed

2) RUn Setup
```shell
yarn install
yarn playwright install
```

3) Your Script is ready to use

## Opening Chrome In Debug Mode


1) **Close currently running chrome and close all tabs.**

2) Launch Chrome Debug Mode

- Macos

```shell
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

- Windows

Try this.

```shell
& "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```
If not try this
```shell
& "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

3) Visit `https://duke-sp.transactcampus.com/eAccounts/AccountTransaction.aspx` and it should be your only open tab. (Basically leftmost tab in first window). Login untill you get to date selection screen.

4) RUn script with `yarn run scrape`

5) Let it run, it'll take like ~5-10 minutes cause transact fucking sucks L.

## Merge Final Files

Run this to merge them into combined `transact_data.json`

```shell
yarn merge
```

## What happens after this

Drop your processed json into a google drive. I will then run a verycool:tm: python script that will turn the html into CSV. We will remove your card number trust.

