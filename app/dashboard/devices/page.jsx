"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DomainTable } from "@/components/DomainTable";
import { AddDomainDrawer } from "@/components/AddDomainDrawer";
import { mockDomains } from "@/lib/mockData";
import { Plus } from "lucide-react";

const Domains = () => {
  const [domains, setDomains] = useState(mockDomains);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAddDomain = (newDomain) => {
    const domain = {
      id: String(Date.now()),
      name: newDomain.name,
      status: newDomain.verified ? "active" : "pending",
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      verified: newDomain.verified,
    };
    setDomains([...domains, domain]);
  };

  const handleDeleteDomain = (domain) => {
    setDomains(domains.filter((d) => d.id !== domain.id));
  };

  return (
    <div className="space-y-6">
      {/* Header halaman */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Manajemen Domain
          </h2>
          <p className="text-muted-foreground">
            Kelola domain email dan pengaturan DNS Anda
          </p>
        </div>
        <Button onClick={() => setDrawerOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Domain
        </Button>
      </div>

      {/* Tabel domain */}
      <DomainTable domains={domains} onDelete={handleDeleteDomain} />

      {/* Drawer untuk menambahkan domain */}
      <AddDomainDrawer
        open={drawerOpen}
        side="right"
        onOpenChange={setDrawerOpen}
        onAdd={handleAddDomain}
      />
    </div>
  );
};

export default Domains;
