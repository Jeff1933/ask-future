import { openDB, DBSchema } from 'idb';
import { format } from "date-fns";

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
      arrived: string,
      send: boolean,
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
  return new Array(1).fill(undefined).map((item, idx) => {
    const id = new Date().toISOString();
    const title = '欢迎信';
    const plain = '感谢您使用ask future! 发送邮件去询问未来的自己！信封会在未来的指定日期送达，这个应用所有数据将保存在您的浏览器，无需担心隐私泄露';
    const text = '感谢您使用ask future! 发送邮件去询问未来的自己！信封会在未来的指定日期送达，这个应用所有数据将保存在您的浏览器，无需担心隐私泄露';
    const date = format(new Date(), "yyyy/MM/dd");
    const read = true;
    const reply = '';
    const arrived = '2025/08/17';
    const send = true;
    const img = null;
    return { id, title, plain, text, date, read, reply, arrived, send, img };
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
  arrived: string,
  send: boolean,
  img: Blob[] | null,
}

export async function saveMail(data: singleMail) {
  const db1 = await demo();
  
  const fmDate = formatDate(new Date());
  db1.put('mails', {
    ...data,
    date: fmDate,
  }).then(() => {
    console.log("保存成功")
  }).catch(() => console.error("something went wrong"));
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}`;
}

export async function deleteMail(data: singleMail) {
  const db1 = await demo();

  db1.delete('mails', data.id).then(() => {
    console.log("删除成功");
  }).catch((e) => {
    console.error(`删除失败：${e}`);
  })
}