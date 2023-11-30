import Head from "next/head";
import { PAGE_TITLE } from "src/constants";

export function PageTitle({ children }) {
  return (
    <Head>
      <title>
        {children} | {PAGE_TITLE}
      </title>
    </Head>
  );
}
