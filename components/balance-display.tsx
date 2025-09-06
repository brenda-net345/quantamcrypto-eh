import { Card, CardContent } from "@/components/ui/card"

interface BalanceDisplayProps {
  usdBalance: number
  btcBalance: number
  ethBalance: number
  usdtBalance: number
}

export function BalanceDisplay({ usdBalance, btcBalance, ethBalance, usdtBalance }: BalanceDisplayProps) {
  const getBalanceColor = (balance: number) => {
    return balance >= 0.0000000001 ? "text-green-500" : "text-white"
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Balance in USD</p>
            <p className={`text-lg font-bold ${getBalanceColor(usdBalance)}`}>
              ${usdBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">BTC Balance</p>
            <p className={`text-lg font-bold ${getBalanceColor(btcBalance)}`}>{btcBalance.toFixed(5)} BTC</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">ETH Balance</p>
            <p className={`text-lg font-bold ${getBalanceColor(ethBalance)}`}>{ethBalance.toFixed(5)} ETH</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">USDT Balance</p>
            <p className={`text-lg font-bold ${getBalanceColor(usdtBalance)}`}>{usdtBalance.toFixed(5)} USDT</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
