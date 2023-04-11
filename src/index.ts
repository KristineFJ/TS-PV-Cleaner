// src/index.ts
import 'reflect-metadata';
import { logger, LogMode } from './Library/Logger';
import { sayHello } from './Utils/sayHello';
import { KubeAPI } from './Library/Kubernetes';
import { TrueNASAPI } from './Modules/TrueNAS';
import { TrueNASDataset } from './Modules/TrueNAS/Dataset';
import fs from 'fs/promises';
import { plainToInstance } from 'class-transformer';

const k8s = new KubeAPI();

const nasAPI = new TrueNASAPI({
  apiURL: 'http://172.31.241.70/api/v2.0',
  credentials: {
    username: process.env.USERNAME as string,
    password: process.env.PASSWORD as string,
  },
});

logger.log(LogMode.INFO, `Starting Repair system`);

const pools = await nasAPI.getPools();

const pool = pools.find(({ name }) => name === 'Site1.NAS1.Pool1');

if (!!!pool) {
  throw new Error(`Invalid Pool ID ${pool}`);
}

const cacheFile = 'output.json';

try {
  await fs.access(cacheFile);
} catch {
  logger.log(LogMode.WARN, `File does not yet exit`);

  const dsArray = [];

  const datasets = await nasAPI.getDatasets();

  for (const dataset of datasets) {
    if (dataset.id.startsWith('Site1.NAS1.Pool1/k8s')) {
      dsArray.push(dataset);
    }
  }

  await fs.writeFile(cacheFile, JSON.stringify(dsArray));
}

const cacheFileData = await fs.readFile(cacheFile);

const cacheData = JSON.parse(cacheFileData.toString()) as TrueNASDataset[];

let badCount = 0;
let goodCount = 0;
const dontExistPV: [string, TrueNASDataset][] = [];
const doExistPV = [];

for (const dataset of plainToInstance(TrueNASDataset, cacheData)) {
  const k8sName = dataset.user_properties['democratic-csi:csi_volume_name'];

  try {
    const k8sAPIVolume = await k8s.getPV(k8sName.value);

    logger.log(
      LogMode.INFO,
      `${TrueNASDataset.name} does exist`,
      k8sName.value,
      k8sAPIVolume,
    );

    goodCount++;

    doExistPV.push(k8sName.value);
  } catch {
    logger.log(
      LogMode.INFO,
      `${TrueNASDataset.name} should not exist`,
      k8sName.value,
    );
    badCount++;

    dontExistPV.push([k8sName.value, dataset]);
  }
}

logger.log(LogMode.INFO, `Good Count: ${goodCount}\nBad Count: ${badCount}`);

for (const [pvName, dataSet] of dontExistPV) {
  logger.log(LogMode.INFO, `Bad PV to be deleted is ${pvName}`);

  if (dataSet.used.value === '56K') {
    logger.log(
      LogMode.INFO,
      `Dataset to be deleted is ${pvName} ${dataSet.id}`,
      dataSet,
    );

    await nasAPI.deleteDataset(dataSet.id);

    // const extentTargetProp =
    //   dataSet.user_properties['democratic-csi:freenas_iscsi_targettoextent_id'];

    // if (extentTargetProp !== undefined) {
    //   try {
    //     await nasAPI.getiSCSITargetExtent(extentTargetProp.value);

    //     await nasAPI.deleteiSCSITargetExtent(extentTargetProp.value);
    //   } catch {}

    //   logger.log(LogMode.INFO, `Extent Target prop`, extentTargetProp.value);
    // }

    // const extentProp =
    //   dataSet.user_properties['democratic-csi:freenas_iscsi_extent_id'];

    // if (extentProp !== undefined) {
    //   logger.log(LogMode.INFO, `Extent prop`, extentProp.value);

    //   try {
    //     await nasAPI.getiSCSIExtent(extentProp.value);
    //     await nasAPI.deleteiSCSIExtent(extentProp.value);
    //   } catch {}
    // }

    // const targetProp =
    //   dataSet.user_properties['democratic-csi:freenas_iscsi_target_id'];

    // if (targetProp !== undefined) {
    //   logger.log(LogMode.INFO, `Target prop`, targetProp.value);

    //   try {
    //     await nasAPI.getiSCSITarget(targetProp.value);
    //     await nasAPI.deleteiSCSITarget(targetProp.value);
    //   } catch {}
    // }

    // if (
    //   dataSet.user_properties['democratic-csi:freenas_iscsi_extent_id']
    //     ?.value !== undefined &&
    //   dataSet.user_properties['democratic-csi:freenas_iscsi_targettoextent_id']
    //     ?.value !== undefined
    // ) {
    //   const { value: targetId } =
    //     dataSet.user_properties['democratic-csi:freenas_iscsi_target_id'];

    //   logger.log(
    //     LogMode.INFO,
    //     `Bad PV be deleted ${pvName}\nextentID: ${extentId}\nTargetID: ${targetId}\nextentTargetID: ${extentTargetID}`,
    //   );
    // } else {
    //   logger.log(
    //     LogMode.INFO,
    //     `Bad PV be deleted ${pvName}`
    //   );
    // }
  }
}

await sayHello('K-FOSS');

export {};
