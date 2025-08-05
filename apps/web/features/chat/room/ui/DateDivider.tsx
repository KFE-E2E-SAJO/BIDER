interface DateDividerProps {
  isoDate: string;
}

export const DateDivider = ({ isoDate }: DateDividerProps) => {
  const date = new Date(isoDate);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const formatted = `${yyyy}년 ${mm}월 ${dd}일`;

  return (
    <div className="flex items-center gap-[9px] py-[30px]">
      <div className="flex-grow border-t border-neutral-100" />
      <span className="typo-caption-medium whitespace-nowrap text-neutral-600">{formatted}</span>
      <div className="flex-grow border-t border-neutral-100" />
    </div>
  );
};
