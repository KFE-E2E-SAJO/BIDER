const Skeleton = () => (
  <div className="my-7 flex animate-pulse justify-between gap-4">
    <div className="h-[140px] w-[140px] flex-shrink-0 rounded bg-neutral-200" />
    <div className="flex w-full flex-col">
      <div className="h-5 w-4/5 rounded bg-neutral-200"></div>
      <div className="mt-3 h-5 w-2/5 rounded bg-neutral-200"></div>
      <div className="mt-18 h-5 w-3/5 rounded bg-neutral-200"></div>
    </div>
  </div>
);
export default Skeleton;
