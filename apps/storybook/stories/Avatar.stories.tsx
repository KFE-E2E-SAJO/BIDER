import { Avatar } from '@repo/ui/components/Avatar/Avatar';
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

export const WithImage: Story = {
  render: () => (
    <div className="w-16">
      <Avatar src="https://i.pinimg.com/originals/36/9a/fb/369afb7c81a3278b1fd8f804cd105b37.jpg" />
    </div>
  ),
};

export const FallbackOnly: Story = {
  render: () => (
    <div className="w-16">
      <Avatar />
    </div>
  ),
};
