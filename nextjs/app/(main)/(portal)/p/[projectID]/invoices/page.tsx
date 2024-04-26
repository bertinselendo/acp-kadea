import ListInvoices from "@/components/admin/invoices/listInvoices";

export type PageProps = {};

export default function Page({ params }: any) {
  if (!params.projectID) {
    return;
  }
  return (
    <div className="w-[600px]">
      <div className="text-xl font-bold">Invoices</div>
      <div>
        <ListInvoices projectID={params.projectID} />
      </div>
    </div>
  );
}
