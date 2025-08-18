import { openDB, DBSchema } from 'idb';

interface MyDB extends DBSchema {
  mails: {
    value: {
      id: string,
      title: string,
      plain: string,
      text: string,
      date: string,
      read: boolean,
      reply: string,
      arrived: boolean,
      img: Blob[] | null,
    },
    key: string
  };
}

async function demo() {
  const db = await openDB<MyDB>('my-db', 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
      db.createObjectStore('mails', { keyPath: 'id' });

      generateDemo().forEach(item => {
        transaction.objectStore('mails').add(item);
      })
      transaction.done
        .then(() => {
          console.log('All data added')
        }).catch(() => {
          console.log('sometiong went wrong')
        });
    },
  });

  return db;
}

function generateDemo() {
  return new Array(100).fill(undefined).map((item, idx) => {
    const id = 'getTest' + idx.toString().padStart(3, '0');
    const title = 'test_tile' + idx.toString().padStart(3, '0');
    const plain = 'It is a long text' + idx.toString().padStart(3, '0');
    const text = 'It is a long text' + idx.toString().padStart(3, '0');
    const date = '2025/8/17';
    const read = true;
    const reply = '';
    const arrived = true;
    const img = null;
    return { id, title, plain, text, date, read, reply, arrived, img };
  })
}

export async function addDataTest() {
  const data = (await demo()).getAll('mails');
  return data;
}

export interface singleMail {
  id: string,
  title: string,
  plain: string,
  text: string,
  date: string,
  read: boolean,
  reply: string,
  arrived: boolean,
  img: Blob[] | null,
}

export async function saveMail(data: singleMail) {
  const db1 = await demo();
  
  db1.put('mails', {
    ...data,
    date: new Date().toDateString(),
  }).then(() => {
    console.log("保存成功")
  }).catch(() => console.error("something went wrong"));
}
