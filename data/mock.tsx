export const mails = [
  {
    id: "1",
    title: "what about you",
    text: "had you join in a company ?",
    date: "2025/8/10",
    read: true,
    reply: "yep",
    arrived: false,
  },
  {
    id: "2",
    title: "How are you?",
    text: "I think you can't code right ?",
    date: "2025/8/1",
    read: false,
    reply: "yep, I can't code",
    arrived: true,
  },
  {
    id: "3",
    title: "Today is raining",
    text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.",
    date: "2025/8/13",
    read: false,
    reply: "yep, I can't code",
    arrived: true,
  },
  {
    id: "4",
    title: "Catching the chance !",
    text: "I think you can't code right ?",
    date: "2025/8/13",
    read: false,
    reply: "yep, I can't code",
    arrived: false,
  },
] // 真实数据需要id随机唯一性
// T[number] 表示从数组类型 T 中提取出数组元素的类型。
export type Mail = (typeof mails)[number];

export const accounts = [
  {
    label: "现在的你",
    email: "now@you.com",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>iCloud</title>
        <path
          d="M13.762 4.29a6.51 6.51 0 0 0-5.669 3.332 3.571 3.571 0 0 0-1.558-.36 3.571 3.571 0 0 0-3.516 3A4.918 4.918 0 0 0 0 14.796a4.918 4.918 0 0 0 4.92 4.914 4.93 4.93 0 0 0 .617-.045h14.42c2.305-.272 4.041-2.258 4.043-4.589v-.009a4.594 4.594 0 0 0-3.727-4.508 6.51 6.51 0 0 0-6.511-6.27z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "未来的你",
    email: "future@you.com",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Gmail</title>
        <path
          d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export type Account = (typeof accounts)[number];