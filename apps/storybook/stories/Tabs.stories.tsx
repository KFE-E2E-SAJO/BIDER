import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui/components/Tabs/Tabs';
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
  render: () => (
    <div>
      <Tabs defaultValue="all" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="a">경매 진행 중</TabsTrigger>
          <TabsTrigger value="b">낙찰</TabsTrigger>
          <TabsTrigger value="c">패찰</TabsTrigger>
        </TabsList>
        <TabsContent value="all">계정 설정 화면</TabsContent>
        <TabsContent value="a">경매 진행 중 화면</TabsContent>
        <TabsContent value="b">낙찰 화면</TabsContent>
        <TabsContent value="c">패찰 화면</TabsContent>
      </Tabs>
    </div>
  ),
};
