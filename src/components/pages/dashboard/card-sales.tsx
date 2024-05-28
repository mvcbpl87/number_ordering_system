import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  className?:string
  type:string,
  title: string;
  icon: React.ElementType;
  value: number | null;
  descriptions: string;
};

export default function CardSales({
  className,
  type,
  title,
  icon: Icon,
  value,
  descriptions,
}: Props) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{type == 'currency' ? `RM${!value ? 0 : value}` : value}</div>
        <p className="text-xs text-muted-foreground">{descriptions}</p>
      </CardContent>
    </Card>
  );
}
