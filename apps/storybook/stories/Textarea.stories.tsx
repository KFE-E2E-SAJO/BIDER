import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '@repo/ui/components/Textarea/Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'ui/Textarea',
  component: Textarea,
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const FormStyle: Story = {
  args: {
    size: 'form',
    intent: 'form',
    placeholder: '상품의 상태, 구매 시기, 사용감 등을 자세히 설명해 주세요.',
  },
};

export const ChatStyle: Story = {
  args: {
    size: 'chat',
    intent: 'chat',
    placeholder: '메시지 보내기',
  },
};
