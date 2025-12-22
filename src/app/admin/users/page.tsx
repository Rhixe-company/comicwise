import { DataTable } from '#admin/DataTable';
import { db } from '#database/db';
import { Suspense } from "react";
import { user } from "src/database";

async function UsersTable() {
  const users = await db.select().from(user);

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
  ];

  return <DataTable columns={columns} data={users} />;
}

function UsersHeader() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
      <p className="text-muted-foreground">Manage all users in the platform</p>
    </div>
  );
}

/**
 *
 */
export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <UsersHeader />

      <Suspense fallback={<div>Loading users...</div>}>
        <UsersTable />
      </Suspense>
    </div>
  );
}
