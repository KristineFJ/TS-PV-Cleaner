// src/Library/TrueNAS.ts
import got, { Got, OptionsOfJSONResponseBody } from 'got';
import { logger, LogMode } from '../../Library/Logger';
import { TransformPlainToInstance } from 'class-transformer';
import { TrueNASPool } from './Pool';
import { TrueNASDataset } from './Dataset';
import { TrueNASExtent, TrueNASiSCSITarget } from './iSCSI';

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

  private async makeRequest<RepsonseType, Body>(
    path: string,
    options?: OptionsOfJSONResponseBody,
  ): Promise<RepsonseType> {
    const apiRespones = await this.api<RepsonseType>(path, {
      responseType: 'json',
      ...options,
    });

    return apiRespones.body;
  }

  @TransformPlainToInstance(TrueNASExtent)
  public async getiSCSIExtends(): Promise<TrueNASExtent[]> {
    const apiResponse = await this.makeRequest<TrueNASExtent[], {}>(
      'iscsi/extent',
    );

    return apiResponse;
  }

  @TransformPlainToInstance(TrueNASExtent)
  public async getiSCSIExtent(extentId: string): Promise<TrueNASExtent> {
    const apiResponse = await this.makeRequest<TrueNASExtent, {}>(
      `iscsi/extent/id/${extentId}`,
    );

    return apiResponse;
  }

  /**
   * Delete iSCSI Extent Agaisnst TrueNAS API
   * @param extentId iSCSI Extent ID
   */
  public async deleteiSCSIExtent(extentId: string): Promise<void> {
    const apiResponse = await this.makeRequest<TrueNASExtent, {}>(
      `iscsi/extent/id/${extentId}`,
      {
        method: 'DELETE',
      },
    );

    logger.log(LogMode.INFO, 'Response for Deleting Extent', apiResponse);
  }

  @TransformPlainToInstance(TrueNASiSCSITarget)
  public async getiSCSITargets(): Promise<TrueNASiSCSITarget[]> {
    const apiResponse = await this.makeRequest<TrueNASiSCSITarget[], {}>(
      'iscsi/target',
    );

    return apiResponse;
  }

  @TransformPlainToInstance(TrueNASiSCSITarget)
  public async getiSCSITarget(targetId: string): Promise<TrueNASiSCSITarget> {
    const apiResponse = await this.makeRequest<TrueNASiSCSITarget, {}>(
      `iscsi/target/id/${targetId}`,
    );

    return apiResponse;
  }

  public async deleteiSCSITarget(targetId: string): Promise<void> {
    const apiResponse = await this.makeRequest<TrueNASiSCSITarget, {}>(
      `iscsi/target/id/${targetId}`,
      {
        method: 'DELETE',
      },
    );

    logger.log(LogMode.INFO, 'Response for Deleting Target', apiResponse);
  }

  public async getiSCSITargetExtents(): Promise<void> {
    const apiResponse = await this.makeRequest('iscsi/targetextent');

    logger.log(LogMode.INFO, 'Response fro Check Auth', apiResponse);
  }

  public async getiSCSITargetExtent(targetExtentID: string): Promise<void> {
    const apiResponse = await this.makeRequest(
      `iscsi/targetextent/id/${targetExtentID}`,
    );

    logger.log(LogMode.INFO, 'Response for Target Extent', apiResponse);
  }

  /**
   * Delete iSCSI Target Extent on the TrueNAS API
   * @param targetExtentID iSCSI Target Extent ID
   */
  public async deleteiSCSITargetExtent(targetExtentID: string): Promise<void> {
    const apiResponse = await this.makeRequest(
      `iscsi/targetextent/id/${targetExtentID}`,
      {
        method: 'DELETE',
      },
    );

    logger.log(LogMode.INFO, 'Response for Delete Target Extent', apiResponse);
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
      `pool/dataset?id=${datasetID}`,
    );

    logger.log(LogMode.INFO, 'Response for get Dataset', apiResponse);
  }

  public async deleteDataset(datasetID: string): Promise<void> {
    const apiResponse = await this.makeRequest<any, {}>(
      `pool/dataset/id/${encodeURIComponent(datasetID)}`,
      {
        method: 'DELETE',
      },
    );

    logger.log(LogMode.INFO, 'Response for Delete Dataset', apiResponse);
  }

  public async getVolumes(): Promise<void> {}
}
