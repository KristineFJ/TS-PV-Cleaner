// src/Library/Kubernetes.ts
import k8s from '@kubernetes/client-node'
import { logger, LogMode } from './Logger'



export class KubeAPI {
  public kc = new k8s.KubeConfig();

  public kubeAPI: k8s.CoreV1Api; 

  public constructor() {
    this.kc.loadFromFile(process.env.KUBECONFIG as string);

    this.kubeAPI = this.kc.makeApiClient(k8s.CoreV1Api);
  }
  

  public async getPVC(): Promise<void> {
    const pvResponse = await this.kubeAPI.listPersistentVolume();

    logger.log(LogMode.INFO, `All PVs`, pvResponse.body);
  }
}
