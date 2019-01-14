const express = require('express');
const _ = require('lodash');
const KNoTCloud = require('knot-cloud');

const router = express.Router();

async function getOnlineDevicesWithData(cloud, devices) {
  const onlineDevices = _.chain(devices)
    .filter('online')
    .map(async (device) => {
      const data = await cloud.getData(device.id);
      device.sensorid = data[0].data.sensor_id;
      device.value = data[0].data.value;
      return device;
    })
    .value();
  return (Promise.all(onlineDevices));
}

router.get('/', async (req, res) => {
  const meshbluHost = req.get('Meshblu-Host');
  const meshbluPort = parseInt(req.get('Meshblu-Port'), 10);
  const meshbluAuthUUID = req.get('Meshblu-Auth-UUID');
  const meshbluAuthToken = req.get('Meshblu-Auth-Token');

  const cloud = new KNoTCloud(
    meshbluHost,
    meshbluPort,
    meshbluAuthUUID,
    meshbluAuthToken
  );

  try {
    await cloud.connect();
    const devices = await cloud.getDevices();
    const onlineDevices = await getOnlineDevicesWithData(cloud, devices);
    res.status(200).send(onlineDevices);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    await cloud.close();
  }
});

module.exports = router;
