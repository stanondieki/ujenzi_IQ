export declare function sendSMS(to: string | string[], message: string): Promise<any>;
export declare function formatAlertMessage(projectTitle: string, alertType: string, message: string): string;
export declare function sendBulkSMS(projectId: string, message: string, alertType: string): Promise<void>;
