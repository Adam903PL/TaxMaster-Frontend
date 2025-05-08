// app/page.tsx (lub app/page.jsx)

import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/login');
}
