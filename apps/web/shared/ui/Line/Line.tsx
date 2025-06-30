interface LineProps {
  className: string;
}

const Line = ({ className }: LineProps) => {
  return <div className={`h-[1px] w-full bg-neutral-100 ${className}`}></div>;
};

export default Line;
