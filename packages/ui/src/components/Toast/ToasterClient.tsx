'use client';
import { Toast } from '@/components/Toast/sonner';
interface ToasterClientProps {
  [key: string]: any;
}

export function ToasterClient(props: ToasterClientProps) {
  return <Toast {...props} />;
}
