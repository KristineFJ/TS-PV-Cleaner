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

// const pvs = await k8s.getPVs();

// const pvNames = [];

// for (const pv of pvs) {
//   logger.log(LogMode.INFO, `Namespcae: ${pv.metadata?.namespace}`)

//   pvNames.push(pv.metadata?.name)
// }

// logger.log(LogMode.INFO, `Total count of PVs is ${pvNames.length}`);

const pools = await nasAPI.getPools();

const pool = pools.find(({ name }) => name === 'Site1.NAS1.Pool1');

if (!!!pool) {
  throw new Error(`Invalid Pool ID ${pool}`);
}

const cacheFile = 'output.json';

try {
  await fs.access(cacheFile);

  const cacheFileData = await fs.readFile(cacheFile);

  const cacheData = JSON.parse(cacheFileData.toString()) as TrueNASDataset[];

  for (const { user_properties } of plainToInstance(
    TrueNASDataset,
    cacheData,
  )) {
    logger.log(LogMode.INFO, `Cache file contents`, user_properties);
  }
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

await sayHello('K-FOSS');

export {};
