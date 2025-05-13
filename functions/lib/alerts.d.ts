import * as admin from 'firebase-admin';
interface Alert {
    projectId: string;
    type: 'warning' | 'danger' | 'info';
    message: string;
    stakeholders: string[];
    createdAt: admin.firestore.Timestamp;
}
export declare const createAlert: (projectId: string, type: Alert['type'], message: string) => Promise<string>;
export {};
