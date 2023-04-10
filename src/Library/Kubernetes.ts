// src/Library/Kubernetes.ts
import k8s from '@kubernetes/client-node'
import { logger, LogMode } from './Logger'



export class KubeAPI {
  public kc = new k8s.KubeConfig();

  public kubeAPI: k8s.CoreV1Api; 

  public constructor() {
    this.kc.loadFromFile(process.env.KUBECONFIG as string, {
      
    });

    this.kc.setCurrentContext('k0s')

    this.kubeAPI = this.kc.makeApiClient(k8s.CoreV1Api);
  }

  public async getPVs(): Promise<k8s.V1PersistentVolume[]> {
    const { body: { items } } = await this.kubeAPI.listPersistentVolume();

    return items;
  }
}
