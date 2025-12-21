interface PageProps {
  params: {
    orderId: string;
  };
}

export default function InvoiceDetailPage({ params }: PageProps) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">
        Invoice #{params.orderId}
      </h1>
    </div>
  );
}
