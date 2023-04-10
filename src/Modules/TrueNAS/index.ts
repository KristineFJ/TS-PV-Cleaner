// src/Library/TrueNAS.ts
import got, { Got, OptionsOfJSONResponseBody } from 'got'
import { logger, LogMode } from '../../Library/Logger';
import { TransformPlainToInstance } from 'class-transformer'
import { TrueNASPool } from './Pool'

interface TrueNASAPIConfig {
  apiURL: string;

  credentials: {
    username: string,

    password: string
  };
}

export class TrueNASAPI {
  private api: Got;

  constructor({
    apiURL: prefixUrl,
    credentials
  }: TrueNASAPIConfig) {
    this.api = got.extend({
      prefixUrl,
      headers: {
        Authorization: `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
        Accept: '*/*'
      },
      timeout: {
        request: 500000
      },
    })

  }

  private async makeRequest<RepsonseType, Body extends OptionsOfJSONResponseBody>(path: string, body?: Body): Promise<RepsonseType> {
    const apiRespones = await this.api<RepsonseType>(path, {
      responseType: 'json',
      
    });

    return apiRespones.body;
  }


  public async getiSCSIExtends(): Promise<void> {
    const apiResponse = await this.makeRequest('iscsi/extent');

    logger.log(LogMode.INFO, 'Response for iSCSI Extents', apiResponse);    
  }

  public async getiSCSITargets(): Promise<void> {
    const apiResponse = await this.makeRequest('iscsi/target');

    logger.log(LogMode.INFO, 'Response for iSCSI Targets', apiResponse);  
  }

  public async getiSCSITargetExtents(): Promise<void> {
    const apiResponse = await this.makeRequest('iscsi/targetextent');

    logger.log(LogMode.INFO, 'Response fro Check Auth', apiResponse);  
  }

  @TransformPlainToInstance(TrueNASPool)
  public async getPools(): Promise<TrueNASPool[]> {
    const apiResponse = await this.makeRequest<TrueNASPool[], {}>('pool');


    return apiResponse;
  }


  public async getPool(poolId: number): Promise<void> {
    const apiResponse = await this.makeRequest<any, {}>(`pool/id/${poolId}`);

    logger.log(LogMode.INFO, 'Response for get Pools', apiResponse);  


//    return apiResponse;
  }

  public async getDatasets(): Promise<void> {
    const apiResponse = await this.makeRequest<any, {}>(`pool/dataset`);

    logger.log(LogMode.INFO, 'Response for get Pools', apiResponse);  
  }

  public async getVolumes(): Promise<void> {

  }
}