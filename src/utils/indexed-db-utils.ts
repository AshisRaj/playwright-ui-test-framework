import { Page } from '@playwright/test';

export class IndexedDbUtils {
  static async setupIndexedDb(page: Page, dbName: string, userData: any) {
    await page.evaluate(
      ({ dbName, userData }) => {
        const dbRequest = indexedDB.open(dbName, 1);

        dbRequest.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          db.createObjectStore('cookies-store', { keyPath: 'name' });
          db.createObjectStore('localStorage-store', { keyPath: 'name' });
        };

        dbRequest.onsuccess = () => {
          const db = dbRequest.result;

          // Store cookies
          const cookiesTransaction = db.transaction('cookies-store', 'readwrite');
          const cookiesStore = cookiesTransaction.objectStore('cookies-store');

          userData.cookies.forEach((cookie: any) => cookiesStore.put(cookie));

          // Store localStorage
          const localStorageTransaction = db.transaction('localStorage-store', 'readwrite');
          const localStorageStore = localStorageTransaction.objectStore('localStorage-store');

          userData.origins[0].localStorage.forEach((item: any) => localStorageStore.put(item));
        };
      },
      { dbName, userData },
    );
  }

  static async getCookiesFromIndexedDb(page: Page, dbName: string) {
    return await page.evaluate((dbName) => {
      return new Promise((resolve) => {
        const dbRequest = indexedDB.open(dbName, 1);

        dbRequest.onsuccess = () => {
          const db = dbRequest.result;
          const transaction = db.transaction('cookies-store', 'readonly');
          const store = transaction.objectStore('cookies-store');
          const getAllRequest = store.getAll();

          getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        };
      });
    }, dbName);
  }

  static async cleanupIndexedDb(page: Page, dbName: string) {
    await page.evaluate((dbName) => {
      indexedDB.deleteDatabase(dbName);
    }, dbName);
  }
}
