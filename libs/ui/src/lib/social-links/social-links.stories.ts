import {
  componentWrapperDecorator,
  type Meta,
  type StoryObj,
} from '@analogjs/storybook-angular';
import { expect, within } from 'storybook/test';
import { SocialLinks } from './social-links';

const meta: Meta<SocialLinks> = {
  title: 'UI/Social Links',
  component: SocialLinks,
  decorators: [
    // The product is dark by default (ADR-0008).
    componentWrapperDecorator(
      (story) =>
        `<div style="padding: 1.5rem; background: var(--gdg-color-background-default)">${story}</div>`,
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Social icon links from the Figma Workshop and Team pages. Each link is named after its owner and network, e.g. "Ada Lovelace on LinkedIn", and opens in a new tab (ADR-0016).',
      },
    },
  },
  args: {
    owner: 'Ada Lovelace',
    links: [
      { network: 'linkedin', url: 'https://www.linkedin.com/' },
      { network: 'x', url: 'https://x.com/' },
      { network: 'dribbble', url: 'https://dribbble.com/' },
    ],
  },
};
export default meta;

type Story = StoryObj<SocialLinks>;

/** LinkedIn, X and Dribbble, as in Figma. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'Ada Lovelace on LinkedIn',
    });
    await expect(link).toHaveAttribute('target', '_blank');
  },
};

export const AllNetworks: Story = {
  args: {
    links: [
      { network: 'linkedin', url: 'https://www.linkedin.com/' },
      { network: 'x', url: 'https://x.com/' },
      { network: 'github', url: 'https://github.com/' },
      { network: 'dribbble', url: 'https://dribbble.com/' },
      { network: 'website', url: 'https://gdg.community.dev/' },
    ],
  },
};
