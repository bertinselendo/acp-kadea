import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthVerifiyPage() {
  return (
    <div className="flex flex-col h-screen justify-center align-middle items-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Email envoyer</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Le message a ete envoyer</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}
