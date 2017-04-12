const cron = require('node-cron');
const req = require('request-promise');
const sleep = require('sleep');
const https = require('https');
const fs = require('fs');

////// download function start//////
const download = function(url, dest, cb) {
  console.log('downloading...');
  const file = fs.createWriteStream(dest);
  const request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};
////// download function end//////

const getDownloadLink = function (config, id, downloadPath, isUS) {
  return new Promise(function(resolve, reject) {
    req(queryOptions(config, id, isUS)).then(function(body){
      const data = JSON.parse(body); 
      if (data.status === 'done') {
        const time = new Date();
        const date = time.getFullYear().toString() + (time.getMonth()+1).toString() + time.getDate().toString();
        download(data.download_url,downloadPath+config.leancloudId+'-'+date+'.gz',function (err, msg) {
          resolve(data.download_url,downloadPath+config.leancloudId+'-'+date+'.gz');
        });
      } else {
        sleep.sleep(600);
        console.log(config.leancloudId, ' still running, auto waiting 1000 second to retry');
        return getDownloadLink(config, id, downloadPath, isUS);
      }
    }).catch(function(err){
      console.log(err);
      reject(err);
    });
  });
}

const exportOptions = function(config,isUS) {
  const options = {
    method: 'POST',
    headers: {
      'X-LC-Id': config.leancloudId,
      'X-LC-Key': config.leancloudKey,
      'Content-Type': 'application/json',
    },
    json: `{"email":"${config.email}"}`
  }
  options.url = (isUS) ? 'https://us-api.leancloud.cn/1.1/exportData' : 'https://api.leancloud.cn/1.1/exportData';
  return options;
}
const queryOptions = function(config, id, isUS){
  const options = {
    headers: {
      'X-LC-Id': config.leancloudId,
      'X-LC-Key': config.leancloudKey
    }
  };
  const baseUrl = (isUS) ? 'https://us-api.leancloud.cn/1.1/exportData' : 'https://api.leancloud.cn/1.1/exportData';
  options.url = `${baseUrl}/${id}`;
  return options;
}

const mainCron = function (cronString, config, downloadPath, isUS) {
  cron.schedule(cronString, function () {

    console.log('######Cronjob Start######');
    // console.log(exportOptions(config, isUS));
    req(exportOptions(config, isUS)).then(function (body) {
      console.log('App Id: ', config.leancloudId);
      console.log('Task Id: ', body.id);
      console.log('Status: ', body.status);
      const taskId = body.id;
      console.log('waiting leancloud export data...');
      sleep.sleep(1200);
      return getDownloadLink(config, id, downloadPath, isUS);
    }).then(function (file) {
      console.log('App Id: ', config.leancloudId);
      console.log('Task Id: ', body.id);
      console.log('Status: ', 'done');
    }).catch(function (err) {
      console.error(err);
    });

  });
}


module.exports = mainCron;