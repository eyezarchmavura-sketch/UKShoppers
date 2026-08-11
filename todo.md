# Payment Gateway Integration — Todo

## Research
- [ ] Review current Checkout.tsx payment step UI
- [ ] Confirm gateway SDKs available (react-paystack, Flutterwave V3)

## Build
- [ ] Add react-paystack + flutterwave-react-v3 dependencies
- [ ] Create PaymentGateways component: Paystack, Flutterwave, M-Pesa, Bank Transfer, Wallet
- [ ] Gateway selection per destination country (TZ/RW/UG → Paystack or Flutterwave; KE → M-Pesa via gateway)
- [ ] Wire checkout step 2: select gateway → pay → confirmation state with ref/transaction ID
- [ ] Persist payment method preference
- [ ] Update landing FAQ if needed (payment methods already mentioned)

## Verify & Deliver
- [ ] Screenshot checkout flow on desktop + mobile
- [ ] Checkpoint and deliver

## FLUTTERWAVE SDK NOTE (fixed TS error)
- flutterwave-react-v3 exports: `useFlutterwave` (hook) and `FlutterWaveButton` (component). NOT `FlutterWavePayment`.
- useFlutterwave(config) returns fn({callback, onClose}) — use in Checkout for flutterwave option.
- TS fix: import { useFlutterwave } from "flutterwave-react-v3"; call inside component when gateway==="flutterwave" && step===2.

## Checkout.tsx status
Written with: PaystackButton (react-paystack), Flutterwave via useFlutterwave hook, M-Pesa STK push dialog, bank transfer dialog, wallet partial pay.
TS error on line 345 — needs fix: replace <FlutterWavePayment> with useFlutterwave hook usage.
Remaining: fix TS, remove the render-prop FlutterWavePayment block, verify checkout screenshot (desktop+mobile), checkpoint, deliver.
