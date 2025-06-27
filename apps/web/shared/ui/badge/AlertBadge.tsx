interface AlertBadgeProps {
  placementClass?: string;
}

const AlertBadge = ({ placementClass }: AlertBadgeProps) => {
  return (
    <span
      className={`bg-alert ${placementClass} border-neutral-0 h-3.5 w-3.5 rounded-full border-2`}
    ></span>
  );
};

export default AlertBadge;
