import { cookies } from "next/headers";
import Image from "next/image";
import { Mail } from "@/components/mail";
import { accounts, mails } from "@/data/mock";

export default async function Home() {
  const cookieStore = await cookies();
  const layout = cookieStore.get("react-resizable-panels:layout:mail");
  const collapsed = cookieStore.get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;
  return (
    <>
      <div className="md:hidden flex h-[100vh] justify-center items-center">
        <Image 
          src="/img/page.png"
          alt="mail"
          width={1280}
          height={727}
          className="hidden dark:block"
        />
      </div>
      <section className="overflow-hidden rounded-[0.5rem] border border-border bg-background">
        <div className="hidden flex-col md:flex">
          <Mail 
            accounts={accounts}
            mails={mails}
            defaultCollapsed={defaultCollapsed}
            defaultLayout={defaultLayout}
            navCollapsedSize={4}
          />
        </div>
      </section>
    </>
  );
}
