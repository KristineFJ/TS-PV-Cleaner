// src/Library/TrueNAS.ts
import got, { Got, OptionsOfJSONResponseBody } from 'got';
import { logger, LogMode } from '../../Library/Logger';
import { TransformPlainToInstance } from 'class-transformer';
import { TrueNASPool } from './Pool';
import { TrueNASDataset } from './Dataset';

interface TrueNASAPIConfig {
  apiURL: string;

  credentials: {
    username: string;

    password: string;
  };
}

export class TrueNASAPI {
  private api: Got;

  constructor({ apiURL: prefixUrl, credentials }: TrueNASAPIConfig) {
    this.api = got.extend({
      prefixUrl,
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${credentials.username}:${credentials.password}`,
        ).toString('base64')}`,
        Accept: '*/*',
      },
      timeout: {
        request: 5000000,
        connect: 5000000,
      },
    });
  }

  private async makeRequest<
    RepsonseType,
    Body extends OptionsOfJSONResponseBody,
  >(path: string, body?: Body): Promise<RepsonseType> {
    const apiRespones = await this.api<RepsonseType>(path, {
      responseType: 'json',
    });

    return apiRespones.body;
  }

  public async getiSCSIExtends(): Promise<void> {
    const apiResponse = await this.makeRequest('iscsi/extent');

    logger.log(LogMode.INFO, 'Response for iSCSI Extents', apiResponse);
  }

  public async getiSCSIExtent(extentId: string): Promise<void> {
    const apiResponse = await this.makeRequest(`iscsi/extent/id/${extentId}`);

    logger.log(LogMode.INFO, 'Response for iSCSI Extents', apiResponse);
  }

  public async getiSCSITargets(): Promise<void> {
    const apiResponse = await this.makeRequest('iscsi/target');

    logger.log(LogMode.INFO, 'Response for iSCSI Targets', apiResponse);
  }

  public async getiSCSITarget(targetId: string): Promise<void> {
    const apiResponse = await this.makeRequest(`iscsi/target/id/${targetId}`);

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

  @TransformPlainToInstance(TrueNASDataset)
  public async getDatasets(): Promise<TrueNASDataset[]> {
    const apiResponse = await this.makeRequest<TrueNASDataset[], {}>(
      `pool/dataset`,
    );
    return apiResponse;
  }

  public async getDataset(datasetID: string): Promise<void> {
    const apiResponse = await this.makeRequest<any, {}>(
      `pool/dataset/id/${datasetID}`,
    );

    logger.log(LogMode.INFO, 'Response for get Dataset', apiResponse);
  }

  public async getVolumes(): Promise<void> {}
}
