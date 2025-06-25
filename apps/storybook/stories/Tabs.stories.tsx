import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import type { Meta, StoryObj } from '@storybook/react-vite';

/* ------------------------------------------------------------------ */
/* 📑 Storybook 메타데이터                                             */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    className: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

/* ------------------------------------------------------------------ */
/* 🌟 Stories                                                         */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  render: () => {
    const items = [
      { value: 'all', label: '전체', content: '계정 설정 화면' },
      { value: 'a', label: '경매 진행 중', content: '경매 진행 중 화면' },
      { value: 'b', label: '낙찰', content: '낙찰 화면' },
      { value: 'c', label: '패찰', content: '패찰 화면' },
    ];

    return <Tabs defaultValue="all" items={items} />;
  },
};
