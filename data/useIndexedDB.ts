export interface Database {
  sequenceId: number;
  projects: string;
}
export function openDB(dbName: string, version = 1) {
  // 在服务器端渲染时，直接返回一个 resolved 的 Promise(修复SSR框架下 window 为 undefined 的情况)
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }
  return new Promise<IDBDatabase>((resolve, _reject) => {
    //  兼容浏览器
    const indexedDB = window.indexedDB;
    let db: IDBDatabase;
    // 打开数据库，若没有则会创建
    const request = indexedDB.open(dbName, version);
    // 数据库打开成功回调
    request.onsuccess = function (event: Event) {
      db = (event.target as IDBOpenDBRequest).result as IDBDatabase; // 数据库对象
      // console.log('数据库打开成功');
      resolve(db);
    };
    // 数据库打开失败的回调
    request.onerror = function () {
      console.log('数据库打开报错');
    };
    // 数据库有更新时候的回调
    request.onupgradeneeded = function (event: Event) {
      // 数据库创建或升级的时候会触发
      console.log('onupgradeneeded');
      db = (event.target as IDBOpenDBRequest).result; // 数据库对象
      let objectStore;
      // 创建存储库
      objectStore = db.createObjectStore('nikkeProject', {
        keyPath: 'sequenceId', // 这是主键
        // autoIncrement: true // 实现自增
      });
      objectStore.createIndex('sequenceId', 'sequenceId', { unique: false });
      objectStore.createIndex('messageType', 'messageType', {
        unique: false,
      });
    };
  });
}

export function addData(db: IDBDatabase, storeName: string, data: Database) {
  const request = db
      .transaction([storeName], 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
      .objectStore(storeName) // 仓库对象
      .put(data);

  request.onsuccess = function () {
    console.log('数据写入成功');
  };

  request.onerror = function () {
    console.log('数据写入失败');
  };
}

export function getDataByKey(db: IDBDatabase, storeName: string, key: number) {
  return new Promise((resolve, _reject) => {
    const transaction = db.transaction([storeName]); // 事务
    const objectStore = transaction.objectStore(storeName); // 仓库对象
    const request = objectStore.get(key); // 通过主键获取数据

    request.onerror = function () {
      console.log('事务失败');
    };

    request.onsuccess = function () {
      // console.log("主键查询结果: ", request.result);
      resolve(request.result);
    };
  });
}

export function deleteDB(db: IDBDatabase, storeName: string, id: number) {
  const request = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(id);

  request.onsuccess = function () {
    console.log('数据删除成功');
  };

  request.onerror = function () {
    console.log('数据删除失败');
  };
}

export const addDataToDB = async (storeName: string, data: any) => {
  const dbPromise: Promise<IDBDatabase> = openDB('nikkeDatabase') as Promise<IDBDatabase>;
  const db: IDBDatabase = await dbPromise;
  addData(db, storeName, data);
};

// 获取数据
export const retrieveDataFromDB = async (storeName: string, key: number) => {
  const dbPromise: Promise<IDBDatabase> = openDB('nikkeDatabase') as Promise<IDBDatabase>;
  const db = await dbPromise;
  const result: any = await getDataByKey(db, storeName, key);
  return result;
};
