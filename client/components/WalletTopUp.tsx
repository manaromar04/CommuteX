import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, CheckCircle, AlertCircle } from "lucide-react";

const PAYMENT_METHODS = [
  {
    id: "credit_card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Visa, Mastercard, American Express",
  },
  {
    id: "apple_pay",
    name: "Apple Pay",
    icon: Wallet,
    description: "Quick and secure",
  },
  {
    id: "google_pay",
    name: "Google Pay",
    icon: Wallet,
    description: "Fast checkout",
  },
];

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000];

interface WalletTopUpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  onTopUp?: (amount: number) => void;
}

export function WalletTopUp({
  open,
  onOpenChange,
  currentBalance,
  onTopUp,
}: WalletTopUpProps) {
  const [step, setStep] = useState<"amount" | "payment" | "confirm">("amount");
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);

  const displayAmount = customAmount ? parseFloat(customAmount) || amount : amount;

  const handleAmountSelect = (presetAmount: number) => {
    setAmount(presetAmount);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
  };

  const handleContinue = () => {
    if (displayAmount <= 0) {
      return;
    }
    setStep("payment");
  };

  const handlePaymentConfirm = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep("confirm");
  };

  const handleClose = () => {
    setStep("amount");
    setAmount(100);
    setCustomAmount("");
    setSelectedPayment("credit_card");
    onOpenChange(false);
  };

  const handleFinish = () => {
    if (onTopUp) {
      onTopUp(displayAmount);
    }
    handleClose();
  };

  if (step === "confirm") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your wallet has been topped up
              </p>
            </div>
            <Card className="mt-4 p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Added:</span>
                <span className="font-bold text-green-600">{displayAmount} AED</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-muted-foreground">New Balance:</span>
                <span className="font-bold text-primary">
                  {currentBalance + displayAmount} AED
                </span>
              </div>
            </Card>
            <Button onClick={handleFinish} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === "payment") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose how you'd like to pay {displayAmount} AED
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                    selectedPayment === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{method.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                    {selectedPayment === method.id && (
                      <Badge className="bg-primary text-primary-foreground">
                        Selected
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 dark:text-blue-200">
                Your payment is secure and encrypted. No charges will appear until you confirm.
              </p>
            </div>
          </Card>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setStep("amount")}>
              Back
            </Button>
            <Button onClick={handlePaymentConfirm} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Top Up Your Wallet</DialogTitle>
          <DialogDescription>
            Add funds to your CommuteX wallet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Balance */}
          <Card className="p-4 bg-muted">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-3xl font-bold text-primary mt-1">
                {currentBalance} AED
              </p>
            </div>
          </Card>

          {/* Amount Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleAmountSelect(preset)}
                  className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                    amount === preset && !customAmount
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="custom-amount" className="text-sm font-medium">
              Or Enter Custom Amount
            </Label>
            <div className="relative">
              <Input
                id="custom-amount"
                type="number"
                placeholder="Enter amount in AED"
                value={customAmount}
                onChange={(e) => handleCustomAmount(e.target.value)}
                min="10"
                max="10000"
                className="pl-8"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                ℓ
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum: 10 AED • Maximum: 10,000 AED
            </p>
          </div>

          {/* Amount to be Added */}
          <Card className="p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount to Add</span>
              <span className="font-bold text-green-600">{displayAmount} AED</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="text-muted-foreground">New Balance</span>
              <span className="font-bold text-primary">
                {currentBalance + displayAmount} AED
              </span>
            </div>
          </Card>

          {/* Rewards Info */}
          <Card className="p-3 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-900 dark:text-yellow-200">
              💡 <strong>Tip:</strong> Top up larger amounts to get better value. Bonus rewards may apply!
            </p>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleContinue} disabled={displayAmount <= 0}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
