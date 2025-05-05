#  NurtureNova Landing Page

A responsive and modern landing page built with **Next.js**, **TypeScript**, and **Tailwind CSS**, featuring the following pages:

-  Homepage
-  About Page
-  FAQs Page
-  Contact Us Page

---

##  Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Nodemailer** – for handling contact form submissions via email

---

##  Project Structure

```
/
├── app/
│   ├── page.tsx              # Homepage
│   ├── about/page.tsx        # About page
│   ├── faqs/page.tsx         # FAQs page
│   ├── contact/page.tsx      # Contact Us page
│   └── api/contact/route.ts  # API Route to handle email
│
├── components/               # Reusable components (Navbar, Footer, etc.)
├── public/                   # Static assets
├── .env                      # Environment variables (email config)
└── next.config.js            # Next.js configuration
```

---

##  Contact Form Integration

The contact form uses `Nodemailer` with SMTP to send emails.

### Environment Variables

Create a `.env` file in your root and configure the following:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
EMAIL_TO=optional-receiver-email (defaults to EMAIL_USER)
```

---

##  Bot Protection

Simple anti-spam measure using a **honeypot field** in the form. If filled (by bots), the form will silently fail.

---

##  Run Locally

1. **Clone the repo**

```bash
git clone https://github.com/NurtureNova/Landing-Page-V1.git
cd Landing-Page-V1
```

2. **Install dependencies**

```bash
npm install
```

3. **Add your `.env` file**

4. **Run the dev server**

```bash
npm run dev
```

Visit `http://localhost:3000` to view it in the browser.

---

##  Build for Production

To build and export for static hosting:

1. Update `next.config.js` with:

```ts
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

2. Then run:

```bash
npm run build
```

3. Your static site will be in the `out/` directory. You can deploy it on **Hostinger**, **Netlify**, **Vercel**, or any static hosting platform.

---

##  Performance Optimization

- Responsive design using Tailwind's utility classes
- Optimized images (use `.webp` where possible)
- Lazy-loaded sections
- Clean and accessible markup

---

##  License

This project is open-source and available under the [MIT License](LICENSE).

---

##  Author

Initiated by [Yusasive](https://yusufabdullah.netlify.app/)

