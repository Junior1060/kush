# Email setup — fixing "I never got the 6-digit code"

The app confirms sign-ups with a **6-digit code** (`verifyOtp({ type: "signup", token })` in
[`components/welcome/WelcomeAuth.tsx`](../../components/welcome/WelcomeAuth.tsx)). For that to work,
two things must be true on the **Supabase project** (these are dashboard settings, not app code):

## 1. The email template must contain the code — `{{ .Token }}`  ← the actual bug

Supabase's **default** "Confirm signup" template only contains a magic link
(`{{ .ConfirmationURL }}`) and **no code**. So users got an email with a *link* but never a
*six-digit code*, and the app's verify screen had nothing valid to enter.

**Fix:** Dashboard → **Authentication → Emails → Templates → "Confirm signup"** → paste the contents
of [`confirm-signup.html`](./confirm-signup.html) (it uses `{{ .Token }}`) → **Save**.

> You can keep the link too, but `{{ .Token }}` **must** be present for the 6-digit flow to work.

## 2. Email must actually be delivered

Confirmed via the live API that signup returns `200` with `confirmation_sent_at` set — Supabase
*accepts* the signup and *attempts* the send. If users still don't receive it, the cause is the
**built-in email service**:

- It is **rate-limited** (a few emails per hour for the whole project) and meant only for testing.
  Once the limit is hit, **no email goes out and no error is shown to the user.**
- Deliverability is best-effort; messages often land in **spam**.

**Fix for production:** Dashboard → **Authentication → Emails → SMTP Settings** → enable a custom
SMTP provider (Resend, Postmark, SendGrid, Amazon SES, etc.) and raise the rate limits under
**Authentication → Rate Limits**. This is the launch blocker already flagged in the root `README.md`.

## Quick checklist when "no code arrives"

1. Template "Confirm signup" contains `{{ .Token }}`? (section 1)
2. Custom SMTP configured, or are you within the built-in hourly limit? (section 2)
3. Check the recipient's **spam** folder.
4. Dashboard → **Authentication → Rate Limits** — not exceeded.
5. Dashboard → **Logs → Auth** — look for send failures for that email.
