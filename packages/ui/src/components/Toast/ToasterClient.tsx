'use client';
import { Toaster } from '@/components/Toast/sonner';
interface ToasterClientProps {
  [key: string]: any;
}

export function ToasterClient(props: ToasterClientProps) {
  return <Toaster {...props} />;
}
