// src/Library/TrueNAS.ts
import got, { Got, OptionsOfJSONResponseBody } from 'got'
import { logger, LogMode } from './Logger';

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
      }
    })

  }

  private async makeRequest<Repsonse, Body extends OptionsOfJSONResponseBody>(path: string, body?: Body): Promise<Response> {
    const apiRespones = await this.api<Response>(path, {
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
}