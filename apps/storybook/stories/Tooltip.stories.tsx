import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/Tooltip/Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <h3>버튼</h3>
        </TooltipTrigger>
        <TooltipContent>툴팁 내용입니다</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Top: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <h3>버튼</h3>
        </TooltipTrigger>
        <TooltipContent side="top">툴팁 내용입니다</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
