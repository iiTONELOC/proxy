// store data for offline use 
// store friends profile pictures for global chat use

export function idbPromise(storeName, method, object) {
    return new Promise((resolve, reject) => {
        // open connection to the database `proximo-chat` with the version of 1
        const request = window.indexedDB.open('proxy', 1);
        // create variables to hold reference to the database, transaction (tx), and object store
        let db, tx, store;
        request.onupgradeneeded = function (e) {
            const db = request.result;
            db.createObjectStore('friend_images', { keyPath: '_id' });
        };
        // handle any errors with connecting
        request.onerror = function (e) {
            console.log('There was an error');
        };
        // on database open success
        request.onsuccess = function (e) {
            // save a reference of the database to the `db` variable
            db = request.result;
            // open a transaction do whatever we pass into `storeName` (must match one of the object store names)
            tx = db.transaction(storeName, 'readwrite');
            // save a reference to that object store
            store = tx.objectStore(storeName);
            // if there's any errors, let us know
            db.onerror = function (e) {
                console.log('error', e);
            };
            switch (method) {
                case 'put':
                    console.log(store,)
                    store.put(object);
                    resolve(object);
                    break;
                case 'get':
                    const all = store.getAll();
                    all.onsuccess = function () {
                        resolve(all.result);
                    };
                    break;
                case 'delete':
                    store.delete(object._id);
                    break;
                default:
                    console.log('No valid method');
                    break;
            }
            // when the transaction is complete, close the connection
            tx.oncomplete = function () {
                db.close();
            };
        };
    });
};

// store friends profile pictures for global chat use
export const updateFriendImages = async (data) => {
    if (Array.isArray(data)) {
        return data.forEach(async friend => {
            const storeData = {
                _id: friend?.username,
                picture: friend?.profile?.profilePicture
            };
            try {
                return await idbPromise('friend_images', 'put', storeData);
            } catch (error) {
                console.log('Error accessing IDB', error)
            }
        })
    } else {
        if (typeof data === 'object' && !Array.isArray(data)) {
            return await idbPromise('friend_images', 'put', data);
        }
    }
}