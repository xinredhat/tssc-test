/**
 * Interface for ArgoCD server connection information
 */
export interface ArgoCDConnectionInfo {
  serverUrl: string;
  username: string;
  password: string;
}

/**
 * ArgoCD connection configuration
 */
export interface ArgoCDConnectionConfig {
  namespace: string;
  instanceName?: string;
  timeout?: number;
  retries?: number;
}

/**
 * ArgoCD CLI configuration
 */
export interface ArgoCDCliConfig {
  serverUrl: string;
  username: string;
  password: string;
  insecure?: boolean;
  skipTestTls?: boolean;
  grpcWeb?: boolean;
} 