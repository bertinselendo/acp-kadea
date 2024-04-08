import PDFViewer from "@/components/pdf/pdf-viewer";

export type PageProps = {
  searchParams: any;
};

export default function Page({ searchParams }: PageProps) {
  const url = searchParams.url;

  return (
    <div className="w-full">
      <PDFViewer file={url} />
    </div>
  );
}
