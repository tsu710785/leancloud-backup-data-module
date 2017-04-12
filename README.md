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

const CronStatement = '* * 7 * * *' 
// CronJob expression, for example, it will run at AM7:00

const config = {
  leancloudId: 'leancloudId',
  leancloudKey: 'leancloud_master_key' + ',master',
  email: 'yourEmail'
}
// leancloudId: leancloud app id,
// leancloudKey: leancloud master key, NOTICE: ',master' CANNOT be removed

const DOWNLOAD_PATH = './backup/folder/'
// download backup file path

const isUS = true // is leancloud application in us node or not 
// if using leancloud US : true

backupModule(CronStatement, config, DOWNLOAD_PATH, isUS)
```
