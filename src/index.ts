// src/index.ts
import { logger, LogMode } from './Library/Logger';
import { sayHello } from './Utils/sayHello';
import { KubeAPI } from './Library/Kubernetes'
import { TrueNASAPI } from './Library/TrueNAS'

const k8s = new KubeAPI();
const nasAPI = new TrueNASAPI({
  apiURL: 'http://172.31.241.70/api/v2.0',
  credentials: {
    username: process.env.USERNAME as string,
    password: process.env.PASSWORD as string,
  }
})

logger.log(LogMode.INFO, `Starting Repair system`);

await k8s.getPVC()


await nasAPI.getiSCSIExtends();


await sayHello('K-FOSS');

export { };
