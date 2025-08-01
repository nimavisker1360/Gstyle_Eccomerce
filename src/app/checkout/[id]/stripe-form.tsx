import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import ProductPrice from "@/components/shared/product/product-price";
import { SERVER_URL } from "@/lib/constants";

export default function StripeForm({
  priceInCents,
  orderId,
}: {
  priceInCents: number;
  orderId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || elements == null || email == null) {
      console.log("Missing required data:", {
        stripe: !!stripe,
        elements: !!elements,
        email,
      });
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    const returnUrl = `${SERVER_URL}/checkout/${orderId}/stripe-payment-success`;
    console.log("Return URL:", returnUrl);

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
      })
      .then(({ error }) => {
        if (error) {
          console.error("Stripe payment error:", error);
          if (
            error.type === "card_error" ||
            error.type === "validation_error"
          ) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage("An unknown error occurred");
          }
        } else {
          console.log("Payment confirmed successfully");
        }
      })
      .catch((error) => {
        console.error("Unexpected error during payment:", error);
        setErrorMessage("An unexpected error occurred");
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-xl">Stripe Checkout</div>
      {errorMessage && <div className="text-destructive">{errorMessage}</div>}
      <PaymentElement />
      <div>
        <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      </div>
      <Button
        className="w-full"
        size="lg"
        disabled={stripe == null || elements == null || isLoading}
      >
        {isLoading ? (
          "Purchasing..."
        ) : (
          <div>
            Purchase - <ProductPrice price={priceInCents / 100} plain />
          </div>
        )}
      </Button>
    </form>
  );
}
