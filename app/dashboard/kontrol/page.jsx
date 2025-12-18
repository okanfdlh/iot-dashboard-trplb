"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MailboxTable } from "@/components/MailboxTable";
import { AddMailboxDrawer } from "@/components/AddMailboxDrawer";
import { mockMailboxes, mockDomains } from "@/lib/mockData";
import { Plus } from "lucide-react";

const Mailboxes = () => {
  const [mailboxes, setMailboxes] = useState(mockMailboxes);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const domains = mockDomains.map((d) => d.name);

  const handleAddMailbox = (newMailbox) => {
    const mailbox = {
      id: String(Date.now()),
      email: `${newMailbox.username}@${newMailbox.domain}`,
      domain: newMailbox.domain,
      status: "active",
      quota: newMailbox.quota,
      used: "0 GB",
    };
    setMailboxes([...mailboxes, mailbox]);
  };

  const handleDeleteMailbox = (mailbox) => {
    setMailboxes(mailboxes.filter((m) => m.id !== mailbox.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Manajemen Email
          </h2>
          <p className="text-muted-foreground">
            Buat dan manajemen akun email
          </p>
        </div>
        <Button onClick={() => setDrawerOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Buat Akun Email
        </Button>
      </div>

      <MailboxTable mailboxes={mailboxes} onDelete={handleDeleteMailbox} />

      <AddMailboxDrawer
        open={drawerOpen}
        side="right"
        onOpenChange={setDrawerOpen}
        onAdd={handleAddMailbox}
        domains={domains}
      />
    </div>
  );
};

export default Mailboxes;
