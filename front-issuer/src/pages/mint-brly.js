import { Layout as DashboardLayout } from '../layouts/dashboard/layout';

const Page = () => {
  return <h1>Tá....</h1>
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;