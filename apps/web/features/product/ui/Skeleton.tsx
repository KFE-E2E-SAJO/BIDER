const Skeleton = () => (
  <div className="flex animate-pulse items-center gap-4">
    <div className="h-[140px] w-[140px] flex-shrink-0 rounded bg-neutral-200" />
    <div className="flex flex-1 flex-col gap-4">
      <div className="h-3 w-full rounded bg-neutral-200" />
      <div className="h-3 w-4/5 rounded bg-neutral-200" />
      <div className="h-3 w-2/5 rounded bg-neutral-200" />
    </div>
  </div>
);
export default Skeleton;
