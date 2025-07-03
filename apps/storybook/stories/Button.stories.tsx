// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@repo/ui/components/Button/Button';
import { Map, MapPin, MessageSquareMore, Plus, X } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],

  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'lg', 'sm', 'thin', 'icon', 'fit'],
    },
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'muted', 'ghost', 'link', 'loading'],
    },
    shape: {
      control: 'select',
      options: ['default', 'rounded'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ✅ 기본 버튼
export const Default: Story = {
  name: 'Default',
  render: (args) => <Button {...args}>버튼</Button>,
};

// ✅ Secondary
export const Secondary: Story = {
  name: 'Secondary',
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'lg', 'sm', 'thin', 'icon', 'fit'],
    },
    shape: {
      control: 'select',
      options: ['default', 'rounded'],
    },
    variant: {
      control: false,
    },
  },
  args: {
    variant: 'secondary',
  },
  render: (args) => (
    <Button variant="secondary" {...args}>
      secondary
    </Button>
  ),
};

// ✅ laoding
export const Loading: Story = {
  name: 'Loading',
  parameters: {
    controls: { disable: true },
  },
  render: (args) => (
    <Button variant="loading" disabled {...args}>
      로딩중 ...
    </Button>
  ),
};

// ✅ Outline
export const Outline: Story = {
  name: 'Outline',
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'lg', 'sm', 'thin', 'icon', 'fit'],
    },
    shape: {
      control: 'select',
      options: ['default', 'rounded'],
    },
    variant: {
      control: false,
    },
  },
  args: {
    variant: 'outline',
  },
  render: (args) => (
    <Button {...args} variant="outline">
      outline
    </Button>
  ),
};

// ✅ 아이콘 포함 (좌측)
export const WithIcon: Story = {
  name: 'With Icon',
  parameters: {
    controls: { disable: true },
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Button {...args}>
        <Plus size={15} />
        글쓰기
      </Button>
      <Button {...args} variant="outline">
        <Plus size={20} />
        글쓰기
      </Button>
      <Button {...args} variant="outline" size="sm">
        <Plus />
        글쓰기
      </Button>
    </div>
  ),
};

// ✅ Muted
export const Muted: Story = {
  name: 'Muted',
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'lg', 'sm', 'thin', 'icon', 'fit'],
    },
    shape: {
      control: 'select',
      options: ['default', 'rounded'],
    },
    variant: {
      control: false,
    },
  },
  args: {
    variant: 'muted',
  },
  render: (args) => (
    <Button {...args} variant="muted">
      muted
    </Button>
  ),
};

// ✅ link
export const Link: Story = {
  name: 'Link',
  parameters: {
    controls: { disable: true },
  },
  render: (args) => (
    <div className="flex gap-4">
      <Button {...args} variant="link" size="fit" className="text-caption text-neutral-900">
        로그아웃
      </Button>
      <Button {...args} variant="link" size="fit" className="text-main">
        회원가입
      </Button>
    </div>
  ),
};

// ✅ Disabled
export const Disabled: Story = {
  name: 'Disabled',
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'lg', 'sm', 'thin', 'icon', 'fit'],
    },
    shape: {
      control: 'select',
      options: ['default', 'rounded'],
    },
    variant: {
      control: false,
    },
  },
  args: {
    size: 'icon',
  },
  render: (args) => (
    <Button {...args} disabled>
      경매종료
    </Button>
  ),
};

// ✅ Icon Only
export const IconOnly: Story = {
  name: 'Icon Only',
  argTypes: {
    size: {
      control: false,
    },
    shape: {
      control: 'select',
      options: ['default', 'rounded'],
    },
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'muted', 'ghost', 'link', 'loading'],
    },
  },
  render: (args) => (
    <div className="flex gap-2">
      <Button size="icon" {...args} className="size-30">
        <Plus size={50} />
      </Button>
      <Button size="icon" {...args}>
        <MessageSquareMore />
      </Button>
      <Button size="icon" {...args} className="text-body size-30 rounded-full bg-neutral-900">
        <X size={12} />
      </Button>
    </div>
  ),
};

// ✅ Rounded
export const Rounded: Story = {
  name: 'Rounded',
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Button shape="rounded" {...args} size="fit">
        <Plus /> 글쓰기
      </Button>
      <Button shape="rounded" {...args} size="fit" className="text-body h-9 bg-neutral-900">
        <MapPin /> 강남구 역삼동
      </Button>
      <Button shape="rounded" {...args} size="fit" className="text-body bg-neutral-900">
        <Map /> 지도로 보기
      </Button>
    </div>
  ),
};
