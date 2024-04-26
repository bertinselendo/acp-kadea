import ListInvoices from "@/components/admin/invoices/listInvoices";

export type PageProps = {};

export default function Page({ params }: any) {
  if (!params.projectID) {
    return;
  }
  return (
    <div className="w-full p-4 md:p-0 xl:w-[600px]">
      <div className="text-xl font-bold">Invoices</div>
      <div>
        <ListInvoices projectID={params.projectID} />
      </div>
    </div>
  );
}
