import { notFound } from "next/navigation";
import AdminTablePage from "@/components/admin/AdminTablePage";
import { findAdminTable } from "@/lib/adminTables";

interface Props {
  params: Promise<{
    table: string;
  }>;
}

export default async function AdminTable({ params }: Props) {
  const { table } = await params;

  if (!findAdminTable(table)) notFound();

  // key: al pasar de una tabla a otra el componente arranca con el estado limpio
  return <AdminTablePage key={table} tableKey={table} />;
}
