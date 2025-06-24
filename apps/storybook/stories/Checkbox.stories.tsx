import Checkbox from '@repo/ui/components/Checkbox/Checkbox';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Checkbox> = {
  title: 'Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  name: 'Default',
  render: (args) => <Checkbox id="checkbox-string" {...args} />,
};

export const LabelAsString: Story = {
  name: 'Label - String',
  render: (args) => <Checkbox id="checkbox-string" label="라벨입니당" {...args} />,
};

export const LabelAsJSX: Story = {
  name: 'Label - JSX',
  render: (args) => (
    <Checkbox
      id="checkbox-jsx"
      label={
        <div>
          이용약관 <span className="text-main">(필수)</span>
        </div>
      }
      {...args}
    />
  ),
};

export const Disabled: Story = {
  name: 'Disabled',
  render: (args) => (
    <Checkbox id="checkbox-disabled" label="disabled 되었슴다" disabled {...args} />
  ),
};
