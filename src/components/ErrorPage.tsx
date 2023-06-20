import Link from "../uiComponents/Link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getLocaleFromPathname } from "../utils";
import Button from "./Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error?: Error;
  reset?: () => void;
}) {
  const locale = getLocaleFromPathname(usePathname());

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full h-full text-center pt-16 text-digitalent-blue">
      <p className="text-3xl py-32">Something went wrong!</p>
      <p>{error?.message}</p>
      <code className="block py-4">
        {error?.stack?.split("\n").map((line, i) => `${i}: ${line}`)}
      </code>
      <Link href={`/${locale}`}>
        <Button onClick={reset} name="Go back">
          Go back home
        </Button>
      </Link>
    </div>
  );
}
