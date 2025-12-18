"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const Features = () => {
  const [aliases, setAliases] = useState([
    { id: "1", source: "contact@example.com", destination: "admin@example.com" },
  ]);
  const [forwardings, setForwardings] = useState([
    { id: "1", source: "sales@example.com", destination: "team@example.com" },
  ]);
  const [autoresponders, setAutoresponders] = useState([]);

  const [aliasSource, setAliasSource] = useState("");
  const [aliasDestination, setAliasDestination] = useState("");
  const [forwardSource, setForwardSource] = useState("");
  const [forwardDestination, setForwardDestination] = useState("");
  const [autoresponderEmail, setAutoresponderEmail] = useState("");
  const [autoresponderMessage, setAutoresponderMessage] = useState("");

  const handleAddAlias = () => {
    if (!aliasSource || !aliasDestination) {
      toast.error("Please fill in all fields");
      return;
    }
    setAliases([
      ...aliases,
      { id: String(Date.now()), source: aliasSource, destination: aliasDestination },
    ]);
    setAliasSource("");
    setAliasDestination("");
    toast.success("Alias added successfully!");
  };

  const handleAddForwarding = () => {
    if (!forwardSource || !forwardDestination) {
      toast.error("Please fill in all fields");
      return;
    }
    setForwardings([
      ...forwardings,
      { id: String(Date.now()), source: forwardSource, destination: forwardDestination },
    ]);
    setForwardSource("");
    setForwardDestination("");
    toast.success("Forwarding rule added successfully!");
  };

  const handleAddAutoresponder = () => {
    if (!autoresponderEmail || !autoresponderMessage) {
      toast.error("Please fill in all fields");
      return;
    }
    setAutoresponders([
      ...autoresponders,
      { id: String(Date.now()), source: autoresponderEmail, destination: autoresponderMessage },
    ]);
    setAutoresponderEmail("");
    setAutoresponderMessage("");
    toast.success("Autoresponder configured successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Fitur</h2>
        <p className="text-muted-foreground">Konfigurasi alias email, penerusan email, dan autoresponder otomatis</p>
      </div>

      <Tabs defaultValue="alias" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="alias">Alias Email</TabsTrigger>
          <TabsTrigger value="forwarding">Penerusan Email</TabsTrigger>
          <TabsTrigger value="autoresponder">Autoresponder</TabsTrigger>
        </TabsList>

        <TabsContent value="alias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alias Email</CardTitle>
              <CardDescription>Buat alias email yang meneruskan ke kotak email yang ada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="alias-source">Alias Email</Label>
                  <Input
                    id="alias-source"
                    placeholder="contact@example.com"
                    value={aliasSource}
                    onChange={(e) => setAliasSource(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alias-destination">Email Tujuan</Label>
                  <Input
                    id="alias-destination"
                    placeholder="admin@example.com"
                    value={aliasDestination}
                    onChange={(e) => setAliasDestination(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleAddAlias}>Buat Alias</Button>

              <div className="mt-6 space-y-2">
                {aliases.map((alias) => (
                  <div
                    key={alias.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium">{alias.source}</p>
                        <p className="text-xs text-muted-foreground">→ {alias.destination}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setAliases(aliases.filter((a) => a.id !== alias.id))}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forwarding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Penerusan Email</CardTitle>
              <CardDescription>Atur aturan penerusan email otomatis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="forward-source">Email Asal</Label>
                  <Input
                    id="forward-source"
                    placeholder="sales@example.com"
                    value={forwardSource}
                    onChange={(e) => setForwardSource(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forward-destination">Email Tujuan</Label>
                  <Input
                    id="forward-destination"
                    placeholder="team@example.com"
                    value={forwardDestination}
                    onChange={(e) => setForwardDestination(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleAddForwarding}>Atur Penerusan</Button>

              <div className="mt-6 space-y-2">
                {forwardings.map((forward) => (
                  <div
                    key={forward.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary text-primary-foreground">Active</Badge>
                      <div>
                        <p className="text-sm font-medium">{forward.source}</p>
                        <p className="text-xs text-muted-foreground">→ {forward.destination}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setForwardings(forwardings.filter((f) => f.id !== forward.id))}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="autoresponder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Autoresponder</CardTitle>
              <CardDescription>Atur respon otomatis email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="autoresponder-email">Alamat Email</Label>
                <Input
                  id="autoresponder-email"
                  placeholder="info@example.com"
                  value={autoresponderEmail}
                  onChange={(e) => setAutoresponderEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="autoresponder-message">Pesan Otomatis</Label>
                <textarea
                  id="autoresponder-message"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Terima kasih sudah mengirim email. Kami akan segera mengembalikan respon."
                  value={autoresponderMessage}
                  onChange={(e) => setAutoresponderMessage(e.target.value)}
                />
              </div>
              <Button onClick={handleAddAutoresponder}>Atur Respon Otomatis</Button>

              <div className="mt-6 space-y-2">
                {autoresponders.map((auto) => (
                  <div
                    key={auto.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-success text-success-foreground">Enabled</Badge>
                        <p className="text-sm font-medium">{auto.source}</p>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{auto.destination}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setAutoresponders(autoresponders.filter((a) => a.id !== auto.id))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Features;
