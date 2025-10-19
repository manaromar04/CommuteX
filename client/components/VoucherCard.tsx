import { Voucher } from "@shared/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";

interface VoucherCardProps {
  voucher: Voucher;
  onCopy?: (code: string) => void;
}

export function VoucherCard({ voucher, onCopy }: VoucherCardProps) {
  const [copied, setCopied] = useState(false);
  const now = new Date();
  const isExpired = voucher.expires_at < now;
  const daysLeft = Math.max(
    0,
    Math.ceil((voucher.expires_at.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  const serviceIcon = voucher.service === "SALIK" ? "🚗" : "🅿��";
  const serviceLabel = voucher.service === "SALIK" ? "Salik Toll" : "RTA Parking";

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    onCopy?.(voucher.code);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = () => {
    if (isExpired) return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
    if (voucher.status === "REDEEMED")
      return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
    return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800";
  };

  return (
    <Card className={`overflow-hidden transition-all ${getStatusColor()}`}>
      <CardContent className="p-0">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{serviceIcon}</span>
              <div>
                <h3 className="font-bold text-foreground">{serviceLabel}</h3>
                <p className="text-xs text-muted-foreground">{voucher.description}</p>
              </div>
            </div>
            <Badge
              className={
                isExpired
                  ? "bg-red-600"
                  : voucher.status === "REDEEMED"
                  ? "bg-green-600"
                  : "bg-blue-600"
              }
            >
              {isExpired ? "Expired" : voucher.status}
            </Badge>
          </div>

          {/* Discount Value */}
          <div className="bg-white dark:bg-background/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Discount Value</p>
            <p className="text-2xl font-bold text-green-600">{voucher.discount_aed} AED</p>
          </div>

          {/* Voucher Code */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Voucher Code</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono font-bold text-sm bg-white dark:bg-background/50 p-3 rounded border border-border">
                {voucher.code}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-10 w-10 p-0"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Validity Info */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              {isExpired ? (
                <Clock className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span>
                {isExpired
                  ? `Expired on ${voucher.expires_at.toLocaleDateString()}`
                  : daysLeft === 0
                  ? "Expires today"
                  : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`}
              </span>
            </div>
            <span className="text-muted-foreground">
              Created {voucher.created_at.toLocaleDateString()}
            </span>
          </div>

          {/* Usage Note */}
          {!isExpired && voucher.status === "ACTIVE" && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded p-2 text-xs text-yellow-800 dark:text-yellow-200">
              ✓ Ready to use on {voucher.service === "SALIK" ? "Salik app" : "RTA app"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
