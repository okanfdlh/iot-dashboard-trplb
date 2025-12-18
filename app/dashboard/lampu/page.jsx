import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";

const Billing = () => {
  const currentPlan = {
    name: "Professional",
    price: "$49",
    period: "per bulan",
    domains: 12,
    mailboxes: 50,
    storage: "500 GB",
    support: "Prioritas Support",
  };

  const features = [
    "Alias email tanpa batas",
    "Filter spam tingkat lanjut",
    "Aturan penerusan email",
    "Autoresponder",
    "Garansi uptime 99,9%",
    "Backup harian",
    "Enkripsi SSL/TLS",
    "Dukungan teknis 24/7",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Tagihan & Statistik</h2>
        <p className="text-muted-foreground">Kelola langganan dan lihat statistik penggunaan</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Langganan Aktif</CardTitle>
                <CardDescription>Detail langganan saat ini</CardDescription>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                <Zap className="mr-1 h-3 w-3" />
                Aktif
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-foreground">{currentPlan.name}</h3>
              <span className="text-2xl font-bold text-primary">{currentPlan.price}</span>
              <span className="text-sm text-muted-foreground">{currentPlan.period}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Domain</p>
                <p className="text-2xl font-bold text-foreground">12 / {currentPlan.domains}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Mailbox</p>
                <p className="text-2xl font-bold text-foreground">48 / {currentPlan.mailboxes}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Penyimpanan</p>
                <p className="text-2xl font-bold text-foreground">156 GB</p>
                <p className="text-xs text-muted-foreground">dari {currentPlan.storage}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Tingkat Dukungan</p>
                <p className="text-lg font-semibold text-foreground">{currentPlan.support}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1">Upgrade Paket</Button>
              <Button variant="outline">Unduh</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fitur Paket</CardTitle>
            <CardDescription>Semua yang termasuk</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 text-success flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistik Penggunaan</CardTitle>
          <CardDescription>Aktivitas email bulanan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <p className="text-3xl font-bold text-primary">2.847</p>
              <p className="text-sm text-muted-foreground">Email Terkirim</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <p className="text-3xl font-bold text-primary">4.512</p>
              <p className="text-sm text-muted-foreground">Email Diterima</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <p className="text-3xl font-bold text-success">98,2%</p>
              <p className="text-sm text-muted-foreground">Tingkat Pengiriman</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <p className="text-3xl font-bold text-warning">124</p>
              <p className="text-sm text-muted-foreground">Spam Diblokir</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
