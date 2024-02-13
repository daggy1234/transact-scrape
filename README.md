# Testing


## Setup

1) Make sure Yarn is Installed

2) RUn Setup
```shell
yarn install
yarn playwright install
```

3) Your Script is ready to use

## Opening Chrome In Debug Mode


1) Close currently running chrome and close all tabs.

2) Launch Chrome Debug Mode
```shell
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

3) Visit `https://duke-sp.transactcampus.com/eAccounts/AccountTransaction.aspx` and it should be your only open tab. (Basically leftmost tab in first window). Login untill you get to date selection screen.

4) RUn script with `yarn run scrape`

5) Let it run, it'll take like ~5-10 minutes cause transact fucking sucks L.

## Merge Final Files

Run this to merge them into combined `transact_data.json`

```shell
yarn merge
```