import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/Tooltip/Tooltip';

const AuctionTooltip = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="opacity-0">툴팁</p>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="mt-1">
          오늘이 입찰 마지막 기회!
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AuctionTooltip;
