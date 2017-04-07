# leancloud-backup-data-module
export leancloud data using cronJob


[![NPM](https://nodei.co/npm/leancloud-backup-data-module.png?downloads=true&downloadRank=true)](https://www.npmjs.com/package/leancloud-backup-data-module)

## Install

```
$ npm install --save leancloud-backup-data-module
```

## Usage

```
const backupModule = require('leancloud-backup-data-module');
const CronStatement = '* * 7 * * *' // will execute at 7:00 every morning
const config = {
  leancloudId: 'leancloudId',
  leancloudKey: 'leancloud_master_key' + ', master',
  email: 'yourEmail'
}
const DOWNLOAD_PATH = './backup/folder/'
const isUS = true // is leancloud application in us node or not 

backupModule(CronStatement, config, DOWNLOAD_PATH, isUS)
```
