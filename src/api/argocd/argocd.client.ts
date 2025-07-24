import { KubeClient } from '../ocp/kubeClient';
import {
  ArgoCDConnectionService,
  ArgoCDApplicationService,
  ArgoCDSyncService,
} from './services';
import {
  ApplicationKind,
  ArgoCDConnectionInfo,
  ArgoCDConnectionConfig,
  ApplicationSyncResult,
  SyncOptions,
} from './types';

/**
 * Main ArgoCD client implementation following the Facade pattern
 * Provides a simplified interface to the underlying ArgoCD services
 */
export class ArgoCDClient {
  private readonly connectionService: ArgoCDConnectionService;
  private readonly applicationService: ArgoCDApplicationService;
  private readonly syncService: ArgoCDSyncService;

  constructor(private readonly kubeClient: KubeClient) {
    this.connectionService = new ArgoCDConnectionService(kubeClient);
    this.applicationService = new ArgoCDApplicationService(kubeClient);
    this.syncService = new ArgoCDSyncService(this.connectionService, this.applicationService);
  }

  // Connection-related methods
  /**
   * Gets the name of the ArgoCD instance in the specified namespace.
   */
  public async getArgoCDInstanceName(namespace: string): Promise<string> {
    return this.connectionService.getInstanceName(namespace);
  }

  /**
   * Gets the ArgoCD server route for the specified instance.
   */
  public async getArgoCDServerRoute(namespace: string, instanceName: string): Promise<string> {
    return this.connectionService.getServerRoute(namespace, instanceName);
  }

  /**
   * Gets the ArgoCD admin password for the specified instance.
   */
  public async getArgoCDAdminPassword(namespace: string, instanceName: string): Promise<string> {
    return this.connectionService.getAdminPassword(namespace, instanceName);
  }

  /**
   * Gets complete connection information for ArgoCD in the specified namespace.
   */
  public async getArgoCDConnectionInfo(namespace: string): Promise<ArgoCDConnectionInfo> {
    return this.connectionService.getConnectionInfo({ namespace });
  }

  // Application-related methods
  /**
   * Get ArgoCD Application
   */
  public async getApplication(
    applicationName: string,
    namespace: string
  ): Promise<ApplicationKind | null> {
    try {
      return await this.applicationService.getApplication(applicationName, namespace);
    } catch (error) {
      console.error(
        `Error retrieving application ${applicationName}: ${error instanceof Error ? error.message : String(error)}`
      );
      return null;
    }
  }

  /**
   * List all ArgoCD Applications in a namespace
   */
  public async listApplications(
    namespace: string,
    labelSelector?: string
  ): Promise<ApplicationKind[]> {
    return this.applicationService.listApplications(namespace, labelSelector);
  }

  /**
   * Get the status of an ArgoCD application
   */
  public async getApplicationStatus(
    applicationName: string,
    namespace: string
  ): Promise<string | null> {
    try {
      return await this.applicationService.getApplicationStatus(applicationName, namespace);
    } catch (error) {
      console.error(
        `Error getting application status: ${error instanceof Error ? error.message : String(error)}`
      );
      return null;
    }
  }

  /**
   * Get health status of an ArgoCD application
   */
  public async getApplicationHealth(
    applicationName: string,
    namespace: string
  ): Promise<string | null> {
    try {
      return await this.applicationService.getApplicationHealth(applicationName, namespace);
    } catch (error) {
      console.error(
        `Error getting application health: ${error instanceof Error ? error.message : String(error)}`
      );
      return null;
    }
  }

  /**
   * Get sync status of an ArgoCD application
   */
  public async getApplicationSyncStatus(
    applicationName: string,
    namespace: string
  ): Promise<string | null> {
    try {
      return await this.applicationService.getApplicationSyncStatus(applicationName, namespace);
    } catch (error) {
      console.error(
        `Error getting application sync status: ${error instanceof Error ? error.message : String(error)}`
      );
      return null;
    }
  }

  /**
   * Get operation phase of an ArgoCD application
   */
  public async getApplicationOperationPhase(
    applicationName: string,
    namespace: string
  ): Promise<string | null> {
    try {
      return await this.applicationService.getApplicationOperationPhase(applicationName, namespace);
    } catch (error) {
      console.error(
        `Error getting application operation phase: ${error instanceof Error ? error.message : String(error)}`
      );
      return null;
    }
  }

  // Sync-related methods
  /**
   * Triggers and monitors a synchronization operation for an ArgoCD application.
   * 
   * This method throws errors to provide full error information for debugging.
   * Use syncApplicationAdvanced() if you prefer structured error handling.
   * 
   * @param applicationName The name of the ArgoCD application to sync
   * @param namespace The namespace where the ArgoCD instance is running
   * @param timeoutMs Optional timeout in milliseconds (default: 4 minutes)
   * @returns Promise<boolean> True if sync completed successfully
   * @throws {ArgoCDError} When sync operation fails
   */
  public async syncApplication(
    applicationName: string,
    namespace: string,
    timeoutMs: number = 4 * 60 * 1000
  ): Promise<boolean> {
    const result = await this.syncService.syncApplication(
      applicationName,
      { namespace },
      {},
      timeoutMs
    );
    return result.success;
  }

  /**
   * Advanced sync operation with custom options and structured error handling.
   * 
   * This method catches errors and returns them in the result structure,
   * making it suitable for cases where you want to handle errors programmatically.
   * 
   * @param applicationName The name of the ArgoCD application to sync
   * @param config Connection configuration for ArgoCD
   * @param options Sync options
   * @param timeoutMs Optional timeout in milliseconds (default: 4 minutes)
   * @returns Promise<ApplicationSyncResult> Detailed sync result with error handling
   */
  public async syncApplicationAdvanced(
    applicationName: string,
    config: ArgoCDConnectionConfig,
    options: SyncOptions = {},
    timeoutMs: number = 4 * 60 * 1000
  ): Promise<ApplicationSyncResult> {
    try {
      return await this.syncService.syncApplication(applicationName, config, options, timeoutMs);
    } catch (error) {
      // Return structured error information instead of throwing
      return {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        health: 'Unknown',
        sync: 'Failed',
        operationPhase: 'Error'
      };
    }
  }
} 