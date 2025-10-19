import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Copy, Check, Tag } from "lucide-react";

type ServiceType = "SALIK" | "RTA";

interface VoucherOption {
  service: ServiceType;
  points: number;
  discount: number;
  icon: string;
  description: string;
  validDays: number;
}

interface RedeemVouchersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userPoints: number;
  onRedeem: (service: ServiceType, pointsCost: number, discount: number) => void;
}

const voucherOptions: VoucherOption[] = [
  {
    service: "SALIK",
    points: 150,
    discount: 50,
    icon: "🚗",
    description: "Get 50 AED discount on toll charges",
    validDays: 30,
  },
  {
    service: "RTA",
    points: 120,
    discount: 30,
    icon: "🅿️",
    description: "Get 30 AED discount on parking fees",
    validDays: 30,
  },
];

export function RedeemVouchersModal({
  open,
  onOpenChange,
  userPoints,
  onRedeem,
}: RedeemVouchersModalProps) {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeemedVouchers, setRedeemedVouchers] = useState<
    Array<{ code: string; service: ServiceType; expires: Date }>
  >([]);

  const handleRedeem = (service: ServiceType, points: number, discount: number) => {
    if (userPoints < points) return;

    // Generate voucher code
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const code = `${service}-${Array.from({ length: 5 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("")}-${Array.from({ length: 5 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("")}`;

    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 30);

    setRedeemedVouchers((prev) => [
      ...prev,
      { code, service, expires: expiresDate },
    ]);

    onRedeem(service, points, discount);
    setSelectedService(null);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const hasRedeemed = (service: ServiceType) =>
    redeemedVouchers.some((v) => v.service === service);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Redeem Vouchers
          </DialogTitle>
          <DialogDescription>
            Convert your reward points into discounts for Salik tolls and RTA parking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Points Balance */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Points</p>
                  <p className="text-3xl font-bold text-primary">{userPoints}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Max Discount Value</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {Math.floor((userPoints / 150) * 50)} AED
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voucher Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Available Vouchers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {voucherOptions.map((option) => {
                const isAffordable = userPoints >= option.points;
                const isRedeemed = hasRedeemed(option.service);

                return (
                  <Card
                    key={option.service}
                    className={`cursor-pointer transition-all ${
                      selectedService === option.service
                        ? "ring-2 ring-primary bg-primary/5"
                        : ""
                    } ${!isAffordable ? "opacity-60" : ""}`}
                    onClick={() =>
                      isAffordable && !isRedeemed && setSelectedService(option.service)
                    }
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{option.icon}</span>
                          <div>
                            <CardTitle className="text-lg">{option.service}</CardTitle>
                            <CardDescription className="text-xs">
                              {option.description}
                            </CardDescription>
                          </div>
                        </div>
                        {isRedeemed && (
                          <Badge className="bg-green-500">Redeemed</Badge>
                        )}
                        {!isAffordable && (
                          <Badge variant="destructive">Insufficient Points</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded">
                          <p className="text-muted-foreground text-xs">Points Cost</p>
                          <p className="font-bold text-blue-600">{option.points} pts</p>
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded">
                          <p className="text-muted-foreground text-xs">You Get</p>
                          <p className="font-bold text-green-600">{option.discount} AED</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Valid for {option.validDays} days after redemption
                      </p>

                      {selectedService === option.service && (
                        <Button
                          onClick={() =>
                            handleRedeem(
                              option.service,
                              option.points,
                              option.discount
                            )
                          }
                          className="w-full mt-2"
                          disabled={!isAffordable}
                        >
                          Confirm Redemption
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Redeemed Vouchers */}
          {redeemedVouchers.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Your Voucher Codes</h3>
              <div className="space-y-3">
                {redeemedVouchers.map((voucher, idx) => (
                  <Card key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {voucher.service} Voucher
                            </p>
                            <p className="font-mono font-bold text-lg tracking-wider">
                              {voucher.code}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(voucher.code)}
                            className="gap-2"
                          >
                            {copiedCode === voucher.code ? (
                              <>
                                <Check className="h-4 w-4" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Expires: {voucher.expires.toLocaleDateString()}
                          </span>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Use this code on the {voucher.service} app to get your discount
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Usage Instructions */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <CardTitle className="text-base">How to Use</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>For Salik:</strong> Open the Salik app → Add Code → Enter voucher code
                → Discount applied to your account
              </p>
              <p>
                <strong>For RTA:</strong> Open RTA app → Parking → Add Promo → Enter voucher
                code → Get discount on next parking
              </p>
              <p className="text-muted-foreground italic">
                💡 Voucher codes are valid for 30 days from the date of redemption.
              </p>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
