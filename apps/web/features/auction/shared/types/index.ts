interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export interface UrlSyncTabsProps {
  defaultValue: string;
  items: TabItem[];
  className?: string;
}
