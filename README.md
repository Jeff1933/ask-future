**未来信箱**

这是一个基于Next.js构建的邮箱类应用，但是用户只有你自己...

可能的功能（根据设置送达时间从远到近）
  - 了解过去的你的兴趣爱好、所做的事、生活经历
  - 做一些短期规划，看看在规划内是否实现
  - 备忘录

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 设计说明

**项目存储方面采用IndexDB API，表格设计如下:**

经过调研，使用单表对邮件数据进行存储
  - 相关数据可通过一个事务获得，避免跨表查询复杂性
  - IndexDB是异步的，单次操作存储完整文章（含图片）比多次关联查询更高效

图片存储使用blob
  - 原生支持blob来存储二进制数据，无额外编码开销，体积更小，读写效率更高（如果使用base64有编码开销）
  - 可通过 URL.createObjectURL(blob) 生成临时 URL，直接用于 ```<img src>```
  - 大段 Base64 文本会增加 HTML 解析负担
  - 流式支持：支持分片读取（如 blob.slice()），适合流式加载大文件,canvas.toBlob()

localStorage: 
  - 仅限 5MB~10MB
  - 仅支持字符串键值，查询需遍历所有数据（性能极差）

indexdbDB: 
  - 一般最大可以达到磁盘空间的50% 邮箱需要存储大量邮件（含附件、富文本等）
  - 对象存储、索引，可高效查询
  - 异步API，避免阻塞UI线程

## idb库注意事项

本项目使用idb库简化indexdb使用，下面是相关的使用提醒：

[Do not await other things between the start and end of your transaction](https://www.npmjs.com/package/idb?activeTab=readme#general-enhancements)

## wangEditor使用问题

初始化内容时，在useEffect里面setTimout等待背景板异步渲染后再渲染文字

因为纯文本和有图片的数据结构不一样，在编辑模式下有图片和无图片的邮件之间切换时会出现无法寻找节点的错误
通过自动聚焦减缓这个bug。

## Jotai
- 使用jotai库替代useState和useContext使用，避免记忆化的需要

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
