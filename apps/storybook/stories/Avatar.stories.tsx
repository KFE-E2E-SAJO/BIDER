import { Avatar, AvatarImage, AvatarFallback } from '@repo/ui/components/Avatar/Avatar';
import type { Meta, StoryObj } from '@storybook/react-vite';

/* ------------------------------------------------------------------ */
/* 📑 Storybook 메타데이터                                             */
/* ------------------------------------------------------------------ */
const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    className: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

/* ------------------------------------------------------------------ */
/* 🌟 Stories                                                         */
/* ------------------------------------------------------------------ */

/** 👉 정상적으로 이미지를 불러온 상태 */
export const WithImage: Story = {
  render: () => (
    <div className="w-16">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/64?img=24" alt="User profile" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/** 👉 이미지가 없을 때 Fallback 렌더링 */
export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};
