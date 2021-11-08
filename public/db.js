let db;
let budgetdbVersion;

// Create a new db request for a "budgetdb" database.
const request = indexedDB.open('budgetdb', 1);

request.onupgradeneeded = function (e) {
  console.log('Upgrade needed in IndexDB');

  const { oldVersion } = e;
  const newVersion = e.newVersion || db.version;

  console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);

  db = e.target.result;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore('budgetdb', { autoIncrement: true });
  }
};

request.onerror = function (e) {
  console.log(`Woops! ${e.target.errorCode}`);
};

function checkDatabase() {
  console.log('check db invoked');

  
  let transaction = db.transaction(['budgetdb'], 'readwrite');

  
  const store = transaction.objectStore('budgetdb');

  
  const getAll = store.getAll();

  
  getAll.onsuccess = function () {
    
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((res) => {
        
          if (res.length !== 0) {
            
            transaction = db.transaction(['budgetdb'], 'readwrite');

            
            const currentStore = transaction.objectStore('budgetdb');

           
            currentStore.clear();
            console.log('Clearing store 🧹');
          }
        });
    }
  };
}

request.onsuccess = function (e) {
  console.log('success');
  db = e.target.result;

  // Check if app is online before reading from db
  if (navigator.onLine) {
    console.log('Backend online! 🗄️');
    checkDatabase();
  }
};

const saveRecord = (record) => {
  console.log('Save record invoked');
  const transaction = db.transaction(['budgetdb'], 'readwrite');
  const store = transaction.objectStore('budgetdb');

  store.add(record);
};

// Listen for app coming back online
window.addEventListener('online', checkDatabase);
